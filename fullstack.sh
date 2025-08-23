#!/bin/bash

# A script to start both the Python backend and Expo frontend servers.
# To use:
# 1. Make it executable: chmod +x fullstack.sh
# 2. Run it: ./fullstack.sh

# Need to run pip install -r requirements.txt
# and npm install in the frontend directory before running this script.

echo "🚀 Starting FoodScanner development servers..."

# Function to handle cleanup when the script exits
cleanup() {
    echo "🛑 Stopping servers..."
    # Kill all processes in the same process group as this script
    # This is more reliable than killing by individual PIDs
    kill 0
}

# Set up a trap to call the cleanup function on Ctrl+C (SIGINT) or termination (SIGTERM)
trap cleanup SIGINT SIGTERM

# Check if backend dependencies are installed
echo "🔍 Checking backend dependencies..."
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Backend requirements.txt not found!"
    exit 1
fi

# Check if frontend dependencies are installed
echo "🔍 Checking frontend dependencies..."
if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend node_modules not found. Run 'cd frontend && npm install' first."
fi

# Start Python backend server in a subshell
echo "🐍 Starting Python backend server..."
(cd backend && python3 server.py) &
BACKEND_PID=$!

# Wait a moment for the backend to initialize
sleep 2

# Start Expo frontend in a subshell
echo "📱 Starting Expo frontend..."
(cd frontend && npx expo start) &
FRONTEND_PID=$!

echo "----------------------------------------------------"
echo "✅ Servers are running!"
echo "   - Python Backend PID: $BACKEND_PID (http://10.0.0.40:8000)"
echo "   - Expo Frontend PID:  $FRONTEND_PID"
echo "----------------------------------------------------"
echo "Press Ctrl+C to stop both servers."

# The 'wait' command is crucial. It pauses the script here, keeping it alive
# until the trap is triggered (by Ctrl+C) or the background processes finish.
wait