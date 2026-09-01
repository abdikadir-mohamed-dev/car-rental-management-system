from flask import Blueprint, jsonify

from app.extensions import db
from app.models.saved_car import SavedCar
from app.models.vehicle import Vehicle
from app.utils.auth import token_required, get_current_user


bp = Blueprint('saved_cars', __name__, url_prefix='/api/saved-cars')


@bp.get('')
@token_required
def get_saved_cars():
    """Get all saved cars belonging to the current user."""
    user = get_current_user()

    saved_cars = (
        SavedCar.query
        .filter_by(user_id=user.id)
        .order_by(SavedCar.created_at.desc())
        .all()
    )

    return jsonify({
        'savedCars': [saved_car.to_dict() for saved_car in saved_cars]
    }), 200


@bp.post('/<int:vehicle_id>')
@token_required
def save_car(vehicle_id):
    """Save a vehicle for the current user."""
    user = get_current_user()

    vehicle = Vehicle.query.get(vehicle_id)

    if not vehicle:
        return jsonify({
            'message': 'Vehicle not found'
        }), 404

    existing = SavedCar.query.filter_by(
        user_id=user.id,
        vehicle_id=vehicle_id
    ).first()

    if existing:
        return jsonify({
            'message': 'Vehicle is already saved',
            'savedCar': existing.to_dict()
        }), 200

    saved_car = SavedCar(
        user_id=user.id,
        vehicle_id=vehicle_id
    )

    db.session.add(saved_car)
    db.session.commit()

    return jsonify({
        'message': 'Vehicle saved successfully',
        'savedCar': saved_car.to_dict()
    }), 201


@bp.delete('/<int:vehicle_id>')
@token_required
def remove_saved_car(vehicle_id):
    """Remove a vehicle from the current user's saved cars."""
    user = get_current_user()

    saved_car = SavedCar.query.filter_by(
        user_id=user.id,
        vehicle_id=vehicle_id
    ).first()

    if not saved_car:
        return jsonify({
            'message': 'Vehicle is not saved'
        }), 404

    db.session.delete(saved_car)
    db.session.commit()

    return jsonify({
        'message': 'Vehicle removed from saved cars'
    }), 200


@bp.get('/<int:vehicle_id>/check')
@token_required
def check_saved_car(vehicle_id):
    """Check whether a vehicle is saved by the current user."""
    user = get_current_user()

    saved_car = SavedCar.query.filter_by(
        user_id=user.id,
        vehicle_id=vehicle_id
    ).first()

    return jsonify({
        'saved': saved_car is not None
    }), 200