from app import app
from flask import render_template, jsonify
from flask_cors import CORS


cors = CORS(app, origins="*")


@app.route('/api/test', methods=['GET'])
def get_test():
    return jsonify(
        {
            "message": "Hello from Flask!",
            "test": "test",
            "test2": "test2",
            "test3": "test3",
        }
    )


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('index.html')
