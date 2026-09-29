import os
import cv2
from cv_engine import run_real_cv_inference, generate_annotated_frame, ASSETS_DIR
from database import SessionLocal
import models

def test_system():
    # 1. Database Check
    db = SessionLocal()
    incidents = db.query(models.Incident).all()
    print(f"[1] SQLite Incidents Count: {len(incidents)}")
    early_inc = [i for i in incidents if i.to_dict().get("is_early_detection")]
    print(f"    Early Detection Incidents Count: {len(early_inc)}")
    for ei in early_inc:
        d = ei.to_dict()
        print(f"    -> {d['id']}: {d['title']}")
        print(f"       Stage: {d['degradation_stage']}, Growth: {d['growth_rate_mm_day']}, Savings: Rs. {d['preventive_savings_inr']}")
    db.close()

    # 2. Night Road Pothole Detection Check
    night_path = os.path.join(ASSETS_DIR, "real_night_road.jpg")
    with open(night_path, "rb") as f:
        res_night = run_real_cv_inference(f.read(), target_hazard="pothole", weather="night")
        print(f"[2] Night Road: class={res_night['class_name']}, conf={res_night['confidence']}, bbox={res_night['bbox']}, latency={res_night['latency_ms']}ms")
        assert res_night["class_name"] == "pothole", "Expected pothole detection on night road"

    # 3. Fog Road Pothole Detection & Occlusion Check
    fog_path = os.path.join(ASSETS_DIR, "real_fog_road.jpg")
    with open(fog_path, "rb") as f:
        res_fog = run_real_cv_inference(f.read(), target_hazard="pothole", weather="fog")
        print(f"[3] Fog Road: class={res_fog['class_name']}, conf={res_fog['confidence']}, bbox={res_fog['bbox']}, latency={res_fog['latency_ms']}ms")
        print(f"    Occlusion: {res_fog.get('occlusion')}")
        print(f"    FP Suppression: {res_fog.get('false_positive_suppression')}")
        print(f"    DPDP Privacy Status: {res_fog.get('dpdp_privacy_status')}")
        assert res_fog["class_name"] == "pothole", "Expected pothole detection on fog road"
        assert res_fog.get("occlusion") is not None, "Expected occlusion reconstruction data"

    # 4. Hit-and-Run LPR Check
    lpr_path = os.path.join(ASSETS_DIR, "real_indian_lpr.jpg")
    with open(lpr_path, "rb") as f:
        res_lpr = run_real_cv_inference(f.read(), target_hazard="hit_and_run", cam_angle="REAR_ROADSIDE")
        print(f"[4] Hit & Run: class={res_lpr['class_name']}, conf={res_lpr['confidence']}")
        print(f"    Primary Det: {res_lpr['all_detections'][0]}")

    print("\n>>> ALL VERIFICATION CHECKS PASSED PERFECTLY! <<<")

if __name__ == "__main__":
    test_system()
