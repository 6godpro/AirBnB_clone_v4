#!/usr/bin/python3
"""Cities view model
"""
from api.v1.views import app_views
from flask import (
    abort,
    jsonify,
    make_response,
    request
)
from models import storage
from models.state import State
from models.city import City


@app_views.route("/states/<state_id>/cities",
                 methods=['GET', 'POST'], strict_slashes=False)
def get_or_create_cities(state_id=None):
    """Retrieve all cities of <state_id>
    """
    state = storage.get(State, state_id)
    if state is None:
        abort(404)

    if request.method == 'GET':
        return jsonify([city.to_dict() for city in state.cities])

    if request.method == 'POST':
        req = request.get_json(silent=True)
        if req is None:
            abort(400, description="Not a JSON")
        if 'name' not in req.keys():
            abort(400, description="Missing name")

        req["state_id"] = state_id
        city = City(**req)
        city.save()
        return make_response(city.to_dict(), 201)


@app_views.route("/cities/<city_id>",
                 methods=['GET', 'DELETE', 'PUT'], strict_slashes=False)
def delete_get_or_update_city(city_id=None):
    """DELETE/GET/UPDATE a city
    """
    city = storage.get(City, city_id)

    if city is None:
        abort(404)

    if request.method == 'GET':
        return jsonify(city.to_dict())

    if request.method == 'DELETE':
        city.delete()
        storage.save()
        return jsonify({})

    if request.method == 'PUT':
        req = request.get_json(silent=True)
        if req is None:
            abort(400, description="Not a JSON")
        city.update(req)
        return jsonify(city.to_dict())
