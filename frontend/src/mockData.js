// Standalone In-Browser Mock Data & Photo-Grade SVG Image Generator for ZERO-BACKEND Execution

export const MOCK_BUSES = [
  { id: 'UK 07 PA 0142', name: 'UTC Smart City EV #14 (Route 1: ISBT -> Rajpur Road)', status: 'ONLINE', speed_kmh: 32, driver: 'Rajeshwar Rawat', current_lat: 30.3450, current_lng: 78.0650, navic_satellites: 14 },
  { id: 'UK 07 PA 0284', name: 'UTC Smart City EV #28 (Route 4: Railway Stn -> Sahastradhara)', status: 'ONLINE', speed_kmh: 28, driver: 'Amitabh Negi', current_lat: 30.3200, current_lng: 78.0500, navic_satellites: 12 },
  { id: 'UK 07 GA 1108', name: 'UTC Dehradun City Bus #11 (Route 8: Prem Nagar -> Paltan Bazaar)', status: 'ONLINE', speed_kmh: 38, driver: 'Suresh Semwal', current_lat: 30.3350, current_lng: 77.9980, navic_satellites: 15 },
  { id: 'UK 07 PA 0419', name: 'UTC Smart City EV #41 (Route 12: Clement Town -> Haridwar Bypass)', status: 'ONLINE', speed_kmh: 30, driver: 'Vikas Gusain', current_lat: 30.2700, current_lng: 78.0000, navic_satellites: 13 },
]

export const MOCK_INCIDENTS = [
  {
    id: 'INC-9041',
    title: 'CRITICAL: Severe Pothole & Asphalt Fracture',
    type: 'pothole',
    category: 'ROAD_DAMAGE',
    bus_id: 'UK 07 PA 0142',
    bus_name: 'UTC Smart City EV #14 (Route 1)',
    location_name: 'Rajpur Road, Near Astley Hall, Dehradun',
    lat: 30.3282,
    lng: 78.0456,
    severity: 'CRITICAL',
    severity_score: 96,
    confidence: 0.98,
    timestamp: '2026-09-24 07:17:38',
    status: 'PENDING',
    assigned_dept: 'Public Works Dept (PWD)',
    ai_details: {
      surface_area_m2: 2.4,
      depth_cm: 14.5,
      vehicle_exposure_per_hr: 340,
      inference_hardware: 'NVIDIA Jetson AGX Orin Edge'
    },
    snapshot_url: '/api/snapshots/INC-9041.jpg'
  },
  {
    id: 'INC-9042',
    title: 'EMERGENCY: Hit-and-Run / Rash Driving Vehicle Tracking',
    type: 'hit_and_run',
    category: 'CRIME_TRAFFIC_SAFETY',
    bus_id: 'UK 07 PA 0284',
    bus_name: 'UTC Smart City EV #28 (Route 4)',
    location_name: 'Clock Tower (Ghanta Ghar) Chowk, Dehradun',
    lat: 30.3255,
    lng: 78.0437,
    severity: 'CRITICAL',
    severity_score: 99,
    confidence: 0.96,
    timestamp: '2026-09-24 07:14:10',
    status: 'PENDING',
    assigned_dept: 'Dehradun Traffic Police',
    ai_details: {
      vehicle_track_id: 'V-17',
      license_plate: 'UK 07 AB 9042',
      vehicle_make: 'Maruti Suzuki Dzire',
      speed_exceeded_kmh: 78,
      lane_violation: 'Rash Evasive Multi-Lane Drift'
    },
    snapshot_url: '/api/snapshots/INC-9042.jpg'
  },
  {
    id: 'INC-9043',
    title: 'Monsoon Waterlogging & Sump Drainage Overflow',
    type: 'waterlogging',
    category: 'URBAN_HAZARD',
    bus_id: 'UK 07 GA 1108',
    bus_name: 'UTC Dehradun City Bus #11 (Route 8)',
    location_name: 'EC Road Near Survey Chowk, Dehradun',
    lat: 30.3228,
    lng: 78.0495,
    severity: 'HIGH',
    severity_score: 89,
    confidence: 0.94,
    timestamp: '2026-09-24 07:10:05',
    status: 'PENDING',
    assigned_dept: 'Dehradun Jal Sansthan / Municipal Corp',
    ai_details: {
      submergence_depth_cm: 24.0,
      lane_obstruction_pct: 65,
      waterlogged_area_m2: 48.0
    },
    snapshot_url: '/api/snapshots/INC-9043.jpg'
  },
  {
    id: 'INC-9044',
    title: 'School Children & Pedestrian High-Density Risk Zone',
    type: 'pedestrian',
    category: 'SAFETY_RISK',
    bus_id: 'UK 07 PA 0419',
    bus_name: 'UTC Smart City EV #41 (Route 12)',
    location_name: 'ISBT Dehradun / Haridwar Bypass Crossing',
    lat: 30.2865,
    lng: 78.0075,
    severity: 'HIGH',
    severity_score: 86,
    confidence: 0.91,
    timestamp: '2026-09-24 07:05:44',
    status: 'PENDING',
    assigned_dept: 'Traffic Police Dehradun',
    ai_details: {
      pedestrian_count: 14,
      zebra_crossing_present: false
    },
    snapshot_url: '/api/snapshots/INC-9044.jpg'
  },
  {
    id: 'INC-9045',
    title: 'Deep Structural Asphalt Crater Cluster',
    type: 'pothole',
    category: 'ROAD_DAMAGE',
    bus_id: 'UK 07 GA 1108',
    bus_name: 'UTC Dehradun City Bus #11 (Route 8)',
    location_name: 'Chakrata Road Near Ballupur Chowk, Dehradun',
    lat: 30.3390,
    lng: 78.0065,
    severity: 'CRITICAL',
    severity_score: 93,
    confidence: 0.95,
    timestamp: '2026-09-24 07:01:18',
    status: 'PENDING',
    assigned_dept: 'Public Works Dept (PWD)',
    ai_details: {
      surface_area_m2: 3.1,
      depth_cm: 16.2,
      heavy_axle_stress: true
    },
    snapshot_url: '/api/snapshots/INC-9045.jpg'
  },
  {
    id: 'INC-9046',
    title: 'Severe Vehicle Bottleneck & Speed Drop Gridlock',
    type: 'traffic',
    category: 'TRAFFIC_CONGESTION',
    bus_id: 'UK 07 PA 0142',
    bus_name: 'UTC Smart City EV #14 (Route 1)',
    location_name: 'Paltan Bazaar Radial Junction, Dehradun',
    lat: 30.3210,
    lng: 78.0410,
    severity: 'HIGH',
    severity_score: 84,
    confidence: 0.93,
    timestamp: '2026-09-24 06:58:22',
    status: 'PENDING',
    assigned_dept: 'Traffic Police Dehradun',
    ai_details: {
      flow_velocity_kmh: 7.8,
      queue_length_meters: 420,
      congestion_density_pct: 88
    },
    snapshot_url: '/api/snapshots/INC-9046.jpg'
  },
  {
    id: 'INC-9047',
    title: 'Subway & Culvert Water Ingress Submergence',
    type: 'waterlogging',
    category: 'URBAN_HAZARD',
    bus_id: 'UK 07 PA 0419',
    bus_name: 'UTC Smart City EV #41 (Route 12)',
    location_name: 'Rispana Bridge Corridor, Haridwar Road, Dehradun',
    lat: 30.2980,
    lng: 78.0310,
    severity: 'HIGH',
    severity_score: 88,
    confidence: 0.92,
    timestamp: '2026-09-24 06:52:10',
    status: 'PENDING',
    assigned_dept: 'State Disaster Response Force (SDRF)',
    ai_details: {
      submergence_depth_cm: 19.5,
      waterlogged_area_m2: 36.0
    },
    snapshot_url: '/api/snapshots/INC-9047.jpg'
  },
  {
    id: 'INC-9048',
    title: 'Transverse Fatigue Fissure & Edge Cracking',
    type: 'pothole',
    category: 'ROAD_DAMAGE',
    bus_id: 'UK 07 PA 0284',
    bus_name: 'UTC Smart City EV #28 (Route 4)',
    location_name: 'Sahastradhara Road (km 3.4), Dehradun',
    lat: 30.3410,
    lng: 78.0780,
    severity: 'HIGH',
    severity_score: 87,
    confidence: 0.94,
    timestamp: '2026-09-24 06:45:30',
    status: 'PENDING',
    assigned_dept: 'Public Works Dept (PWD)',
    ai_details: {
      surface_area_m2: 1.8,
      depth_cm: 11.0
    },
    snapshot_url: '/api/snapshots/INC-9048.jpg'
  },
  {
    id: 'INC-9049',
    title: 'CRITICAL: Severe Pothole & Subbase Subsidence Hazard',
    type: 'pothole',
    category: 'ROAD_DAMAGE',
    bus_id: 'UK 07 PA 0142',
    bus_name: 'UTC Smart City EV #14 (Route 1)',
    location_name: 'Saharanpur Road, Near Niranjanpur Mandi, Dehradun',
    lat: 30.3015,
    lng: 78.0195,
    severity: 'CRITICAL',
    severity_score: 95,
    confidence: 0.97,
    timestamp: '2026-09-24 06:40:15',
    status: 'PENDING',
    assigned_dept: 'Public Works Dept (PWD)',
    ai_details: {
      surface_area_m2: 3.6,
      depth_cm: 18.2,
      vehicle_exposure_per_hr: 410
    },
    snapshot_url: '/api/snapshots/INC-9049.jpg'
  },
  {
    id: 'INC-9050',
    title: 'EMERGENCY: Hit-and-Run / Reckless Commercial Vehicle Tracking',
    type: 'hit_and_run',
    category: 'CRIME_TRAFFIC_SAFETY',
    bus_id: 'UK 07 PA 0284',
    bus_name: 'UTC Smart City EV #28 (Route 4)',
    location_name: 'General Mahadev Singh (GMS) Road, Dehradun',
    lat: 30.3175,
    lng: 78.0125,
    severity: 'CRITICAL',
    severity_score: 98,
    confidence: 0.95,
    timestamp: '2026-09-24 06:35:48',
    status: 'PENDING',
    assigned_dept: 'Dehradun Traffic Police',
    ai_details: {
      vehicle_track_id: 'V-22',
      license_plate: 'UK 07 CD 5819',
      vehicle_make: 'Mahindra Bolero Maxi Truck',
      speed_exceeded_kmh: 72
    },
    snapshot_url: '/api/snapshots/INC-9050.jpg'
  },
  {
    id: 'INC-9051',
    title: 'Dense Morning Fog & Blind Curve Collision Hazard',
    type: 'traffic',
    category: 'SAFETY_RISK',
    bus_id: 'UK 07 GA 1108',
    bus_name: 'UTC Dehradun City Bus #11 (Route 8)',
    location_name: 'Mussoorie Diversion Junction, Rajpur, Dehradun',
    lat: 30.3620,
    lng: 78.0810,
    severity: 'HIGH',
    severity_score: 85,
    confidence: 0.92,
    timestamp: '2026-09-24 06:28:12',
    status: 'PENDING',
    assigned_dept: 'Traffic Police Dehradun',
    ai_details: {
      visibility_range_meters: 32
    },
    snapshot_url: '/api/snapshots/INC-9051.jpg'
  },
  {
    id: 'INC-9052',
    title: 'Deep Unsurfaced Trench & Asphalt Collapse',
    type: 'pothole',
    category: 'ROAD_DAMAGE',
    bus_id: 'UK 07 PA 0419',
    bus_name: 'UTC Smart City EV #41 (Route 12)',
    location_name: 'Subhash Nagar - Graphic Era Road, Dehradun',
    lat: 30.2725,
    lng: 78.0010,
    severity: 'CRITICAL',
    severity_score: 94,
    confidence: 0.96,
    timestamp: '2026-09-24 06:20:00',
    status: 'PENDING',
    assigned_dept: 'Public Works Dept (PWD)',
    ai_details: {
      surface_area_m2: 2.8,
      depth_cm: 15.0
    },
    snapshot_url: '/api/snapshots/INC-9052.jpg'
  }
]

export const MOCK_ANALYTICS = {
  summary: {
    total_incidents: 12,
    pending_action: 12,
    dispatched_crew: 0,
    resolved_count: 0,
    active_buses: 4,
    km_monitored_today: 1428,
    road_health_index: 46,
    avg_detection_latency_ms: 14.2
  },
  by_category: {
    "Potholes & Damage": 6,
    "Waterlogging": 2,
    "Pedestrian Hazards": 1,
    "Traffic Bottlenecks": 2,
    "Signage & Infra": 1
  }
}

// Generate Photo-Grade SVG Snapshot URL for In-Browser Standalone Execution
export function generateSvgSnapshot(type = 'pothole', busId = 'UK 07 PA 0142', confidence = 0.98, camAngle = 'FRONT_AI', weather = 'clear') {
  const confPct = Math.round(confidence * 100)
  let hazardSvg = ''
  let labelText = `POTHOLE & CRITICAL ASPHALT FRACTURE (${confPct}%)`
  let boxColor = '#ef4444'

  if (type === 'hit_and_run' || camAngle === 'REAR_ROADSIDE') {
    labelText = `HIT-AND-RUN LPR: UK 07 AB 9042 (${confPct}%)`
    boxColor = '#dc2626'
    hazardSvg = `
      <rect x="220" y="140" width="200" height="110" fill="#1e293b" stroke="#dc2626" stroke-width="3" rx="10"/>
      <rect x="240" y="150" width="160" height="40" fill="#0f172a" rx="5"/>
      <circle cx="240" cy="220" r="10" fill="#ef4444"/>
      <circle cx="400" cy="220" r="10" fill="#ef4444"/>
      <rect x="280" y="210" width="80" height="28" fill="#fef08a" stroke="#000000" stroke-width="2" rx="3"/>
      <text x="286" y="228" font-family="monospace" font-size="11" font-weight="bold" fill="#000000">UK 07 AB 9042</text>
    `
  } else if (type === 'waterlogging' || weather === 'rain') {
    labelText = `FLASH MONSOON WATERLOGGING (${confPct}%)`
    boxColor = '#38bdf8'
    hazardSvg = `
      <ellipse cx="320" cy="250" rx="180" ry="60" fill="#1e3a8a" stroke="#38bdf8" stroke-width="3" opacity="0.8"/>
      <path d="M 180,240 Q 240,220 300,240 T 420,240" fill="none" stroke="#93c5fd" stroke-width="2"/>
      <rect x="460" y="180" width="20" height="100" fill="#ffffff" stroke="#000000" stroke-width="2"/>
      <text x="485" y="230" font-family="monospace" font-size="12" font-weight="bold" fill="#38bdf8">24cm</text>
    `
  } else {
    hazardSvg = `
      <polygon points="220,210 250,195 310,200 360,215 380,245 350,275 290,285 230,270 210,240" fill="#0f0e0e" stroke="#451a03" stroke-width="3"/>
      <polygon points="225,214 253,200 310,204 357,218 376,246 348,272 291,281 233,267 214,242" fill="#050505"/>
      <line x1="220" y1="210" x2="180" y2="190" stroke="#1c1917" stroke-width="2"/>
      <line x1="360" y1="215" x2="410" y2="195" stroke="#1c1917" stroke-width="2"/>
    `
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <rect width="640" height="360" fill="#334155"/>
    <rect x="0" y="0" width="640" height="120" fill="#1e293b"/>
    <polygon points="260,120 380,120 640,360 0,360" fill="#1e293b"/>
    <line x1="260" y1="120" x2="0" y2="360" stroke="#cbd5e1" stroke-width="4"/>
    <line x1="380" y1="120" x2="640" y2="360" stroke="#cbd5e1" stroke-width="4"/>
    ${hazardSvg}
    <rect x="190" y="160" width="260" height="130" fill="none" stroke="${boxColor}" stroke-width="3"/>
    <rect x="190" y="136" width="${labelText.length * 7 + 16}" height="24" fill="${boxColor}"/>
    <text x="198" y="153" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">${labelText}</text>
    <rect x="0" y="0" width="640" height="30" fill="#0f172a"/>
    <text x="10" y="20" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">URBANEYE EDGE AI | DEHRADUN GRID | ${busId}</text>
    <rect x="0" y="330" width="640" height="30" fill="#0f172a"/>
    <text x="10" y="350" font-family="monospace" font-size="11" fill="#94a3b8">CAM: ${camAngle} | INFERENCE: 14.2ms | DEHRADUN TELEMETRY</text>
  </svg>
  `
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
