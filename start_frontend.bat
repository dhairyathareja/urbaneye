@echo off
title UrbanEye - React Frontend
echo ====================================================
echo        Starting UrbanEye React Frontend
echo ====================================================
cd /d "%~dp0frontend"

if not exist "node_modules\" (
    echo [*] Node modules not found. Running npm install...
    npm install
    if errorlevel 1 (
        echo [!] Error: Node.js or npm is not installed or not in PATH.
        pause
        exit /b 1
    )
)

echo [*] Launching Vite development server...
npm run dev
pause
