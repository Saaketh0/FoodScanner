from flask import Flask, request, jsonify
from flask_cors import CORS
from food_lookup import lookup
from analysemacro import analyse_macro

app = Flask(__name__)
CORS(app)

@app.route('/food_lookup', methods=['POST'])
def food_lookup():
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        
        if not data or 'food_text' not in data:
            return jsonify({"error": "No food_text provided"}), 400
        
        food_text = data['food_text']
        print(f"Looking up: {food_text}")
        
        product_name, nutriments_info, similarity_score, code = lookup(food_text)
        print("Code: ", code)

        # Check if we got valid data
        if product_name is None:
            return jsonify({"error": "No product found"}), 404

        # Handle macro analysis safely
        macro_analysis = None
        if nutriments_info is not None:
            try:
                macro_analysis = analyse_macro(code)
                if macro_analysis is not None:
                    macro_analysis = list(macro_analysis)
            except Exception as e:
                print(f"Macro analysis error: {e}")
                macro_analysis = []

        similarity_score = float(similarity_score)*100
        product_name = str(product_name)
        
        print(f"Macro analysis: {macro_analysis}")
        
        # Simple response for now
        return jsonify({
            "status": "success",
            "message": f"Received: {product_name}",
            "food_text": product_name,
            "result": {
                "product_name": product_name,
                "similarity_score": similarity_score
            }
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Basic server is running",
        "endpoints": ["/test", "/food_lookup", "/health"]
    })

if __name__ == '__main__':
    print("🚀 Starting Basic Server...")
    print("📍 Available at: http://localhost:8000")
    print("🔍 Test endpoint: http://localhost:8000/test")
    print("💚 Health check: http://localhost:8000/health")
    print("=" * 50)
    
    app.run(host='10.0.0.40', port=8000, debug=True)
