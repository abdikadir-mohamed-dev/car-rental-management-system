from flask import Blueprint, jsonify, request
from app.models.vehicle import Vehicle

vehicles_bp = Blueprint('vehicles', __name__, url_prefix='/api/vehicles')


@vehicles_bp.route('/', methods=['GET'])
def get_vehicles():
    status = request.args.get('status')
    vehicle_type = request.args.get('vehicleType')
    query = Vehicle.query
    if status:
        query = query.filter_by(status=status)
    if vehicle_type:
        query = query.filter_by(vehicle_type=vehicle_type)
    vehicles = query.all()
    return jsonify([v.to_dict() for v in vehicles])


@vehicles_bp.route('/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    return jsonify(vehicle.to_dict())
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
