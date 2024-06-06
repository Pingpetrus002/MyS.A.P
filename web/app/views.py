from app import app
from flask import render_template, jsonify



@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello from Flask!"})
@app.route('/')
def home():
    return render_template('index.html')

