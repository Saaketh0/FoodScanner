# FoodScan Frontend

A minimal React Native/Expo app for food tracking and nutrition management.

## Project Structure

```
frontend/
├── app/                    # Main app screens and navigation
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── explore.tsx    # Features overview
│   │   ├── camera.tsx     # Camera scanner (placeholder)
│   │   ├── tracker.tsx    # Calorie and macro tracker
│   │   └── _layout.tsx    # Tab navigation layout
│   ├── _layout.tsx        # Root app layout
│   ├── listcontext.tsx    # Shared state for food list
│   └── +not-found.tsx     # 404 page
├── assets/                 # Images and fonts
├── package.json            # Dependencies and scripts
├── app.json               # Expo configuration
└── tsconfig.json          # TypeScript configuration
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on specific platform:**
   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

## What's Included

- **Basic tab navigation** with 4 main screens
- **Home screen** with project information
- **Explore screen** showing app features
- **Camera screen** (placeholder for future barcode scanning)
- **Tracker screen** for logging food items and tracking nutrition
- **Shared state management** using React Context
- **Clean, modern UI** with consistent styling

## Next Steps

This is a minimal foundation. You can now:
- Implement actual camera functionality
- Add barcode scanning
- Integrate with nutrition APIs
- Enhance the UI with custom components
- Add data persistence
- Implement user authentication

## Dependencies

Only essential packages are included:
- Expo SDK 53
- React Native 0.79.5
- Expo Router for navigation
- Basic styling and layout components
