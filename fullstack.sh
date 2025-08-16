#!/bin/bash

# need to do this first: chmod +x fullstack.sh
# then you can do ./fullstack.sh

# Script to start both Python backend and Expo frontend servers
echo "Starting development servers..."

# Function to handle cleanup on script exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to handle Ctrl+C
trap cleanup SIGINT SIGTERM

# Start Python backend server
echo "Starting Python backend server..."
cd ./src && python3 app.py &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 2

# Start Expo frontend
echo "Starting Expo frontend..."
cd ./app && npx expo start --clear &
FRONTEND_PID=$!

echo "Python backend server started (PID: $BACKEND_PID)"
echo "Expo frontend started (PID: $FRONTEND_PID)"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait