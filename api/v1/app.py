#!/usr/bin/python3
"""Flask app api version 1
create app and register app blueprint from app views
create app error handlers and tear downs
"""
import os
import models
from api.v1.views import app_views
from flask import Flask, jsonify, make_response
from flask_cors import CORS

app = Flask(__name__)

# Cross-Origin Resource Sharing
cors = CORS(app, resources={r"/api/v1/*": {"origins": "0.0.0.0"}})

app.register_blueprint(app_views)


@app.errorhandler(404)
def page_not_found(error):
    """404 Error Handler"""
    return make_response(jsonify({"error": "Not found"}), 404)


@app.errorhandler(405)
def not_allowed(error):
    """405 Error Handler"""
    return make_response(jsonify({"error": "Request not allowed"}), 405)


@app.errorhandler(400)
def bad_request(error):
    """400 Error Handler"""
    error = {"error": error.description}
    return make_response(jsonify(error), 400)


@app.teardown_appcontext
def teardown(exception=None):
    """app teardown context"""
    models.storage.close()


if __name__ == "__main__":
    host = os.getenv("HBNB_API_HOST", '0.0.0.0')
    port = os.getenv("HBNB_API_PORT", 5000)
    app.run(host=host, port=port, threaded=True)
