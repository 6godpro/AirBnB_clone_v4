#!/usr/bin/python3
""" Places_Amenities view.
"""
import os
from api.v1.views import app_views
from flask import (
    abort,
    jsonify,
    request
)
from models import storage, storage_t
from models.amenity import Amenity
from models.place import Place


@app_views.route("/places/<place_id>/amenities",
                 methods=['GET'], strict_slashes=False)
def places_amenities(place_id=None):
    """Retrieves, Deletes, and Creates an amenity."""
    place = storage.get(Place, place_id)
    if place is None:
        abort(404)

    if request.method == 'GET':
        return jsonify([v.to_dict() for v in place.amenities])


@app_views.route("/places/<place_id>/amenities/<amenity_id>",
                 methods=['DELETE', 'POST'], strict_slashes=False)
def delete_create_amenity(place_id=None, amenity_id=None):
    """Deletes or Creates an amenity for a place.
    """
    place = storage.get(Place, place_id)
    if place is None:
        abort(404)

    amenity = storage.get(Amenity, amenity_id)
    if amenity is None:
        abort(404)

    if request.method == 'DELETE':
        if amenity not in place.amenities:
            abort(404)

        if storage_t != "db":
            place.amenity_ids.remove(amenity.id)

        amenity.delete()
        storage.save()
        return jsonify({})

    if request.method == 'POST':
        if amenity in place.amenities:
            return jsonify(amenity.to_dict()), 200

        if storage_t != "db":
            place.amenity_ids.append(amenity.id)
        else:
            place.amenities.append(amenity)
        storage.save()
        return jsonify(amenity.to_dict()), 201
