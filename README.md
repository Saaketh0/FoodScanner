# FoodScanner-1

A simplified React Native/Expo food tracking application with a Python Flask backend for barcode processing.

## Project Overview

This project has been streamlined to focus on the frontend mobile app development with a simple backend server for handling barcode scans. All complex dependencies and unnecessary components have been removed to provide a clean, minimal foundation.

## Current Structure

```
FoodScanner-1/
├── frontend/              # React Native/Expo mobile app
│   ├── app/               # Main app screens and navigation
│   ├── assets/            # Images and fonts
│   ├── package.json       # Dependencies
│   └── README.md          # Frontend setup guide
├── backend/               # Python Flask server
│   ├── server.py          # Main server file
│   ├── requirements.txt   # Python dependencies
│   └── README.md          # Backend setup guide
├── .git/                  # Git repository
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## What Was Removed

- **Complex dependencies** - Camera libraries, advanced UI components, theming
- **Duplicate config files** - Consolidated into frontend directory
- **Development scripts** - Simplified to focus on core app functionality

## Getting Started

### Frontend (Mobile App)
1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development:**
   ```bash
   npm start
   ```

### Backend (Barcode Server)
1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the server:**
   ```bash
   python server.py
   ```

The backend will be available at `http://10.0.0.40:8000/scan` to receive barcode data from the mobile app.

## Development Focus

This simplified structure allows you to:
- Focus on building the core mobile app UI
- Handle barcode scanning and server communication
- Add features incrementally as needed
- Maintain a clean, understandable codebase
- Build upon a solid foundation without complexity

## Future Enhancements

When you're ready to add more features:
- Real food database integration
- Advanced camera functionality
- Backend database storage
- User authentication
- Advanced UI components

The project is now a clean slate for building your food tracking app from the basics up!