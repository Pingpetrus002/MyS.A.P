from app import app
from flask import Flask, jsonify, send_from_directory, render_template
import os
import datetime

x = datetime.datetime.now()

@app.route('/')
def index():
    return jsonify({
        'message': 'Hello World'
    })


# Route for seeing a data
@app.route('/data')
def get_time():
    # Returning an api for showing in  reactjs
    return jsonify({
        'Name':"geek",
        "Age":"22",
        "Date":x,
        "programming":"python"
    })