#!/bin/bash

# A script to start both the Python backend and Expo frontend servers.
# To use:
# 1. Make it executable: chmod +x fullstack.sh
# 2. Run it: ./fullstack.sh

echo "🚀 Starting development servers..."

# Function to handle cleanup when the script exits
cleanup() {
    echo "🛑 Stopping servers..."
    # Kill all processes in the same process group as this script
    # This is more reliable than killing by individual PIDs
    kill 0
}

# Set up a trap to call the cleanup function on Ctrl+C (SIGINT) or termination (SIGTERM)
trap cleanup SIGINT SIGTERM

# Start Python backend server in a subshell
echo "🐍 Starting Python backend server..."
(cd src && python3 server.py) &
BACKEND_PID=$!

# Wait a moment for the backend to initialize
sleep 2

# Start Expo frontend in a subshell
echo "📱 Starting Expo frontend..."
(cd frontend && npx expo start --clear) &
FRONTEND_PID=$!

echo "----------------------------------------------------"
echo "✅ Servers are running!"
echo "   - Python Backend PID: $BACKEND_PID"
echo "   - Expo Frontend PID:  $FRONTEND_PID"
echo "----------------------------------------------------"
echo "Press Ctrl+C to stop both servers."

# The 'wait' command is crucial. It pauses the script here, keeping it alive
# until the trap is triggered (by Ctrl+C) or the background processes finish.
wait