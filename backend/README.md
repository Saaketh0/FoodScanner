# FoodScanner Backend

A Flask server that handles barcode scanning requests from the mobile app.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the server:**
   ```bash
   python server.py
   ```

## Endpoints

### POST `/scan`
Receives barcode data from the mobile app.

**Request Body:**
```json
{
  "barcode": "1234567890123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Barcode 1234567890123 received successfully",
  "barcode": "1234567890123",
  "nutrition_info": {
    "product_name": "Sample Product",
    "calories": 150,
    "protein": 5,
    "carbs": 20,
    "fat": 8
  }
}
```

### GET `/barcodes`
Returns all scanned barcodes.

### GET `/health`
Health check endpoint.

## Configuration

The server runs on `http://10.0.0.40:8000` by default.

To change the IP address or port, modify the `app.run()` call in `server.py`.

## Features

- ✅ Receives barcode scans from mobile app
- ✅ Stores scanned barcodes in memory
- ✅ Returns nutrition information (placeholder)
- ✅ CORS enabled for mobile app access
- ✅ Error handling and logging
- ✅ Health check endpoint

## Next Steps

- Integrate with a real food database API
- Add persistent storage (database)
- Implement user authentication
- Add more detailed nutrition information
