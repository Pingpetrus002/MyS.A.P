from flask import Flask, jsonify, send_from_directory, render_template
import os

app = Flask(__name__, static_folder='../static', template_folder='templates')

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/', defaults={'path': ''})
def index():
    return render_template('index.html')