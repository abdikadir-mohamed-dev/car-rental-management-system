from flask import Blueprint, jsonify, request
from app.models.vehicle import Vehicle
from app import db
from app.utils.auth import token_required, role_required

bp = Blueprint('vehicles', __name__, url_prefix='/api/vehicles')

@bp.route('/', methods=['GET'])
def get_vehicles():
    is_available = request.args.get('isAvailable')
    vehicle_type = request.args.get('type')
    min_price = request.args.get('minPrice')
    max_price = request.args.get('maxPrice')
    search = request.args.get('search')

    query = Vehicle.query
    if is_available is not None:
     requested_available = (
        is_available.lower() == 'true'
    )

    query = query.filter(
        Vehicle.is_available == requested_available
    )

    if requested_available:
        query = query.filter(
            Vehicle.available == True,
            Vehicle.status != 'maintenance'
        )
    if vehicle_type:
        query = query.filter_by(vehicle_type=vehicle_type)
    if min_price:
        query = query.filter(Vehicle.price_per_day >= float(min_price))
    if max_price:
        query = query.filter(Vehicle.price_per_day <= float(max_price))
    if search:
        like = f"%{search}%"
        query = query.filter(
            (Vehicle.name.ilike(like)) |
            (Vehicle.brand.ilike(like)) |
            (Vehicle.model.ilike(like))
        )

    vehicles = query.order_by(Vehicle.created_at.desc()).all()
    result = []
    for v in vehicles:
        data = v.to_dict()
        result.append(data)
    return jsonify({'vehicles': result}), 200

@bp.route('/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    return jsonify({'vehicle': vehicle.to_dict()}), 200

@bp.route('/', methods=['POST'])
@role_required('admin')
def create_vehicle():
    data = request.get_json() or {}
    vehicle = Vehicle(
        name=data.get('name'),
        brand=data.get('brand'),
        model=data.get('model'),
        vehicle_type=data.get('type'),
        transmission=data.get('transmission', 'automatic'),
        fuel_type=data.get('fuelType', 'petrol'),
        seats=data.get('seats', 5),
        price_per_day=data.get('pricePerDay'),
        registration_number=data.get('registrationNumber'),
        image=data.get('image'),
        features=__import__('json').dumps(data.get('features', [])),
        description=data.get('description'),
        rating=data.get('rating', 4.5),
        is_available=data.get('isAvailable', True),
        unavailable_dates=__import__('json').dumps(data.get('unavailableDates', [])),
        doors=data.get('doors', 4),
        luggage=data.get('luggage', 2),
        location=data.get('location', 'Nairobi'),
    )
    db.session.add(vehicle)
    db.session.commit()
    return jsonify({'vehicle': vehicle.to_dict()}), 201

@bp.route('/<int:vehicle_id>', methods=['PUT', 'PATCH'])
@role_required('admin')
def update_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    data = request.get_json() or {}
    for field in ['name', 'brand', 'model', 'vehicle_type', 'transmission', 'fuel_type',
                  'seats', 'price_per_day', 'registration_number', 'image', 'description',
                  'rating', 'is_available', 'doors', 'luggage', 'location']:
        if field in data:
            setattr(vehicle, field, data[field])
    if 'features' in data:
        vehicle.features = __import__('json').dumps(data['features'])
    if 'unavailableDates' in data:
        vehicle.unavailable_dates = __import__('json').dumps(data['unavailableDates'])
    db.session.commit()
    return jsonify({'vehicle': vehicle.to_dict()}), 200

@bp.route('/<int:vehicle_id>', methods=['DELETE'])
@role_required('admin')
def delete_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    db.session.delete(vehicle)
    db.session.commit()
    return jsonify({'message': 'Vehicle deleted successfully'}), 200
