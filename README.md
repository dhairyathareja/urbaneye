# UrbanEye: AI-Powered Smart City Road Safety & Incident Response Platform

UrbanEye is an edge AI platform designed for municipal corporations and public transport networks (Uttarakhand Transport Corporation - UTC / Dehradun Smart City). It turns public transit fleets into mobile spatial sensors that detect road hazards (potholes, structural fissures, flash waterlogging, pedestrian zones) and traffic safety crimes (hit-and-run speed violations with Indian license plate recognition).

---

## Key Capabilities

1. **Custom-Trained YOLOv8 AI Model**:
   - Fine-tuned on real road defect datasets with custom checkpoint at `backend/weights/pothole_yolov8.pt`.
   - Real-time detection with high precision, calculating true bounding boxes, confidence, estimated surface area ($m^2$), and depth ($cm$).

2. **Hit-and-Run / Indian License Plate Recognition (LPR)**:
   - Sourced and validated with authentic Indian vehicle photographs (`UK 07 AB 9042` and `UK 07 CD 5819`).
   - Automated vehicle classification, plate localization, and speed telemetry.

3. **Multi-Sensor Live Stream**:
   - **4 Onboard Camera Angles**:
     - `FRONT_AI`: Roadway surface and asphalt defect inference.
     - `SIDE_PAVEMENT`: Roadside sidewalk and pedestrian density scanning.
     - `REAR_ROADSIDE`: Rear highway camera for speed violators and LPR.
     - `CABIN_MONITOR`: Driver cockpit vigilance and attentiveness telemetry.
   - **4 Environmental Adaptive Profiles**:
     - `Daylight`, `Rain / Wet`, `Night Low-Light`, and `Fog / Mist` with instant image profile switching.

4. **Real Public Transit Fleet Telemetry**:
   - Uttarakhand Transport Corporation (UTC) Dehradun routes:
     - `UK 07 PA 0142` (Route 1: ISBT $\rightarrow$ Clock Tower $\rightarrow$ Rajpur Road)
     - `UK 07 PA 0284` (Route 4: Railway Station $\rightarrow$ EC Road $\rightarrow$ Sahastradhara)
     - `UK 07 GA 1108` (Route 8: Prem Nagar $\rightarrow$ Ballupur Chowk $\rightarrow$ Paltan Bazaar)
     - `UK 07 PA 0419` (Route 12: Clement Town $\rightarrow$ Haridwar Bypass $\rightarrow$ Rispana)

5. **ACID-Compliant SQLite Database**:
   - Pre-seeded with 12 diverse real Dehradun incidents (`INC-9041` to `INC-9052`).
   - Dynamic calculation of Road Health Index (RHI) and dispatch workflows via SQLAlchemy ORM.

---

## Project Structure

```
urbaneye/
├── backend/
│   ├── assets/              # Authentic real photographs (Indian LPR, weather, cameras)
│   ├── weights/             # Trained YOLOv8 models (pothole_yolov8.pt, yolov8n.pt)
│   ├── database.py          # SQLAlchemy SQLite connection and initial seeding
│   ├── models.py            # Incident, BusFleet, and AIDetectionLog database models
│   ├── cv_engine.py         # YOLOv8 inference, OpenCV HUD drawing, and multi-sensor routing
│   ├── main.py              # FastAPI application endpoints
│   ├── simulated_data.py    # UTC fleet telemetry and incident definitions
│   ├── test_database_and_yolo.py # Full automated test suite (10 tests)
│   ├── train_yolo.py        # Model fine-tuning script
│   ├── requirements.txt     # Python backend dependencies
│   └── urbaneye.db          # SQLite database
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components (Map, Live Stream, Queue, Analytics)
│   │   ├── mockData.js      # Standalone fallback telemetry
│   │   ├── App.jsx          # Main application root
│   │   └── main.jsx         # React DOM mount point
│   ├── package.json         # Node frontend dependencies
│   └── vite.config.js       # Vite bundler configuration
│
├── start_backend.bat        # One-click Windows starter for Backend
├── start_frontend.bat       # One-click Windows starter for Frontend
└── README.md                # Project documentation
```

---

## Quick Start (How to Run)

### Prerequisites
- **Python 3.10+** installed (add to PATH)
- **Node.js 18+** & **npm** installed

---

### Option A: 1-Click Launch (Windows)
1. Double-click **`start_backend.bat`** (automatically sets up virtual environment, installs dependencies, and starts API server on port 8000).
2. Double-click **`start_frontend.bat`** (installs node modules if needed and launches Vite on port 5173).

---

### Option B: Manual Setup

#### 1. Start the Backend API
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/`

#### 2. Start the Frontend UI
In a separate terminal:
```powershell
cd frontend
npm install
npm run dev
```
- Open your browser at: `http://localhost:5173` (or `http://localhost:3000`)

---

## Default Login Credentials
- **Username**: `admin.urbaneye`
- **Password**: Any password (or click "Login as Command Controller")

---

## Verification & Testing
To run the automated backend test suite:
```powershell
cd backend
venv\Scripts\activate
python test_database_and_yolo.py
```
Expected result: **`Ran 10 tests in ~3.6s - OK`**.
