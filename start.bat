@echo off
echo Starting RTSP.io Application...
echo.

echo Starting Backend...
cd backend
start "RTSP.io Backend" cmd /k "python app.py"
cd ..

echo.
echo Starting Frontend...
cd frontend
start "RTSP.io Frontend" cmd /k "npm run dev"
cd ..

echo.
echo Application starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to exit this script...
pause > nul
