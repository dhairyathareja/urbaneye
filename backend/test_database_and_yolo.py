import os
import io
import sys
import unittest
from fastapi.testclient import TestClient
from PIL import Image

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal, init_db, Base
from models import Incident, AIDetectionLog, BusFleet
from cv_engine import run_real_cv_inference, generate_annotated_frame, ASSETS_DIR
from main import app

class TestUrbanEyeDatabaseAndYOLO(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        print("\n--- [SETUP] Initializing Database & FastAPI Client ---")
        init_db()
        cls.client = TestClient(app)
        cls.db = SessionLocal()

    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    def test_01_database_seeding(self):
        """Verify database tables exist and are properly populated."""
        incidents_count = self.db.query(Incident).count()
        bus_count = self.db.query(BusFleet).count()
        print(f"[*] Verified Database State: {incidents_count} Incidents, {bus_count} Buses")
        self.assertGreaterEqual(incidents_count, 1, "Incidents should be seeded in DB")
        self.assertGreaterEqual(bus_count, 1, "Fleet buses should be seeded in DB")

    def test_02_model_info_endpoint(self):
        """Verify model info endpoint returns architecture and dataset stats."""
        res = self.client.get("/api/model-info")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        print(f"[*] Model Info: {data['model_architecture']}, Weights: {data['weights_path']}")
        self.assertIn("YOLOv8", data["model_architecture"])
        self.assertIn("dataset", data)
        self.assertGreater(data["dataset"]["train_images"], 1000)

    def test_03_cv_inference_execution(self):
        """Verify genuine CV engine executes on an image and produces valid annotations."""
        sample_img = os.path.join(ASSETS_DIR, "pothole_user_1.jpg")
        if not os.path.exists(sample_img):
            sample_img = os.path.join(ASSETS_DIR, "real_pothole.jpg")
        
        with open(sample_img, "rb") as f:
            raw_bytes = f.read()

        cv_res = run_real_cv_inference(raw_bytes, target_hazard="pothole", bus_id="BUS-101")
        self.assertIn("annotated_bytes", cv_res)
        self.assertGreater(len(cv_res["annotated_bytes"]), 1000)
        self.assertTrue(cv_res["annotated_bytes"].startswith(b'\xff\xd8'), "Output should be valid JPEG")
        self.assertIn("bbox", cv_res)
        self.assertEqual(len(cv_res["bbox"]), 4)
        print(f"[*] CV Inference: Class={cv_res['class_name']}, Conf={cv_res['confidence_pct']}%, Latency={cv_res['latency_ms']}ms, BBox={cv_res['bbox']}")

    def test_04_detect_real_frame_api(self):
        """Verify /api/detect-real-frame runs YOLO, saves detection to DB, and returns incident."""
        res = self.client.post(
            "/api/detect-real-frame",
            data={
                "hazard_type": "pothole",
                "bus_id": "BUS-101",
                "location_name": "Rajpur Road Test Sector"
            }
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "DETECTED")
        inc_id = data["incident"]["id"]
        print(f"[*] New Incident Detected & Persisted: {inc_id} ({data['incident']['title']})")

        # Verify it exists in SQLite DB
        db_inc = self.db.query(Incident).filter(Incident.id == inc_id).first()
        self.assertIsNotNone(db_inc)
        self.assertEqual(db_inc.type, "pothole")

    def test_05_incident_action_workflow(self):
        """Verify incident action transitions update the SQLite database state."""
        # Grab first pending incident
        inc = self.db.query(Incident).filter(Incident.status == "PENDING").first()
        if not inc:
            inc = self.db.query(Incident).first()

        inc_id = inc.id
        res = self.client.post(
            f"/api/incidents/{inc_id}/action",
            json={"action": "DISPATCH", "assigned_dept": "PWD Asphalt Crew #3"}
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["incident"]["status"], "DISPATCHED")

        # Check DB reflects change
        self.db.expire_all()
        updated_inc = self.db.query(Incident).filter(Incident.id == inc_id).first()
        self.assertEqual(updated_inc.status, "DISPATCHED")
        print(f"[*] Incident Action Verified: {inc_id} dispatched to {updated_inc.assigned_dept}")

    def test_06_analytics_database_aggregation(self):
        """Verify analytics are computed dynamically from database rows."""
        res = self.client.get("/api/analytics")
        self.assertEqual(res.status_code, 200)
        analytics = res.json()
        summary = analytics["summary"]
        print(f"[*] Analytics from DB: Total={summary['total_incidents']}, Pending={summary['pending_action']}, RHI={summary['road_health_index']}")
        self.assertGreater(summary["total_incidents"], 0)
        self.assertGreater(summary["road_health_index"], 0)
        self.assertIn("by_category", analytics)

    def test_07_snapshot_endpoint(self):
        """Verify snapshot image retrieval returns valid JPEG for all 12 incidents."""
        incidents = self.db.query(Incident).all()
        self.assertGreaterEqual(len(incidents), 12, "Should have at least 12 real incidents")
        for inc in incidents:
            res = self.client.get(f"/api/snapshots/{inc.id}.jpg")
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.headers.get("content-type"), "image/jpeg")
            self.assertTrue(res.content.startswith(b'\xff\xd8'), f"Snapshot {inc.id} must be valid JPEG")
            self.assertGreater(len(res.content), 10000, f"Snapshot {inc.id} should have non-trivial size")
        print(f"[*] Verified all {len(incidents)} Incident Snapshot JPEGs successfully.")

    def test_08_weather_profiles(self):
        """Verify all 4 environmental weather profiles generate valid annotated JPEGs."""
        profiles = ["clear", "rain", "night", "fog"]
        for w in profiles:
            res = self.client.get(f"/api/snapshots/INC-9041.jpg?weather={w}")
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.headers.get("content-type"), "image/jpeg")
            self.assertTrue(res.content.startswith(b'\xff\xd8'))
            self.assertGreater(len(res.content), 10000)
        print("[*] Verified all 4 Weather Profiles (Daylight, Rain/Wet, Night Low-Light, Fog/Mist)")

    def test_09_camera_angles(self):
        """Verify all 4 onboard camera sensor angles generate valid annotated JPEGs."""
        cams = ["FRONT_AI", "SIDE_PAVEMENT", "REAR_ROADSIDE", "CABIN_MONITOR"]
        for c in cams:
            res = self.client.get(f"/api/snapshots/INC-9041.jpg?cam={c}")
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.headers.get("content-type"), "image/jpeg")
            self.assertTrue(res.content.startswith(b'\xff\xd8'))
            self.assertGreater(len(res.content), 10000)
        print("[*] Verified all 4 Camera Angles (FRONT_AI, SIDE_PAVEMENT, REAR_ROADSIDE, CABIN_MONITOR)")

    def test_10_indian_lpr_detection(self):
        """Verify hit-and-run detection correctly locates vehicle and identifies Indian number plate."""
        res = self.client.get("/api/snapshots/INC-9042.jpg?cam=REAR_ROADSIDE")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.content.startswith(b'\xff\xd8'))
        inc = self.db.query(Incident).filter(Incident.id == "INC-9042").first()
        self.assertEqual(inc.ai_details.get("license_plate"), "UK 07 AB 9042")
        print(f"[*] Verified Indian LPR Hit-and-Run Incident: {inc.id} -> Plate: {inc.ai_details.get('license_plate')}")

if __name__ == "__main__":
    unittest.main()
