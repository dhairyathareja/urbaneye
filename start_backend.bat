@echo off
title UrbanEye - Backend API Server
echo ====================================================
echo        Starting UrbanEye Backend API Server
echo ====================================================
cd /d "%~dp0backend"

if not exist "venv\Scripts\activate.bat" (
    echo [*] Python virtual environment not found. Creating venv...
    python -m venv venv
    if errorlevel 1 (
        echo [!] Error: Python 3 is not installed or not in PATH.
        pause
        exit /b 1
    )
    echo [*] Installing required Python dependencies...
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

echo [*] Launching FastAPI server on http://127.0.0.1:8000 ...
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
