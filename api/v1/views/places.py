#!/usr/bin/python3
"""Places search view
"""
from api.v1.views import app_views
from flask import (
    abort,
    jsonify,
    request
)
from models import storage
from models.place import Place
from models.state import State
from models.city import City
from models.user import User


@app_views.route("/cities/<city_id>/places",
                 methods=['GET', 'POST'], strict_slashes=False)
def get_or_create_places(city_id=None):
    """Retrieve all place objects of <city_id> or create a
    place using <city_id>
    methods-allowed: GET -> get all places in in <city_id>
                     POST -> create a place object using <city_id>
    """
    city = storage.get(City, city_id)
    if city is None:
        abort(404)
    if request.method == 'GET':
        return jsonify([place.to_dict() for place in city.places])

    if request.method == 'POST':
        req = request.get_json(silent=True)
        if req is None:
            abort(400, description="Not a JSON")
        user_id = req.get('user_id', None)
        if user_id is None:
            abort(400, description="Missing user_id")
        if 'name' not in req.keys():
            abort(400, description="Missing name")
        user = storage.get(User, user_id)
        if user is None:
            abort(404)
        req["city_id"] = city_id
        place = Place(**req)
        place.save()
        return jsonify(place.to_dict()), 201


@app_views.route("/places/<place_id>",
                 methods=['GET', 'DELETE', 'PUT'], strict_slashes=False)
def delete_get_or_update_place(place_id=None):
    """DELETE/GET/UPDATE a place"""
    place = storage.get(Place, place_id)
    if place is None:
        abort(404)
    if request.method == 'GET':
        return jsonify(place.to_dict())

    if request.method == 'DELETE':
        place.delete()
        storage.save()
        return jsonify({})

    if request.method == 'PUT':
        req = request.get_json(silent=True)
        if req is None:
            abort(400, description="Not a JSON")
        place.update(req, ignore=["id", "user_id",
                     "city_id", "created_at", "__class__"])
        return jsonify(place.to_dict())


@app_views.route("/places_search", methods=['POST'], strict_slashes=False)
def search_place():
    """get all places"""
    all_places = storage.all(Place).values()

    req = request.get_json(silent=True)
    if req is None:
        abort(400, description="Not a JSON")

    # adding the user dictionary for each place to the response json
    def update_places_dict(data):
        new_data = []
        for place in data:
            print(f'line 85 {type(place.reviews)}')
            user = place.user
            place_dict = place.to_dict()
            place_dict['user'] = user.to_dict()
            place_dict['reviews'] = [{**review.to_dict(),
                                    'user': review.user.name}
                                    for review in place.reviews]
            new_data.append(place_dict)
        # result is sorted using the place name
        _dict = {_dict['name']: _dict for _dict in new_data}
        return [place[1] for place in sorted(_dict.items())]

    print(all_places)
    # if no request data was sent
    if len(req) == 0:
        return jsonify(update_places_dict(all_places))

    # if request data was sent
    state_ids = req.get("states", None)
    city_ids = req.get("cities", None)
    amenity_ids = req.get("amenities", None)
    places_in_state = []
    places_in_cities = []

    if isinstance(state_ids, list):
        states = [storage.get(State, id) for id in state_ids]
        cities = [[city for city in state.cities] for state in states if state]
        for inner_city in cities:
            for city in inner_city:
                if city:
                    places_in_state.extend([place for place in city.places
                                            if place not in places_in_state])
    if isinstance(city_ids, list):
        cities = [storage.get(City, id) for id in city_ids]
        for city in cities:
            if city:
                places_in_cities.extend([place for place in city.places
                                         if place not in places_in_cities])

    places_in_cities.extend(places_in_state)
    places_filtered = set(places_in_cities)

    if not amenity_ids:
        return jsonify(update_places_dict(places_filtered))

    if len(places_filtered) == 0 and not state_ids and not city_ids:
        new_places = filter_places_by_amenity(all_places, amenity_ids)
        return jsonify(update_places_dict(new_places))

    new_places = filter_places_by_amenity(places_filtered, amenity_ids)
    return jsonify(update_places_dict(new_places))


def filter_places_by_amenity(places, amenity_ids):
    new_places = []
    for place in places:
        if all(map(lambda amenity_id: 1 if amenity_id in
                   [amenity.id for amenity in place.amenities]
                   else 0, amenity_ids)):
            del place.amenities
            new_places.append(place)
    return new_places
