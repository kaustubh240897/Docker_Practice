from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS with more specific configuration
CORS(app, resources={
    r"/process": {
        "origins": "http://localhost:3000",
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/process', methods=['POST'])
def process_name():
    try:
        print("Received request headers:", request.headers)  # Debug log
        print("Received request data:", request.get_data())  # Debug raw data
        
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
            
        data = request.get_json()
        print("Parsed JSON data:", data)  # Debug log
        
        if not data or 'name' not in data:
            return jsonify({'error': 'Name is required'}), 400
            
        name = data['name']
        
        if not name or not isinstance(name, str):
            return jsonify({'error': 'Name must be a non-empty string'}), 400
            
        processed_name = f"Hello, {name}!"
        
        return jsonify({
            'message': processed_name,
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")  # Debug log
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)