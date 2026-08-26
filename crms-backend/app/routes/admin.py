from flask import jsonify, request
from app import db
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.policy import RentalPolicy
from app.models.report import Report
from app.models.shift import Shift
from app.routes import bp
from werkzeug.security import generate_password_hash
from datetime import datetime


@bp.route('/dashboard', methods=['GET'])
def admin_dashboard():
    total_users = User.query.count()
    total_vehicles = Vehicle.query.count()
    total_bookings = Booking.query.count()
    total_revenue = db.session.query(db.func.coalesce(db.func.sum(Payment.amount), 0)).scalar()
    recent_bookings = Booking.query.order_by(Booking.created_at.desc()).limit(5).all()
    recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()

    return jsonify({
        'totalUsers': total_users,
        'totalVehicles': total_vehicles,
        'totalBookings': total_bookings,
        'totalRevenue': total_revenue,
        'recentBookings': [
            {
                '_id': str(b.id),
                'vehicle': {'name': f"{b.vehicle.make} {b.vehicle.model}"} if b.vehicle else {},
                'user': {'name': b.user.name} if b.user else {},
                'totalAmount': b.total_amount,
            }
            for b in recent_bookings
        ],
        'recentUsers': [
            {'_id': str(u.id), 'name': u.name, 'role': u.role}
            for u in recent_users
        ],
    })


@bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])


@bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'role' in data:
        user.role = data['role']
    if 'isActive' in data:
        user.is_active = data['isActive']
    db.session.commit()
    return jsonify(user.to_dict())


@bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200


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


@bp.route('/reports', methods=['GET'])
def get_reports():
    return jsonify({
        'revenue': {
            'labels': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            'values': [12000, 15000, 18000, 22000],
            'period': request.args.get('period', '30d'),
        },
        'bookings': {
            'labels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'values': [12, 18, 15, 22, 28, 35, 30],
        },
        'vehicles': {
            'labels': ['Sedan', 'SUV', 'Luxury', 'Van'],
            'values': [45, 30, 15, 10],
        },
        'fleetUtilization': {
            'utilizationRate': 78,
            'available': 22,
            'rented': 45,
            'maintenance': 8,
            'retired': 5,
        },
    })


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


@bp.route('/bookings', methods=['GET'])
def admin_get_bookings():
    bookings = Booking.query.order_by(Booking.created_at.desc()).all()
    return jsonify({'bookings': [b.to_dict() for b in bookings]})


@bp.route('/bookings/<int:booking_id>', methods=['GET'])
def admin_get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    return jsonify(booking.to_dict())


@bp.route('/bookings/<int:booking_id>', methods=['PUT'])
def admin_update_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json() or {}
    if 'status' in data:
        booking.status = data['status']
    if 'pickupLocation' in data:
        booking.pickup_location = data['pickupLocation']
    if 'returnLocation' in data:
        booking.return_location = data['returnLocation']
    db.session.commit()
    return jsonify({'booking': booking.to_dict()})


@bp.route('/payments', methods=['GET'])
def admin_get_payments():
    payments = Payment.query.order_by(Payment.created_at.desc()).all()
    return jsonify({'payments': [p.to_dict() for p in payments]})


@bp.route('/payments/<int:payment_id>', methods=['GET'])
def admin_get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    return jsonify(payment.to_dict())


@bp.route('/payments/<int:payment_id>/refund', methods=['POST'])
def admin_refund_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    payment.status = 'refunded'
    db.session.commit()
    return jsonify({'payment': payment.to_dict()})


@bp.route('/drivers', methods=['GET'])
def admin_get_drivers():
    drivers = User.query.filter_by(role='driver').all()
    return jsonify([d.to_dict() for d in drivers])


@bp.route('/drivers/<int:driver_id>', methods=['PUT'])
def admin_update_driver(driver_id):
    user = User.query.get_or_404(driver_id)
    if user.role != 'driver':
        return jsonify({'error': 'Not a driver account'}), 400
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


@bp.route('/seed', methods=['POST'])
def seed_data():
    data = request.get_json() or {}

    staff_count = User.query.filter_by(role='staff').count()
    driver_count = User.query.filter_by(role='driver').count()
    vehicle_count = Vehicle.query.count()

    created = {'staff': [], 'drivers': [], 'vehicles': [], 'shifts': []}

    if staff_count == 0 and data.get('staff') is not False:
        staff = [
            User(name='Staff 1', email='staff1@drivego.com', phone='0711000001', role='staff', password_hash=generate_password_hash('staff123'), must_change_password=False),
            User(name='Staff 2', email='staff2@drivego.com', phone='0711000002', role='staff', password_hash=generate_password_hash('staff123'), must_change_password=False),
            User(name='Staff 3', email='staff3@drivego.com', phone='0711000003', role='staff', password_hash=generate_password_hash('staff123'), must_change_password=False),
        ]
        db.session.add_all(staff)
        db.session.flush()
        for s in staff:
            created['staff'].append({'id': s.id, 'email': s.email})

    if driver_count == 0 and data.get('drivers') is not False:
        drivers = [
            User(name='James Kariuki', email='james.kariuki@drivego.com', phone='0722000001', role='driver', password_hash=generate_password_hash('driver123'), must_change_password=False),
            User(name='David Kamau', email='david.kamau@drivego.com', phone='0722000002', role='driver', password_hash=generate_password_hash('driver123'), must_change_password=False),
            User(name='Aisha Hassan', email='aisha.hassan@drivego.com', phone='0722000003', role='driver', password_hash=generate_password_hash('driver123'), must_change_password=False),
            User(name='John Mwangi', email='john.mwangi@drivego.com', phone='0722000004', role='driver', password_hash=generate_password_hash('driver123'), must_change_password=False),
            User(name='Mary Wanjiku', email='mary.wanjiku@drivego.com', phone='0722000005', role='driver', password_hash=generate_password_hash('driver123'), must_change_password=False),
        ]
        db.session.add_all(drivers)
        db.session.flush()
        for d in drivers:
            created['drivers'].append({'id': d.id, 'email': d.email})

    if vehicle_count == 0 and data.get('vehicles') is not False:
        vehicles = [
            Vehicle(make='Toyota', model='RAV4', year=2023, registration_number='KDA 123A', vehicle_type='SUV', transmission='Automatic', fuel_type='Petrol', seating_capacity=5, daily_rental_rate=5500, status='available', available=True, location='Nairobi CBD', description='Reliable SUV for city and off-road trips.', images=['https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80'], features=['Air Conditioning','Bluetooth','Backup Camera','Cruise Control']),
            Vehicle(make='Toyota', model='Camry', year=2022, registration_number='KDB 234B', vehicle_type='Sedan', transmission='Automatic', fuel_type='Petrol', seating_capacity=5, daily_rental_rate=4500, status='available', available=True, location='Westlands', description='Comfortable sedan for business trips.', images=['https://images.unsplash.com/photo-1623869675781-80aa31010a6b?w=800&q=80'], features=['Air Conditioning','Bluetooth','USB Charging']),
            Vehicle(make='BMW', model='3 Series', year=2023, registration_number='KDC 345C', vehicle_type='Sedan', transmission='Automatic', fuel_type='Petrol', seating_capacity=5, daily_rental_rate=8500, status='available', available=True, location='Kilimani', description='Premium executive sedan.', images=['https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80'], features=['Air Conditioning','Bluetooth','GPS','Leather Seats']),
            Vehicle(make='Mercedes', model='C-Class', year=2023, registration_number='KDD 456D', vehicle_type='Sedan', transmission='Automatic', fuel_type='Petrol', seating_capacity=5, daily_rental_rate=9500, status='available', available=True, location='Karen', description='Luxury sedan with advanced features.', images=['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'], features=['Air Conditioning','Bluetooth','GPS','Leather Seats','Sunroof']),
            Vehicle(make='Range Rover', model='Evoque', year=2023, registration_number='KDE 567E', vehicle_type='SUV', transmission='Automatic', fuel_type='Petrol', seating_capacity=5, daily_rental_rate=12000, status='available', available=True, location='Nairobi CBD', description='Stylish compact luxury SUV.', images=['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80'], features=['Air Conditioning','Bluetooth','GPS','Backup Camera']),
            Vehicle(make='Audi', model='A4', year=2022, registration_number='KDF 678F', vehicle_type='Sedan', transmission='Automatic', fuel_type='Petrol', seating_capacity=5, daily_rental_rate=8000, status='available', available=True, location='Westlands', description='Sporty executive sedan.', images=['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'], features=['Air Conditioning','Bluetooth','Cruise Control','USB Charging']),
            Vehicle(make='Ford', model='Mustang', year=2023, registration_number='KDG 789G', vehicle_type='Sports', transmission='Automatic', fuel_type='Petrol', seating_capacity=4, daily_rental_rate=14000, status='available', available=True, location='Kilimani', description='High-performance sports car.', images=['https://images.unsplash.com/photo-1584345604476-8ec5f87f4d5a?w=800&q=80'], features=['Air Conditioning','Bluetooth','Cruise Control','Leather Seats']),
            Vehicle(make='Toyota', model='Prado', year=2022, registration_number='KDH 890H', vehicle_type='SUV', transmission='Automatic', fuel_type='Diesel', seating_capacity=7, daily_rental_rate=9000, status='maintenance', available=False, location='Karen', description='Currently under maintenance.', images=['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'], features=['Air Conditioning','Bluetooth','Backup Camera','Parking Sensors']),
            Vehicle(make='Honda', model='CR-V', year=2023, registration_number='KDI 901I', vehicle_type='SUV', transmission='Automatic', fuel_type='Petrol', seating_capacity=5, daily_rental_rate=6500, status='available', available=True, location='Nairobi CBD', description='Versatile compact SUV.', images=['https://images.unsplash.com/photo-1568844293986-ca4c3579c5e5?w=800&q=80'], features=['Air Conditioning','Bluetooth','USB Charging','Cruise Control']),
            Vehicle(make='Nissan', model='X-Trail', year=2022, registration_number='KDJ 012J', vehicle_type='SUV', transmission='Automatic', fuel_type='Petrol', seating_capacity=7, daily_rental_rate=7000, status='available', available=True, location='Westlands', description='Spacious family SUV.', images=['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'], features=['Air Conditioning','Bluetooth','Backup Camera']),
            Vehicle(make='Volkswagen', model='Golf', year=2023, registration_number='KDK 123K', vehicle_type='Hatchback', transmission='Automatic', fuel_type='Petrol', seating_capacity=5, daily_rental_rate=4000, status='available', available=True, location='Kilimani', description='Compact and efficient hatchback.', images=['https://images.unsplash.com/photo-1471479917193-f00955256237?w=800&q=80'], features=['Air Conditioning','Bluetooth','USB Charging']),
            Vehicle(make='Mazda', model='CX-5', year=2023, registration_number='KDL 234L', vehicle_type='SUV', transmission='Automatic', fuel_type='Petrol', seating_capacity=5, daily_rental_rate=7500, status='available', available=True, location='Karen', description='Stylish SUV with great handling.', images=['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'], features=['Air Conditioning','Bluetooth','GPS','Backup Camera']),
        ]
        db.session.add_all(vehicles)
        db.session.flush()
        for v in vehicles:
            created['vehicles'].append({'id': v.id, 'name': f"{v.make} {v.model}"})

    db.session.commit()

    if staff_count == 0 and data.get('staff') is not False:
        shifts = [
            Shift(staff_id=created['staff'][0]['id'], start_time=datetime(2026, 8, 26, 8, 0, 0), end_time=datetime(2026, 8, 26, 16, 0, 0)),
            Shift(staff_id=created['staff'][1]['id'], start_time=datetime(2026, 8, 26, 16, 0, 0), end_time=datetime(2026, 8, 27, 0, 0, 0)),
            Shift(staff_id=created['staff'][2]['id'], start_time=datetime(2026, 8, 27, 0, 0, 0), end_time=datetime(2026, 8, 27, 8, 0, 0)),
        ]
        db.session.add_all(shifts)
        db.session.flush()
        created['shifts'] = [{'id': s.id, 'staffId': s.staff_id} for s in shifts]

    db.session.commit()
    return jsonify({'message': 'Data seeded successfully', 'created': created})
