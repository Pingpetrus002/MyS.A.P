from app import app
from flask import render_template


REQUEST_COUNT = Counter('flask_app_request_count', 'Total HTTP requests')
REQUEST_LATENCY = Gauge('flask_app_request_latency_seconds', 'Latency of HTTP requests')


@app.route('/')
def home():
    return render_template('index.html')

