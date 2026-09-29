import hashlib
import time
from datetime import datetime

# 100% Dehradun Smart City Public Fleet (Uttarakhand Transport Corporation - UTC) Telemetry

BUS_FLEET = [
    {
        "id": "UK 07 PA 0142",
        "name": "UTC Smart City EV #14 (Route 1: ISBT -> Clock Tower -> Rajpur Road)",
        "model": "Tata Ultra 9m Electric AC",
        "status": "ONLINE",
        "speed_kmh": 32,
        "driver": "Rajeshwar Rawat",
        "driver_fatigue_score": 98,
        "navic_satellites": 14,
        "route_name": "Route 1 (ISBT - Rajpur Road Corridor)",
        "device_cert": "CERT-BEL-UTC-142-VALIDATED",
        "encryption": "TLS 1.3 / MQTT-Secured",
        "edge_queue_buffered": 0
    },
    {
        "id": "UK 07 PA 0284",
        "name": "UTC Smart City EV #28 (Route 4: Railway Station -> EC Road -> Sahastradhara)",
        "model": "Tata Ultra 9m Electric AC",
        "status": "ONLINE",
        "speed_kmh": 28,
        "driver": "Amitabh Negi",
        "driver_fatigue_score": 95,
        "navic_satellites": 12,
        "route_name": "Route 4 (EC Road - Sahastradhara Line)",
        "device_cert": "CERT-BEL-UTC-284-VALIDATED",
        "encryption": "TLS 1.3 / MQTT-Secured",
        "edge_queue_buffered": 0
    },
    {
        "id": "UK 07 GA 1108",
        "name": "UTC Dehradun City Bus #11 (Route 8: Prem Nagar -> Ballupur Chowk -> Paltan Bazaar)",
        "model": "Ashok Leyland Falcon City Bus",
        "status": "ONLINE",
        "speed_kmh": 38,
        "driver": "Suresh Semwal",
        "driver_fatigue_score": 99,
        "navic_satellites": 15,
        "route_name": "Route 8 (Chakrata Road Line)",
        "device_cert": "CERT-BEL-UTC-108-VALIDATED",
        "encryption": "TLS 1.3 / MQTT-Secured",
        "edge_queue_buffered": 4
    },
    {
        "id": "UK 07 PA 0419",
        "name": "UTC Smart City EV #41 (Route 12: Clement Town -> Haridwar Bypass -> Rispana)",
        "model": "Tata Ultra 9m Electric AC",
        "status": "ONLINE",
        "speed_kmh": 30,
        "driver": "Vikas Gusain",
        "driver_fatigue_score": 92,
        "navic_satellites": 13,
        "route_name": "Route 12 (Haridwar Bypass Corridor)",
        "device_cert": "CERT-BEL-UTC-419-VALIDATED",
        "encryption": "TLS 1.3 / MQTT-Secured",
        "edge_queue_buffered": 0
    }
]

# Support both new UTC IDs and legacy aliases for backward compatibility
BUS_WAYPOINTS = {
    "UK 07 PA 0142": [
        [30.3450, 78.0650], [30.3350, 78.0550], [30.3282, 78.0456],
        [30.3255, 78.0437], [30.3165, 78.0322], [30.2900, 78.0050]
    ],
    "UK 07 PA 0284": [
        [30.3200, 78.0500], [30.3228, 78.0495], [30.3250, 78.0580],
        [30.3380, 78.0750], [30.3410, 78.0780], [30.3200, 78.0500]
    ],
    "UK 07 GA 1108": [
        [30.3350, 77.9980], [30.3390, 78.0065], [30.3300, 78.0120],
        [30.3220, 78.0250], [30.3210, 78.0410], [30.3165, 78.0322]
    ],
    "UK 07 PA 0419": [
        [30.2700, 78.0000], [30.2865, 78.0075], [30.2950, 78.0300],
        [30.2980, 78.0310], [30.3050, 78.0400], [30.3150, 78.0450]
    ],
    # Aliases
    "BUS-101": [
        [30.3450, 78.0650], [30.3350, 78.0550], [30.3282, 78.0456],
        [30.3255, 78.0437], [30.3165, 78.0322], [30.2900, 78.0050]
    ],
    "BUS-204": [
        [30.3200, 78.0500], [30.3228, 78.0495], [30.3250, 78.0580],
        [30.3380, 78.0750], [30.3410, 78.0780], [30.3200, 78.0500]
    ],
    "BUS-309": [
        [30.3350, 77.9980], [30.3390, 78.0065], [30.3300, 78.0120],
        [30.3220, 78.0250], [30.3210, 78.0410], [30.3165, 78.0322]
    ],
    "BUS-412": [
        [30.2700, 78.0000], [30.2865, 78.0075], [30.2950, 78.0300],
        [30.2980, 78.0310], [30.3050, 78.0400], [30.3150, 78.0450]
    ]
}

def generate_evidence_hash(incident_id, timestamp):
    payload = f"{incident_id}-{timestamp}-DEHRADUN-BEL-CYBER-SYNDICATES"
    return hashlib.sha256(payload.encode()).hexdigest()[:32]

# MULTI-PASS FLEET DEDUPLICATED ROAD DEFECTS
MULTI_PASS_DEFECTS = [
    {
        "defect_id": "RD-102",
        "title": "Recurring Asphalt Crater & Surface Fracture",
        "location_name": "Rajpur Road, Near Astley Hall, Dehradun",
        "lat": 30.3282,
        "lng": 78.0456,
        "total_observations": 3,
        "first_detected": "08:42:15",
        "last_detected": "11:17:38",
        "confidence": 0.97,
        "severity": "CRITICAL",
        "severity_score": 92,
        "defect_history": [
            {"pass": 1, "bus_id": "UK 07 PA 0142", "time": "08:42:15", "confidence": 0.82, "depth_cm": 12.0},
            {"pass": 2, "bus_id": "UK 07 PA 0284", "time": "09:58:40", "confidence": 0.89, "depth_cm": 13.5},
            {"pass": 3, "bus_id": "UK 07 GA 1108", "time": "11:17:38", "confidence": 0.94, "depth_cm": 14.5}
        ],
        "formula_breakdown": {
            "defect_size_weight": "40% (2.4 m² / 14.5 cm depth) -> 37.6 pts",
            "traffic_exposure_weight": "25% (340 veh/hr) -> 23.5 pts",
            "confidence_weight": "20% (94% AI Conf) -> 18.8 pts",
            "recurrence_weight": "15% (3 fleet passes) -> 12.0 pts",
            "total_score": "91.9 -> 92 (Priority P1)"
        },
        "evidence_sha256": generate_evidence_hash("RD-102", "11:17:38")
    }
]

# 8 EXPANDED DIVERSE REAL DEHRADUN INCIDENTS
INITIAL_INCIDENTS = [
    {
        "id": "INC-9041",
        "title": "CRITICAL: Severe Pothole & Asphalt Fracture",
        "type": "pothole",
        "category": "ROAD_DAMAGE",
        "bus_id": "UK 07 PA 0142",
        "bus_name": "UTC Smart City EV #14 (Route 1)",
        "location_name": "Rajpur Road, Near Astley Hall, Dehradun",
        "lat": 30.3282,
        "lng": 78.0456,
        "severity": "CRITICAL",
        "severity_score": 96,
        "confidence": 0.98,
        "timestamp": "2026-09-24 07:17:38",
        "status": "PENDING",
        "assigned_dept": "Public Works Dept (PWD)",
        "multi_pass_count": 3,
        "ai_details": {
            "surface_area_m2": 2.4,
            "depth_cm": 14.5,
            "vehicle_exposure_per_hr": 340,
            "evidence_sha256": generate_evidence_hash("INC-9041", "07:17:38"),
            "inference_hardware": "NVIDIA Jetson AGX Orin Edge",
            "estimated_repair_cost_inr": 18400
        },
        "snapshot_url": "/api/snapshots/INC-9041.jpg"
    },
    {
        "id": "INC-9042",
        "title": "EMERGENCY: Hit-and-Run / Rash Driving Vehicle Tracking",
        "type": "hit_and_run",
        "category": "CRIME_TRAFFIC_SAFETY",
        "bus_id": "UK 07 PA 0284",
        "bus_name": "UTC Smart City EV #28 (Route 4)",
        "location_name": "Clock Tower (Ghanta Ghar) Chowk, Dehradun",
        "lat": 30.3255,
        "lng": 78.0437,
        "severity": "CRITICAL",
        "severity_score": 99,
        "confidence": 0.96,
        "timestamp": "2026-09-24 07:14:10",
        "status": "PENDING",
        "assigned_dept": "Dehradun Traffic Police",
        "multi_pass_count": 1,
        "ai_details": {
            "vehicle_track_id": "V-17",
            "license_plate": "UK 07 AB 9042",
            "vehicle_make": "Maruti Suzuki Dzire",
            "ocr_confidence": 0.945,
            "speed_exceeded_kmh": 78,
            "lane_violation": "Rash Evasive Multi-Lane Drift",
            "evidence_sha256": generate_evidence_hash("INC-9042", "07:14:10")
        },
        "snapshot_url": "/api/snapshots/INC-9042.jpg"
    },
    {
        "id": "INC-9043",
        "title": "Monsoon Waterlogging & Sump Drainage Overflow",
        "type": "waterlogging",
        "category": "URBAN_HAZARD",
        "bus_id": "UK 07 GA 1108",
        "bus_name": "UTC Dehradun City Bus #11 (Route 8)",
        "location_name": "EC Road Near Survey Chowk, Dehradun",
        "lat": 30.3228,
        "lng": 78.0495,
        "severity": "HIGH",
        "severity_score": 89,
        "confidence": 0.94,
        "timestamp": "2026-09-24 07:10:05",
        "status": "PENDING",
        "assigned_dept": "Dehradun Jal Sansthan / Municipal Corp",
        "multi_pass_count": 2,
        "ai_details": {
            "submergence_depth_cm": 24.0,
            "lane_obstruction_pct": 65,
            "waterlogged_area_m2": 48.0,
            "evidence_sha256": generate_evidence_hash("INC-9043", "07:10:05")
        },
        "snapshot_url": "/api/snapshots/INC-9043.jpg"
    },
    {
        "id": "INC-9044",
        "title": "School Children & Pedestrian High-Density Risk Zone",
        "type": "pedestrian",
        "category": "SAFETY_RISK",
        "bus_id": "UK 07 PA 0419",
        "bus_name": "UTC Smart City EV #41 (Route 12)",
        "location_name": "ISBT Dehradun / Haridwar Bypass Crossing",
        "lat": 30.2865,
        "lng": 78.0075,
        "severity": "HIGH",
        "severity_score": 86,
        "confidence": 0.91,
        "timestamp": "2026-09-24 07:05:44",
        "status": "PENDING",
        "assigned_dept": "Traffic Police Dehradun",
        "multi_pass_count": 1,
        "ai_details": {
            "pedestrian_count": 14,
            "zebra_crossing_present": False,
            "speed_limit_warning_active": True,
            "evidence_sha256": generate_evidence_hash("INC-9044", "07:05:44")
        },
        "snapshot_url": "/api/snapshots/INC-9044.jpg"
    },
    {
        "id": "INC-9045",
        "title": "Deep Structural Asphalt Crater Cluster",
        "type": "pothole",
        "category": "ROAD_DAMAGE",
        "bus_id": "UK 07 GA 1108",
        "bus_name": "UTC Dehradun City Bus #11 (Route 8)",
        "location_name": "Chakrata Road Near Ballupur Chowk, Dehradun",
        "lat": 30.3390,
        "lng": 78.0065,
        "severity": "CRITICAL",
        "severity_score": 93,
        "confidence": 0.95,
        "timestamp": "2026-09-24 07:01:18",
        "status": "PENDING",
        "assigned_dept": "Public Works Dept (PWD)",
        "multi_pass_count": 3,
        "ai_details": {
            "surface_area_m2": 3.1,
            "depth_cm": 16.2,
            "heavy_axle_stress": True,
            "evidence_sha256": generate_evidence_hash("INC-9045", "07:01:18")
        },
        "snapshot_url": "/api/snapshots/INC-9045.jpg"
    },
    {
        "id": "INC-9046",
        "title": "Severe Vehicle Bottleneck & Speed Drop Gridlock",
        "type": "traffic",
        "category": "TRAFFIC_CONGESTION",
        "bus_id": "UK 07 PA 0142",
        "bus_name": "UTC Smart City EV #14 (Route 1)",
        "location_name": "Paltan Bazaar Radial Junction, Dehradun",
        "lat": 30.3210,
        "lng": 78.0410,
        "severity": "HIGH",
        "severity_score": 84,
        "confidence": 0.93,
        "timestamp": "2026-09-24 06:58:22",
        "status": "PENDING",
        "assigned_dept": "Traffic Police Dehradun",
        "multi_pass_count": 4,
        "ai_details": {
            "flow_velocity_kmh": 7.8,
            "queue_length_meters": 420,
            "congestion_density_pct": 88,
            "evidence_sha256": generate_evidence_hash("INC-9046", "06:58:22")
        },
        "snapshot_url": "/api/snapshots/INC-9046.jpg"
    },
    {
        "id": "INC-9047",
        "title": "Subway & Culvert Water Ingress Submergence",
        "type": "waterlogging",
        "category": "URBAN_HAZARD",
        "bus_id": "UK 07 PA 0419",
        "bus_name": "UTC Smart City EV #41 (Route 12)",
        "location_name": "Rispana Bridge Corridor, Haridwar Road, Dehradun",
        "lat": 30.2980,
        "lng": 78.0310,
        "severity": "HIGH",
        "severity_score": 88,
        "confidence": 0.92,
        "timestamp": "2026-09-24 06:52:10",
        "status": "PENDING",
        "assigned_dept": "State Disaster Response Force (SDRF)",
        "multi_pass_count": 2,
        "ai_details": {
            "submergence_depth_cm": 19.5,
            "waterlogged_area_m2": 36.0,
            "pump_station_triggered": True,
            "evidence_sha256": generate_evidence_hash("INC-9047", "06:52:10")
        },
        "snapshot_url": "/api/snapshots/INC-9047.jpg"
    },
    {
        "id": "INC-9048",
        "title": "EARLY RISK: Transverse Micro-Fissure & Fatigue Degradation",
        "type": "pothole",
        "category": "ROAD_DAMAGE",
        "bus_id": "UK 07 PA 0284",
        "bus_name": "UTC Smart City EV #28 (Route 4)",
        "location_name": "Sahastradhara Road (km 3.4), Dehradun",
        "lat": 30.3410,
        "lng": 78.0780,
        "severity": "HIGH",
        "severity_score": 87,
        "confidence": 0.94,
        "timestamp": "2026-09-24 06:45:30",
        "status": "PENDING",
        "assigned_dept": "Public Works Dept (PWD)",
        "multi_pass_count": 2,
        "ai_details": {
            "surface_area_m2": 1.8,
            "depth_cm": 6.5,
            "is_early_detection": True,
            "degradation_stage": "Stage 1: Micro-Fissure Network",
            "growth_rate_mm_day": "+1.8 mm/day",
            "failure_risk_14d": "89% structural cavity collapse in 14 days without sealing",
            "preventive_savings_inr": 42000,
            "recommended_preventive_action": "Cold-Pour Polymer Mastic Sealing (₹1,800 vs ₹45,000 Emergency Patch)",
            "micro_surfacing_candidate": True,
            "evidence_sha256": generate_evidence_hash("INC-9048", "06:45:30")
        },
        "snapshot_url": "/api/snapshots/INC-9048.jpg"
    },
    {
        "id": "INC-9049",
        "title": "CRITICAL: Severe Pothole & Subbase Subsidence Hazard",
        "type": "pothole",
        "category": "ROAD_DAMAGE",
        "bus_id": "UK 07 PA 0142",
        "bus_name": "UTC Smart City EV #14 (Route 1)",
        "location_name": "Saharanpur Road, Near Niranjanpur Mandi, Dehradun",
        "lat": 30.3015,
        "lng": 78.0195,
        "severity": "CRITICAL",
        "severity_score": 95,
        "confidence": 0.97,
        "timestamp": "2026-09-24 06:40:15",
        "status": "PENDING",
        "assigned_dept": "Public Works Dept (PWD)",
        "multi_pass_count": 3,
        "ai_details": {
            "surface_area_m2": 3.6,
            "depth_cm": 18.2,
            "vehicle_exposure_per_hr": 410,
            "evidence_sha256": generate_evidence_hash("INC-9049", "06:40:15"),
            "inference_hardware": "NVIDIA Jetson AGX Orin Edge",
            "estimated_repair_cost_inr": 24500
        },
        "snapshot_url": "/api/snapshots/INC-9049.jpg"
    },
    {
        "id": "INC-9050",
        "title": "EMERGENCY: Hit-and-Run / Reckless Commercial Vehicle Tracking",
        "type": "hit_and_run",
        "category": "CRIME_TRAFFIC_SAFETY",
        "bus_id": "UK 07 PA 0284",
        "bus_name": "UTC Smart City EV #28 (Route 4)",
        "location_name": "General Mahadev Singh (GMS) Road, Dehradun",
        "lat": 30.3175,
        "lng": 78.0125,
        "severity": "CRITICAL",
        "severity_score": 98,
        "confidence": 0.95,
        "timestamp": "2026-09-24 06:35:48",
        "status": "PENDING",
        "assigned_dept": "Dehradun Traffic Police",
        "multi_pass_count": 1,
        "ai_details": {
            "vehicle_track_id": "V-22",
            "license_plate": "UK 07 CD 5819",
            "vehicle_make": "Mahindra Bolero Maxi Truck",
            "ocr_confidence": 0.938,
            "speed_exceeded_kmh": 72,
            "lane_violation": "Hazardous Overtaking & Hit Corridor",
            "evidence_sha256": generate_evidence_hash("INC-9050", "06:35:48")
        },
        "snapshot_url": "/api/snapshots/INC-9050.jpg"
    },
    {
        "id": "INC-9051",
        "title": "Dense Morning Fog & Blind Curve Collision Hazard",
        "type": "traffic",
        "category": "SAFETY_RISK",
        "bus_id": "UK 07 GA 1108",
        "bus_name": "UTC Dehradun City Bus #11 (Route 8)",
        "location_name": "Mussoorie Diversion Junction, Rajpur, Dehradun",
        "lat": 30.3620,
        "lng": 78.0810,
        "severity": "HIGH",
        "severity_score": 85,
        "confidence": 0.92,
        "timestamp": "2026-09-24 06:28:12",
        "status": "PENDING",
        "assigned_dept": "Traffic Police Dehradun",
        "multi_pass_count": 2,
        "ai_details": {
            "visibility_range_meters": 32,
            "braking_distance_risk_factor": "2.4x Standard",
            "fleet_slowdown_alert": True,
            "evidence_sha256": generate_evidence_hash("INC-9051", "06:28:12")
        },
        "snapshot_url": "/api/snapshots/INC-9051.jpg"
    },
    {
        "id": "INC-9052",
        "title": "Deep Unsurfaced Trench & Asphalt Collapse",
        "type": "pothole",
        "category": "ROAD_DAMAGE",
        "bus_id": "UK 07 PA 0419",
        "bus_name": "UTC Smart City EV #41 (Route 12)",
        "location_name": "Subhash Nagar - Graphic Era Road, Dehradun",
        "lat": 30.2725,
        "lng": 78.0010,
        "severity": "CRITICAL",
        "severity_score": 94,
        "confidence": 0.96,
        "timestamp": "2026-09-24 06:20:00",
        "status": "PENDING",
        "assigned_dept": "Public Works Dept (PWD)",
        "multi_pass_count": 2,
        "ai_details": {
            "surface_area_m2": 2.8,
            "depth_cm": 15.0,
            "immediate_patching_required": True,
            "evidence_sha256": generate_evidence_hash("INC-9052", "06:20:00")
        },
        "snapshot_url": "/api/snapshots/INC-9052.jpg"
    },
    {
        "id": "INC-9053",
        "title": "EARLY RISK: Subbase Moisture Ingress & Hairline Cavity Precursor",
        "type": "pothole",
        "category": "ROAD_DAMAGE",
        "bus_id": "UK 07 GA 1108",
        "bus_name": "UTC Dehradun City Bus #11 (Route 8)",
        "location_name": "Ballupur - Kishan Nagar Chowk, Dehradun",
        "lat": 30.3312,
        "lng": 78.0195,
        "severity": "HIGH",
        "severity_score": 88,
        "confidence": 0.94,
        "timestamp": "2026-09-24 06:12:40",
        "status": "PENDING",
        "assigned_dept": "Public Works Dept (PWD)",
        "multi_pass_count": 2,
        "ai_details": {
            "surface_area_m2": 1.4,
            "depth_cm": 5.8,
            "is_early_detection": True,
            "degradation_stage": "Stage 2: Subbase Void Ingress",
            "growth_rate_mm_day": "+2.3 mm/day",
            "failure_risk_14d": "92% catastrophic crater rupture under heavy transit axle load",
            "preventive_savings_inr": 58000,
            "recommended_preventive_action": "Subsurface Polymer Injection & Sealing (₹2,400 vs ₹60,000 Reconstruction)",
            "micro_surfacing_candidate": True,
            "evidence_sha256": generate_evidence_hash("INC-9053", "06:12:40")
        },
        "snapshot_url": "/api/snapshots/INC-9053.jpg"
    }
]

# ROAD DIGITAL TWIN DATASET (Dehradun Arterials)
ROAD_DIGITAL_TWINS = [
    {
        "segment_id": "SEG-RAJ-04",
        "name": "Rajpur Road (km 4.2 -> 5.8)",
        "health_score": 61,
        "status": "POOR",
        "color": "#f97316",
        "bus_passes_today": 23,
        "last_inspected": "4 min ago",
        "defects": {"potholes": 7, "cracks": 13, "waterlogging": 2},
        "traffic_density": "HIGH (340 veh/hr)",
        "defect_density_km2": "34 defects/km²",
        "timeline": [
            {"date": "Sep 20", "status": "Healthy", "rhi": 88, "note": "Optimal asphalt condition"},
            {"date": "Sep 21", "status": "Micro-Crack Detected", "rhi": 78, "note": "0.4mm fissure logged by UK 07 PA 0142"},
            {"date": "Sep 22", "status": "Crack Expansion", "rhi": 69, "note": "Width increased to 1.8mm"},
            {"date": "Sep 23", "status": "Pothole Formed", "rhi": 61, "note": "Asphalt crater 14.5cm depth (INC-9041)"}
        ],
        "predictive_model": {
            "crack_growth_mm_day": 1.8,
            "rainfall_saturation_pct": 65,
            "traffic_load_axle_tons": 18.4,
            "failure_probability_14d": "84% (High Risk)",
            "preventive_savings": "₹53,600 saved if micro-surfaced now vs reconstructed"
        }
    },
    {
        "segment_id": "SEG-ECR-02",
        "name": "EC Road (Survey Chowk Section)",
        "health_score": 72,
        "status": "DEGRADING",
        "color": "#eab308",
        "bus_passes_today": 18,
        "last_inspected": "12 min ago",
        "defects": {"potholes": 2, "cracks": 6, "waterlogging": 3},
        "traffic_density": "MODERATE (220 veh/hr)",
        "defect_density_km2": "18 defects/km²",
        "timeline": [
            {"date": "Sep 20", "status": "Healthy", "rhi": 91, "note": "Optimal drainage"},
            {"date": "Sep 21", "status": "Moisture Seepage", "rhi": 82, "note": "Subbase moisture saturation"},
            {"date": "Sep 22", "status": "Softening", "rhi": 76, "note": "Compaction loss detected"},
            {"date": "Sep 23", "status": "Drainage Overflow", "rhi": 72, "note": "Waterlogging 24cm depth (INC-9043)"}
        ],
        "predictive_model": {
            "crack_growth_mm_day": 1.2,
            "rainfall_saturation_pct": 82,
            "traffic_load_axle_tons": 14.2,
            "failure_probability_14d": "62% (Moderate Risk)",
            "preventive_savings": "₹38,000 saved if sump cleaned"
        }
    },
    {
        "segment_id": "SEG-BAL-08",
        "name": "Ballupur Chowk - Prem Nagar Line",
        "health_score": 54,
        "status": "CRITICAL",
        "color": "#ef4444",
        "bus_passes_today": 31,
        "last_inspected": "2 min ago",
        "defects": {"potholes": 11, "cracks": 19, "waterlogging": 1},
        "traffic_density": "HEAVY (480 veh/hr)",
        "defect_density_km2": "46 defects/km²",
        "timeline": [
            {"date": "Sep 20", "status": "Moderate", "rhi": 70, "note": "Aggregate friction loss"},
            {"date": "Sep 21", "status": "Friction Shear", "rhi": 62, "note": "Heavy axle load cracking"},
            {"date": "Sep 22", "status": "Alligator Cracks", "rhi": 58, "note": "Fatigue cracking"},
            {"date": "Sep 23", "status": "Severe Gridlock & Damage", "rhi": 54, "note": "Urgent PWD intervention required"}
        ],
        "predictive_model": {
            "crack_growth_mm_day": 2.4,
            "rainfall_saturation_pct": 55,
            "traffic_load_axle_tons": 26.5,
            "failure_probability_14d": "94% (Immediate Failure Risk)",
            "preventive_savings": "₹82,000 saved if overlayed"
        }
    }
]

# REAL VEHICLE COUNTING & CLASSIFICATION TELEMETRY
VEHICLE_COUNTING_STREAM = {
    "total_vehicles_detected": 94,
    "cars": 42,
    "motorcycles": 27,
    "buses": 4,
    "trucks": 8,
    "autos": 13,
    "average_speed_kmh": 32.4,
    "congestion_density_pct": 68,
    "active_tracked_objects": [
        {"track_id": "V-17", "class": "car", "speed_kmh": 78, "plate": "UK 07 AB 9042", "lane": "Fast Lane", "flag": "SPEED_VIOLATION"},
        {"track_id": "V-18", "class": "bus", "speed_kmh": 34, "plate": "UK 07 PA 0142", "lane": "Transit Corridor", "flag": "NORMAL"},
        {"track_id": "V-19", "class": "auto", "speed_kmh": 24, "plate": "UK 07 T 3411", "lane": "Slow Lane", "flag": "NORMAL"},
        {"track_id": "V-20", "class": "truck", "speed_kmh": 28, "plate": "UK 07 G 8820", "lane": "Freight Lane", "flag": "NORMAL"}
    ]
}
