from flask import Blueprint, request, jsonify
from app import db
from app.models import Vehicle

bp = Blueprint('vehicles', __name__, url_prefix='/api/vehicles')

@bp.route('/', methods=['GET'])
def get_vehicles():
    status = request.args.get('status', 'all')
    query = Vehicle.query
    if status != 'all':
        query = query.filter_by(status=status)
    vehicles = query.all()
    return jsonify([v.to_dict() for v in vehicles]), 200

@bp.route('/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    return jsonify(vehicle.to_dict()), 200

@bp.route('/', methods=['POST'])
def create_vehicle():
    data = request.get_json()
    vehicle = Vehicle(
        plate_number=data.get('plate_number'),
        model=data.get('model'),
        mileage=data.get('mileage', 0),
        fuel_level=data.get('fuel_level', 'Full'),
        status=data.get('status', 'available')
    )
    db.session.add(vehicle)
    db.session.commit()
    return jsonify(vehicle.to_dict()), 201

@bp.route('/<int:vehicle_id>', methods=['PATCH'])
def update_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    data = request.get_json()
    for key, value in data.items():
        if hasattr(vehicle, key):
            setattr(vehicle, key, value)
    db.session.commit()
    return jsonify(vehicle.to_dict()), 200
