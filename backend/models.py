import json
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, JSON
from database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(50), index=True, default="pothole")
    category = Column(String(50), default="ROAD_DAMAGE")
    bus_id = Column(String(50), index=True, default="BUS-101")
    bus_name = Column(String(100), default="Fleet Bus")
    location_name = Column(String(255), default="Rajpur Road, Dehradun")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    severity = Column(String(20), default="HIGH")
    severity_score = Column(Integer, default=85)
    confidence = Column(Float, default=0.92)
    timestamp = Column(String(50), default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    status = Column(String(30), default="PENDING", index=True)
    assigned_dept = Column(String(100), default="Public Works Dept (PWD)")
    notes = Column(Text, default="")
    last_action_timestamp = Column(String(50), nullable=True)
    resolved_at = Column(String(50), nullable=True)
    repair_crew = Column(String(100), nullable=True)
    ai_details = Column(JSON, default=dict)
    repair_verification = Column(JSON, nullable=True)
    snapshot_url = Column(String(255), default="")

    def to_dict(self):
        ai = self.ai_details or {}
        return {
            "id": self.id,
            "title": self.title,
            "type": self.type,
            "category": self.category,
            "bus_id": self.bus_id,
            "bus_name": self.bus_name,
            "location_name": self.location_name,
            "lat": self.lat,
            "lng": self.lng,
            "severity": self.severity,
            "severity_score": self.severity_score,
            "confidence": self.confidence,
            "timestamp": self.timestamp,
            "status": self.status,
            "assigned_dept": self.assigned_dept,
            "notes": self.notes or "",
            "last_action_timestamp": self.last_action_timestamp,
            "resolved_at": self.resolved_at,
            "repair_crew": self.repair_crew,
            "ai_details": ai,
            "is_early_detection": ai.get("is_early_detection", False),
            "degradation_stage": ai.get("degradation_stage", None),
            "growth_rate_mm_day": ai.get("growth_rate_mm_day", None),
            "failure_risk_14d": ai.get("failure_risk_14d", None),
            "preventive_savings_inr": ai.get("preventive_savings_inr", None),
            "repair_verification": self.repair_verification,
            "snapshot_url": self.snapshot_url or f"/api/snapshots/{self.id}.jpg"
        }


class AIDetectionLog(Base):
    __tablename__ = "ai_detection_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    incident_id = Column(String(50), nullable=True, index=True)
    model_name = Column(String(50), default="YOLOv8n-Pothole-v1")
    class_name = Column(String(50), default="pothole")
    confidence = Column(Float, nullable=False)
    bbox = Column(JSON, default=list)  # [x1, y1, x2, y2]
    latency_ms = Column(Float, default=14.2)
    surface_area_m2 = Column(Float, default=1.5)
    depth_cm = Column(Float, default=12.0)
    created_at = Column(String(50), default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    def to_dict(self):
        return {
            "id": self.id,
            "incident_id": self.incident_id,
            "model_name": self.model_name,
            "class_name": self.class_name,
            "confidence": self.confidence,
            "bbox": self.bbox,
            "latency_ms": self.latency_ms,
            "surface_area_m2": self.surface_area_m2,
            "depth_cm": self.depth_cm,
            "created_at": self.created_at
        }


class BusFleet(Base):
    __tablename__ = "bus_fleet"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    route = Column(String(100))
    speed_kmh = Column(Integer, default=32)
    status = Column(String(30), default="ON_ROUTE")
    current_lat = Column(Float, default=30.3165)
    current_lng = Column(Float, default=78.0322)
    last_updated = Column(String(50), default=lambda: datetime.now().strftime("%H:%M:%S"))
    edge_queue_buffered = Column(Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "route": self.route,
            "speed_kmh": self.speed_kmh,
            "status": self.status,
            "current_lat": self.current_lat,
            "current_lng": self.current_lng,
            "last_updated": self.last_updated,
            "edge_queue_buffered": self.edge_queue_buffered
        }
