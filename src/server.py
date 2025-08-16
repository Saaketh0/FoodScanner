from flask import Flask, request, jsonify
from getfood import getfood
# Create a Flask web server application
app = Flask(__name__)

# Define an endpoint that accepts POST requests at the URL /scan
@app.route('/scan', methods=['POST'])
def handle_scan():
    # Get the JSON data sent from the mobile app
    data = request.get_json()

    # Check if the 'barcode' key exists in the received data
    if data and 'barcode' in data:
        barcode_number = data['barcode']
        
        # --- THIS IS WHERE YOU USE THE DATA ---
        print(f"✅ Received barcode from app: {barcode_number}")
        # You could now save it to a database, process it, etc.
        # ------------------------------------
        
        # Send a success response back to the app
        return jsonify({"status": "success", "message": f"Barcode {barcode_number} received"}), 200
    else:
        # Send an error response if the data is missing
        return jsonify({"status": "error", "message": "No barcode data provided"}), 400
    

# Run the server when the script is executed
if __name__ == '__main__':
    # '0.0.0.0' makes the server accessible from other devices on your network
    app.run(host='0.0.0.0', port=8000)

    