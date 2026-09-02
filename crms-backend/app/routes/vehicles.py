from flask import Blueprint, jsonify, request
from app.models.vehicle import Vehicle
from app import db
from app.utils.auth import role_required
import json


bp = Blueprint(
    'vehicles',
    __name__,
    url_prefix='/api/vehicles'
)


# ============================================================
# GET ALL VEHICLES
# ============================================================

@bp.route('/', methods=['GET'])
def get_vehicles():
    is_available = request.args.get('isAvailable')
    vehicle_type = request.args.get('type')
    min_price = request.args.get('minPrice')
    max_price = request.args.get('maxPrice')
    search = request.args.get('search')

    query = Vehicle.query

    # --------------------------------------------------------
    # Availability filter
    #
    # IMPORTANT:
    # Only filter by is_available when the frontend actually
    # sends the isAvailable parameter.
    #
    # This allows:
    # GET /api/vehicles/
    # to return all vehicles.
    # --------------------------------------------------------

    requested_available = None

    if is_available is not None:
        requested_available = (
            is_available.lower() == 'true'
        )

        query = query.filter(
            Vehicle.is_available == requested_available
        )

        # If the user specifically asks for available vehicles,
        # exclude vehicles that are unavailable or under maintenance.
        if requested_available:
            query = query.filter(
                Vehicle.available == True,
                Vehicle.status != 'maintenance'
            )

    # --------------------------------------------------------
    # Vehicle type
    # --------------------------------------------------------

    if vehicle_type:
        query = query.filter(
            Vehicle.vehicle_type == vehicle_type
        )

    # --------------------------------------------------------
    # Minimum price
    # --------------------------------------------------------

    if min_price:
        try:
            query = query.filter(
                Vehicle.price_per_day >= float(min_price)
            )
        except ValueError:
            return jsonify({
                'message': 'Invalid minimum price'
            }), 400

    # --------------------------------------------------------
    # Maximum price
    # --------------------------------------------------------

    if max_price:
        try:
            query = query.filter(
                Vehicle.price_per_day <= float(max_price)
            )
        except ValueError:
            return jsonify({
                'message': 'Invalid maximum price'
            }), 400

    # --------------------------------------------------------
    # Search
    # --------------------------------------------------------

    if search:
        like = f"%{search}%"

        query = query.filter(
            (Vehicle.name.ilike(like)) |
            (Vehicle.brand.ilike(like)) |
            (Vehicle.model.ilike(like))
        )

    # --------------------------------------------------------
    # Get vehicles
    # --------------------------------------------------------

    vehicles = query.order_by(
        Vehicle.created_at.desc()
    ).all()

    result = []

    for vehicle in vehicles:
        result.append(vehicle.to_dict())

    return jsonify({
        'vehicles': result
    }), 200


# ============================================================
# GET SINGLE VEHICLE
# ============================================================

@bp.route('/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)

    return jsonify({
        'vehicle': vehicle.to_dict()
    }), 200


# ============================================================
# CREATE VEHICLE
# ============================================================

@bp.route('/', methods=['POST'])
@role_required('admin')
def create_vehicle():
    data = request.get_json() or {}

    vehicle = Vehicle(
        name=data.get('name'),
        brand=data.get('brand'),
        model=data.get('model'),

        # Accept frontend camelCase
        vehicle_type=data.get(
            'vehicle_type',
            data.get('type')
        ),

        transmission=data.get(
            'transmission',
            'automatic'
        ),

        fuel_type=data.get(
            'fuel_type',
            data.get('fuelType', 'petrol')
        ),

        seats=data.get(
            'seats',
            5
        ),

        price_per_day=data.get(
            'price_per_day',
            data.get('pricePerDay')
        ),

        registration_number=data.get(
            'registration_number',
            data.get('registrationNumber')
        ),

        image=data.get('image'),

        features=json.dumps(
            data.get('features', [])
        ),

        description=data.get('description'),

        rating=data.get(
            'rating',
            4.5
        ),

        is_available=data.get(
            'is_available',
            data.get('isAvailable', True)
        ),

        unavailable_dates=json.dumps(
            data.get(
                'unavailable_dates',
                data.get('unavailableDates', [])
            )
        ),

        doors=data.get(
            'doors',
            4
        ),

        luggage=data.get(
            'luggage',
            2
        ),

        location=data.get(
            'location',
            'Nairobi'
        ),
    )

    db.session.add(vehicle)
    db.session.commit()

    return jsonify({
        'vehicle': vehicle.to_dict()
    }), 201


# ============================================================
# UPDATE VEHICLE
# ============================================================

@bp.route('/<int:vehicle_id>', methods=['PUT', 'PATCH'])
@role_required('admin')
def update_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)

    data = request.get_json() or {}

    # --------------------------------------------------------
    # Basic fields
    #
    # Accept BOTH:
    # vehicle_type / type
    # price_per_day / pricePerDay
    # fuel_type / fuelType
    # etc.
    # --------------------------------------------------------

    if 'name' in data:
        vehicle.name = data['name']

    if 'brand' in data:
        vehicle.brand = data['brand']

    if 'model' in data:
        vehicle.model = data['model']

    if 'vehicle_type' in data:
        vehicle.vehicle_type = data['vehicle_type']
    elif 'type' in data:
        vehicle.vehicle_type = data['type']

    if 'transmission' in data:
        vehicle.transmission = data['transmission']

    if 'fuel_type' in data:
        vehicle.fuel_type = data['fuel_type']
    elif 'fuelType' in data:
        vehicle.fuel_type = data['fuelType']

    if 'seats' in data:
        vehicle.seats = data['seats']

    if 'price_per_day' in data:
        vehicle.price_per_day = data['price_per_day']
    elif 'pricePerDay' in data:
        vehicle.price_per_day = data['pricePerDay']

    if 'registration_number' in data:
        vehicle.registration_number = data['registration_number']
    elif 'registrationNumber' in data:
        vehicle.registration_number = data['registrationNumber']

    if 'image' in data:
        vehicle.image = data['image']

    if 'description' in data:
        vehicle.description = data['description']

    if 'rating' in data:
        vehicle.rating = data['rating']

    if 'is_available' in data:
        vehicle.is_available = data['is_available']
    elif 'isAvailable' in data:
        vehicle.is_available = data['isAvailable']

    if 'doors' in data:
        vehicle.doors = data['doors']

    if 'luggage' in data:
        vehicle.luggage = data['luggage']

    if 'location' in data:
        vehicle.location = data['location']

    # --------------------------------------------------------
    # Features
    # --------------------------------------------------------

    if 'features' in data:
        vehicle.features = json.dumps(
            data['features']
        )

    # --------------------------------------------------------
    # Unavailable dates
    # --------------------------------------------------------

    if 'unavailable_dates' in data:
        vehicle.unavailable_dates = json.dumps(
            data['unavailable_dates']
        )
    elif 'unavailableDates' in data:
        vehicle.unavailable_dates = json.dumps(
            data['unavailableDates']
        )

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    db.session.commit()

    return jsonify({
        'vehicle': vehicle.to_dict()
    }), 200


# ============================================================
# DELETE VEHICLE
# ============================================================

@bp.route('/<int:vehicle_id>', methods=['DELETE'])
@role_required('admin')
def delete_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)

    db.session.delete(vehicle)
    db.session.commit()

    return jsonify({
        'message': 'Vehicle deleted successfully'
    }), 200