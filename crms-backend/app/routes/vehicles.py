from flask import Blueprint, request, jsonify
from app import db
from app.models.vehicle import Vehicle

bp = Blueprint('vehicles', __name__)

@bp.route('/', methods=['GET'])
def get_vehicles():
    vehicles = Vehicle.query.all()
    result = [{
        'id': v.id,
        'name': v.name,
        'plate_number': v.plate_number,
        'category': v.category,
        'status': v.status,
        'price_per_day': v.price_per_day,
        'image_url': v.image_url
    } for v in vehicles]
    return jsonify(result), 200

@bp.route('/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    v = Vehicle.query.get_or_404(vehicle_id)
    return jsonify({
        'id': v.id,
        'name': v.name,
        'plate_number': v.plate_number,
        'category': v.category,
        'status': v.status,
        'price_per_day': v.price_per_day,
        'image_url': v.image_url
    }), 200
