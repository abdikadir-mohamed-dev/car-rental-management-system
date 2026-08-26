from flask import jsonify, request
from app import db
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.policy import RentalPolicy
from app.models.report import Report
from app.routes import bp


@bp.route('/vehicles', methods=['GET'])
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([v.to_dict() for v in vehicles])


@bp.route('/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    return jsonify(vehicle.to_dict())


@bp.route('/vehicles', methods=['POST'])
def create_vehicle():
    data = request.get_json() or {}

    if Vehicle.query.filter_by(registration_number=data.get('registrationNumber')).first():
        return jsonify({'error': 'Vehicle with this registration number already exists'}), 400

    vehicle = Vehicle(
        make=data.get('make'),
        model=data.get('model'),
        year=data.get('year'),
        registration_number=data.get('registrationNumber'),
        vehicle_type=data.get('vehicleType'),
        color=data.get('color'),
        transmission=data.get('transmission'),
        fuel_type=data.get('fuelType'),
        seating_capacity=data.get('seatingCapacity'),
        mileage=data.get('mileage', 0),
        daily_rental_rate=data.get('dailyRentalRate'),
        status=data.get('status', 'available'),
        description=data.get('description'),
        images=data.get('images', []),
        features=data.get('features', []),
        location=data.get('location'),
        available=data.get('available', True),
    )

    db.session.add(vehicle)
    db.session.commit()
    return jsonify(vehicle.to_dict()), 201


@bp.route('/vehicles/<int:vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    data = request.get_json() or {}

    if 'registrationNumber' in data:
        vehicle.registration_number = data['registrationNumber']
    if 'make' in data:
        vehicle.make = data['make']
    if 'model' in data:
        vehicle.model = data['model']
    if 'year' in data:
        vehicle.year = data['year']
    if 'vehicleType' in data:
        vehicle.vehicle_type = data['vehicleType']
    if 'color' in data:
        vehicle.color = data['color']
    if 'transmission' in data:
        vehicle.transmission = data['transmission']
    if 'fuelType' in data:
        vehicle.fuel_type = data['fuelType']
    if 'seatingCapacity' in data:
        vehicle.seating_capacity = data['seatingCapacity']
    if 'mileage' in data:
        vehicle.mileage = data['mileage']
    if 'dailyRentalRate' in data:
        vehicle.daily_rental_rate = data['dailyRentalRate']
    if 'status' in data:
        vehicle.status = data['status']
    if 'description' in data:
        vehicle.description = data['description']
    if 'images' in data:
        vehicle.images = data['images']
    if 'features' in data:
        vehicle.features = data['features']
    if 'location' in data:
        vehicle.location = data['location']
    if 'available' in data:
        vehicle.available = data['available']

    db.session.commit()
    return jsonify(vehicle.to_dict())


@bp.route('/vehicles/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    db.session.delete(vehicle)
    db.session.commit()
    return jsonify({'message': 'Vehicle deleted'}), 200


@bp.route('/staff', methods=['GET'])
def get_staff():
    staff = User.query.filter_by(role='staff').all()
    return jsonify([s.to_dict() for s in staff])


@bp.route('/staff', methods=['POST'])
def create_staff():
    data = request.get_json() or {}
    user = User(
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        role='staff',
        is_active=data.get('isActive', True),
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@bp.route('/staff/<int:staff_id>', methods=['PUT'])
def update_staff(staff_id):
    user = User.query.get_or_404(staff_id)
    if user.role != 'staff':
        return jsonify({'error': 'Not a staff account'}), 400

    data = request.get_json() or {}
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'phone' in data:
        user.phone = data['phone']
    if 'isActive' in data:
        user.is_active = data['isActive']

    db.session.commit()
    return jsonify(user.to_dict())


@bp.route('/rental-policies', methods=['GET'])
def get_policies():
    policies = RentalPolicy.query.all()
    result = {}
    for policy in policies:
        result[policy.key] = policy.value
    return jsonify(result)


@bp.route('/rental-policies', methods=['PUT'])
def update_policies():
    data = request.get_json() or {}
    for key, value in data.items():
        policy = RentalPolicy.query.filter_by(key=key).first()
        if policy:
            policy.value = value
        else:
            policy = RentalPolicy(key=key, value=value)
            db.session.add(policy)
    db.session.commit()
    return jsonify({'message': 'Policies updated'})


@bp.route('/reports/revenue', methods=['GET'])
def report_revenue():
    period = request.args.get('period', '30d')
    data = {
        'labels': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        'values': [12000, 15000, 18000, 22000],
        'period': period,
    }
    report = Report(report_type='revenue', period=period, data=data)
    db.session.add(report)
    db.session.commit()
    return jsonify(data)


@bp.route('/reports/bookings', methods=['GET'])
def report_bookings():
    return jsonify({
        'labels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'values': [12, 18, 15, 22, 28, 35, 30],
    })


@bp.route('/reports/vehicles', methods=['GET'])
def report_vehicles():
    return jsonify({
        'labels': ['Sedan', 'SUV', 'Luxury', 'Van'],
        'values': [45, 30, 15, 10],
    })


@bp.route('/reports/fleet-utilization', methods=['GET'])
def report_fleet_utilization():
    return jsonify({
        'utilizationRate': 78,
        'available': 22,
        'rented': 45,
        'maintenance': 8,
        'retired': 5,
    })
