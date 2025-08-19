#!/bin/bash

echo "Starting RTSP.io Application..."
echo

echo "Starting Backend..."
cd backend
gnome-terminal --title="RTSP.io Backend" -- bash -c "python app.py; exec bash" &
cd ..

echo
echo "Starting Frontend..."
cd frontend
gnome-terminal --title="RTSP.io Frontend" -- bash -c "npm run dev; exec bash" &
cd ..

echo
echo "Application starting..."
echo "Backend will be available at: http://localhost:5000"
echo "Frontend will be available at: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all processes..."
wait
