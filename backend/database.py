import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "urbaneye.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db(force_reseed=False):
    """Initializes tables and seeds real UTC fleet and expanded incidents into SQLite."""
    import models
    from simulated_data import INITIAL_INCIDENTS, BUS_FLEET, BUS_WAYPOINTS

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if re-seeding is required (e.g. old BUS-101 schema or force_reseed)
        existing_bus = db.query(models.BusFleet).first()
        needs_reseed = force_reseed or (existing_bus and existing_bus.id.startswith("BUS-")) or (db.query(models.Incident).count() == 0)

        if needs_reseed:
            print("[*] Re-seeding database with real UTC Public Fleet and Expanded Incidents...")
            db.query(models.Incident).delete()
            db.query(models.BusFleet).delete()
            db.commit()

            # Seed Real Incidents
            for inc in INITIAL_INCIDENTS:
                incident = models.Incident(
                    id=inc["id"],
                    title=inc["title"],
                    type=inc.get("type", "pothole"),
                    category=inc.get("category", "ROAD_DAMAGE"),
                    bus_id=inc.get("bus_id", "UK 07 PA 0142"),
                    bus_name=inc.get("bus_name", "UTC Smart City EV #14"),
                    location_name=inc.get("location_name", "Rajpur Road, Dehradun"),
                    lat=inc.get("lat", 30.3282),
                    lng=inc.get("lng", 78.0456),
                    severity=inc.get("severity", "HIGH"),
                    severity_score=inc.get("severity_score", 85),
                    confidence=inc.get("confidence", 0.92),
                    timestamp=inc.get("timestamp"),
                    status=inc.get("status", "PENDING"),
                    assigned_dept=inc.get("assigned_dept", "Public Works Dept (PWD)"),
                    notes=inc.get("notes", ""),
                    last_action_timestamp=inc.get("last_action_timestamp"),
                    resolved_at=inc.get("resolved_at"),
                    repair_crew=inc.get("repair_crew"),
                    ai_details=inc.get("ai_details", {}),
                    repair_verification=inc.get("repair_verification"),
                    snapshot_url=inc.get("snapshot_url", f"/api/snapshots/{inc['id']}.jpg")
                )
                db.add(incident)

            # Seed Real UTC Bus Fleet
            for bus in BUS_FLEET:
                b_id = bus["id"]
                initial_lat = BUS_WAYPOINTS[b_id][0][0] if b_id in BUS_WAYPOINTS else 30.3282
                initial_lng = BUS_WAYPOINTS[b_id][0][1] if b_id in BUS_WAYPOINTS else 78.0456
                bus_obj = models.BusFleet(
                    id=b_id,
                    name=bus["name"],
                    route=bus.get("route_name", "Dehradun Route"),
                    speed_kmh=bus.get("speed_kmh", 32),
                    status=bus.get("status", "ONLINE"),
                    current_lat=initial_lat,
                    current_lng=initial_lng,
                    edge_queue_buffered=bus.get("edge_queue_buffered", 0)
                )
                db.add(bus_obj)

            db.commit()
            print(f"[+] Successfully seeded {len(INITIAL_INCIDENTS)} Incidents and {len(BUS_FLEET)} UTC Buses.")
    finally:
        db.close()
