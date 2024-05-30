from app import app
from flask import render_template
from prometheus_client import generate_latest, CollectorRegistry, Counter, Gauge


REQUEST_COUNT = Counter('flask_app_request_count', 'Total HTTP requests')
REQUEST_LATENCY = Gauge('flask_app_request_latency_seconds', 'Latency of HTTP requests')


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/metrics')
def metrics():
    registry = CollectorRegistry()
    REQUEST_COUNT.collect(registry)
    REQUEST_LATENCY.collect(registry)
    return Response(generate_latest(registry), mimetype='text/plain')

