from flask import jsonify, request
from app import db
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.policy import RentalPolicy
from app.models.report import Report
from app.models.shift import Shift
from app.models.booking import Booking
from app.models.payment import Payment
from app.routes import bp
from app.utils.auth import role_required
from werkzeug.security import generate_password_hash
from datetime import datetime


@bp.route('/dashboard', methods=['GET'])
@role_required('admin')
def admin_dashboard():
    total_users = User.query.count()
    total_vehicles = Vehicle.query.count()
    total_bookings = Booking.query.count()
    total_revenue = db.session.query(db.func.coalesce(db.func.sum(Payment.amount), 0)).scalar()
    recent_bookings = Booking.query.order_by(Booking.created_at.desc()).limit(5).all()
    recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
    recent_logins = User.query.filter(User.last_login != None).order_by(User.last_login.desc()).limit(5).all()

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
        'recentLogins': [
            {'_id': str(u.id), 'name': u.name, 'role': u.role, 'lastLogin': u.last_login.isoformat() if u.last_login else None}
            for u in recent_logins
        ],
    })


@bp.route('/users', methods=['GET'])
@role_required('admin')
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])


@bp.route('/users/<int:user_id>', methods=['PUT'])
@role_required('admin')
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
@role_required('admin')
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200


@bp.route('/vehicles', methods=['GET'])
@role_required('admin')
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([v.to_dict() for v in vehicles])


@bp.route('/vehicles/<int:vehicle_id>', methods=['GET'])
@role_required('admin')
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    return jsonify(vehicle.to_dict())


@bp.route('/vehicles', methods=['POST'])
@role_required('admin')
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
@role_required('admin')
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
@role_required('admin')
def delete_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    db.session.delete(vehicle)
    db.session.commit()
    return jsonify({'message': 'Vehicle deleted'}), 200


@bp.route('/maintenance', methods=['GET'])
@role_required('admin')
def get_maintenance():
    records = Maintenance.query.all()
    result = []
    for m in records:
        result.append({
            'id': m.id,
            'vehicleId': m.vehicle_id,
            'vehicle': f"{m.vehicle.make} {m.vehicle.model}" if m.vehicle else 'Unknown',
            'notes': m.notes,
            'status': m.status,
            'created_at': m.created_at.isoformat() if m.created_at else None,
        })
    return jsonify(result), 200


@bp.route('/maintenance/<int:maintenance_id>', methods=['PUT'])
@role_required('admin')
def update_maintenance(maintenance_id):
    m = Maintenance.query.get_or_404(maintenance_id)
    data = request.get_json() or {}
    m.status = data.get('status', m.status)
    m.notes = data.get('notes', m.notes)
    db.session.commit()

    vehicle = Vehicle.query.get(m.vehicle_id)
    if m.status == 'resolved':
        if vehicle:
            vehicle.status = 'available'
            vehicle.is_available = True
    elif m.status == 'in_progress':
        if vehicle:
            vehicle.status = 'maintenance'
            vehicle.is_available = False
    db.session.commit()
    return jsonify({'message': 'Maintenance updated'}), 200


@bp.route('/staff', methods=['GET'])
@role_required('admin')
def get_staff():
    staff = User.query.filter_by(role='staff').all()
    return jsonify([s.to_dict() for s in staff])


import random
import string


def generate_password(length=8):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))


@bp.route('/staff', methods=['POST'])
@role_required('admin')
def create_staff():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')

    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    password = generate_password(8)
    user = User(
        name=name,
        email=email,
        phone=phone,
        role='staff',
        is_active=data.get('isActive', True),
        password_hash=generate_password_hash(password),
        must_change_password=True,
    )
    db.session.add(user)
    db.session.flush()

    shift_start = data.get('shiftStart')
    shift_end = data.get('shiftEnd')
    if not shift_start or not shift_end:
        shift_start = datetime.utcnow().replace(hour=8, minute=0, second=0, microsecond=0)
        shift_end = shift_start.replace(hour=16, minute=0, second=0, microsecond=0)

    shift = Shift(staff_id=user.id, start_time=shift_start, end_time=shift_end)
    db.session.add(shift)
    db.session.commit()

    return jsonify({
        'user': user.to_dict(),
        'password': password,
        'shift': shift.to_dict(),
    }), 201


@bp.route('/staff/<int:staff_id>', methods=['PUT'])
@role_required('admin')
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
    if 'shiftStart' in data and 'shiftEnd' in data:
        shift = Shift.query.filter_by(staff_id=staff_id).first()
        if shift:
            shift.start_time = data['shiftStart']
            shift.end_time = data['shiftEnd']
        else:
            shift = Shift(staff_id=staff_id, start_time=data['shiftStart'], end_time=data['shiftEnd'])
            db.session.add(shift)

    db.session.commit()
    result = user.to_dict()
    result['shift'] = Shift.query.filter_by(staff_id=staff_id).first().to_dict() if Shift.query.filter_by(staff_id=staff_id).first() else None
    return jsonify(result)


@bp.route('/staff/<int:staff_id>/shift', methods=['PUT'])
@role_required('admin')
def update_staff_shift(staff_id):
    user = User.query.get_or_404(staff_id)
    if user.role != 'staff':
        return jsonify({'error': 'Not a staff account'}), 400

    data = request.get_json() or {}
    shift = Shift.query.filter_by(staff_id=staff_id).first()
    if not shift:
        shift = Shift(staff_id=staff_id)
        db.session.add(shift)

    if 'startTime' in data:
        shift.start_time = data['startTime']
    if 'endTime' in data:
        shift.end_time = data['endTime']

    db.session.commit()
    return jsonify(shift.to_dict())


@bp.route('/rental-policies', methods=['GET'])
@role_required('admin')
def get_policies():
    policies = RentalPolicy.query.all()
    result = {}
    for policy in policies:
        result[policy.key] = policy.value
    return jsonify(result)


@bp.route('/rental-policies/public', methods=['GET'])
def get_public_policies():
    policies = RentalPolicy.query.all()
    result = {}
    for policy in policies:
        result[policy.key] = policy.value
    return jsonify(result)


@bp.route('/rental-policies', methods=['PUT'])
@role_required('admin')
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
@role_required('admin')
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
@role_required('admin')
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
@role_required('admin')
def report_bookings():
    return jsonify({
        'labels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'values': [12, 18, 15, 22, 28, 35, 30],
    })


@bp.route('/reports/vehicles', methods=['GET'])
@role_required('admin')
def report_vehicles():
    return jsonify({
        'labels': ['Sedan', 'SUV', 'Luxury', 'Van'],
        'values': [45, 30, 15, 10],
    })


@bp.route('/reports/fleet-utilization', methods=['GET'])
@role_required('admin')
def report_fleet_utilization():
    return jsonify({
        'utilizationRate': 78,
        'available': 22,
        'rented': 45,
        'maintenance': 8,
        'retired': 5,
    })


@bp.route('/bookings', methods=['GET'])
@role_required('admin')
def admin_get_bookings():
    bookings = Booking.query.order_by(Booking.created_at.desc()).all()
    result = []
    for b in bookings:
        booking_dict = b.to_dict()
        booking_dict['user'] = {'name': b.user.name} if b.user else None
        booking_dict['vehicle'] = {'name': f"{b.vehicle.make} {b.vehicle.model}"} if b.vehicle else None
        result.append(booking_dict)
    return jsonify({'bookings': result})


@bp.route('/bookings/<int:booking_id>', methods=['GET'])
@role_required('admin')
def admin_get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    booking_dict = booking.to_dict()
    booking_dict['user'] = {'name': booking.user.name} if booking.user else None
    booking_dict['vehicle'] = {'name': f"{booking.vehicle.make} {booking.vehicle.model}"} if booking.vehicle else None
    return jsonify(booking_dict)


@bp.route('/bookings/<int:booking_id>', methods=['PUT'])
@role_required('admin')
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
@role_required('admin')
def admin_get_payments():
    payments = Payment.query.order_by(Payment.created_at.desc()).all()
    result = []
    for p in payments:
        payment_dict = p.to_dict()
        payment_dict['user'] = {'name': p.customer.name} if p.customer else None
        payment_dict['booking'] = {'vehicle': {'name': f"{p.booking.vehicle.make} {p.booking.vehicle.model}"}} if p.booking and p.booking.vehicle else None
        result.append(payment_dict)
    return jsonify({'payments': result})


@bp.route('/payments/<int:payment_id>', methods=['GET'])
@role_required('admin')
def admin_get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    payment_dict = payment.to_dict()
    payment_dict['user'] = {'name': payment.customer.name} if payment.customer else None
    payment_dict['booking'] = {'vehicle': {'name': f"{payment.booking.vehicle.make} {payment.booking.vehicle.model}"}} if payment.booking and payment.booking.vehicle else None
    return jsonify(payment_dict)


@bp.route('/payments/<int:payment_id>/refund', methods=['POST'])
@role_required('admin')
def admin_refund_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    payment.status = 'refunded'
    db.session.commit()
    return jsonify({'payment': payment.to_dict()})


@bp.route('/drivers', methods=['GET'])
@role_required('admin')
def admin_get_drivers():
    drivers = User.query.filter_by(role='driver').all()
    return jsonify([d.to_dict() for d in drivers])


@bp.route('/drivers', methods=['POST'])
@role_required('admin')
def create_driver():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')

    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    password = generate_password(8)
    user = User(
        name=name,
        email=email,
        phone=phone,
        role='driver',
        is_active=data.get('isActive', True),
        password_hash=generate_password_hash(password),
        must_change_password=True,
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'user': user.to_dict(),
        'password': password,
    }), 201


@bp.route('/drivers/<int:driver_id>', methods=['PUT'])
@role_required('admin')
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
@role_required('admin')
def seed_data():
    data = request.get_json() or {}

    created = {'staff': [], 'drivers': [], 'vehicles': [], 'shifts': []}

    if data.get('staff') is not False:
        existing_staff = User.query.filter_by(role='staff').count()
        if existing_staff == 0:
            staff_payloads = [
                {'name': 'Staff 1', 'email': 'staff1@drivego.com', 'phone': '0711000001'},
                {'name': 'Staff 2', 'email': 'staff2@drivego.com', 'phone': '0711000002'},
                {'name': 'Staff 3', 'email': 'staff3@drivego.com', 'phone': '0711000003'},
            ]
            today = datetime.utcnow().date()
            shift_times = [
                (datetime.combine(today, datetime.min.time().replace(hour=0, minute=0)), datetime.combine(today, datetime.min.time().replace(hour=8, minute=0))),
                (datetime.combine(today, datetime.min.time().replace(hour=8, minute=0)), datetime.combine(today, datetime.min.time().replace(hour=16, minute=0))),
                (datetime.combine(today, datetime.min.time().replace(hour=16, minute=0)), datetime.combine(today, datetime.min.time().replace(hour=23, minute=59, second=59))),
            ]
            for i, payload in enumerate(staff_payloads):
                start, end = shift_times[i]
                result = create_staff_internal(payload, start, end)
                created['staff'].append(result['user'])
                created['shifts'].append(result['shift'])

    if data.get('drivers') is not False:
        existing_drivers = User.query.filter_by(role='driver').count()
        if existing_drivers == 0:
            driver_payloads = [
                {'name': 'James Kariuki', 'email': 'james.kariuki@drivego.com', 'phone': '0722000001'},
                {'name': 'David Kamau', 'email': 'david.kamau@drivego.com', 'phone': '0722000002'},
                {'name': 'Aisha Hassan', 'email': 'aisha.hassan@drivego.com', 'phone': '0722000003'},
                {'name': 'John Mwangi', 'email': 'john.mwangi@drivego.com', 'phone': '0722000004'},
                {'name': 'Mary Wanjiku', 'email': 'mary.wanjiku@drivego.com', 'phone': '0722000005'},
            ]
            for payload in driver_payloads:
                result = create_driver_internal(payload)
                created['drivers'].append(result['user'])

    if data.get('vehicles') is not False:
        vehicle_list = [
            {'make': 'Toyota', 'model': 'RAV4', 'year': 2023, 'registration_number': 'KDA 123A', 'vehicle_type': 'SUV', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 5500, 'status': 'available', 'available': True, 'location': 'Nairobi CBD', 'description': 'Reliable SUV for city and off-road trips.', 'images': ['https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Cruise Control']},
            {'make': 'Toyota', 'model': 'Camry', 'year': 2022, 'registration_number': 'KDB 234B', 'vehicle_type': 'Sedan', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 4500, 'status': 'available', 'available': True, 'location': 'Westlands', 'description': 'Comfortable sedan for business trips.', 'images': ['https://images.unsplash.com/photo-1623869675781-80aa31010a6b?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'USB Charging']},
            {'make': 'BMW', 'model': '3 Series', 'year': 2023, 'registration_number': 'KDC 345C', 'vehicle_type': 'Sedan', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 8500, 'status': 'available', 'available': True, 'location': 'Kilimani', 'description': 'Premium executive sedan.', 'images': ['https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'GPS', 'Leather Seats']},
            {'make': 'Mercedes', 'model': 'C-Class', 'year': 2023, 'registration_number': 'KDD 456D', 'vehicle_type': 'Sedan', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 9500, 'status': 'available', 'available': True, 'location': 'Karen', 'description': 'Luxury sedan with advanced features.', 'images': ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'GPS', 'Leather Seats', 'Sunroof']},
            {'make': 'Range Rover', 'model': 'Evoque', 'year': 2023, 'registration_number': 'KDE 567E', 'vehicle_type': 'SUV', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 12000, 'status': 'available', 'available': True, 'location': 'Nairobi CBD', 'description': 'Stylish compact luxury SUV.', 'images': ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'GPS', 'Backup Camera']},
            {'make': 'Audi', 'model': 'A4', 'year': 2022, 'registration_number': 'KDF 678F', 'vehicle_type': 'Sedan', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 8000, 'status': 'available', 'available': True, 'location': 'Westlands', 'description': 'Sporty executive sedan.', 'images': ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'Cruise Control', 'USB Charging']},
            {'make': 'Ford', 'model': 'Mustang', 'year': 2023, 'registration_number': 'KDG 789G', 'vehicle_type': 'Sports', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 4, 'daily_rental_rate': 14000, 'status': 'available', 'available': True, 'location': 'Kilimani', 'description': 'High-performance sports car.', 'images': ['https://images.unsplash.com/photo-1584345604476-8ec5f87f4d5a?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'Cruise Control', 'Leather Seats']},
            {'make': 'Toyota', 'model': 'Prado', 'year': 2022, 'registration_number': 'KDH 890H', 'vehicle_type': 'SUV', 'transmission': 'Automatic', 'fuel_type': 'Diesel', 'seating_capacity': 7, 'daily_rental_rate': 9000, 'status': 'maintenance', 'available': False, 'location': 'Karen', 'description': 'Currently under maintenance.', 'images': ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Parking Sensors']},
            {'make': 'Honda', 'model': 'CR-V', 'year': 2023, 'registration_number': 'KDI 901I', 'vehicle_type': 'SUV', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 6500, 'status': 'available', 'available': True, 'location': 'Nairobi CBD', 'description': 'Versatile compact SUV.', 'images': ['https://images.unsplash.com/photo-1568844293986-ca4c3579c5e5?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'USB Charging', 'Cruise Control']},
            {'make': 'Nissan', 'model': 'X-Trail', 'year': 2022, 'registration_number': 'KDJ 012J', 'vehicle_type': 'SUV', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 7, 'daily_rental_rate': 7000, 'status': 'available', 'available': True, 'location': 'Westlands', 'description': 'Spacious family SUV.', 'images': ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'Backup Camera']},
            {'make': 'Volkswagen', 'model': 'Golf', 'year': 2023, 'registration_number': 'KDK 123K', 'vehicle_type': 'Hatchback', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 4000, 'status': 'available', 'available': True, 'location': 'Kilimani', 'description': 'Compact and efficient hatchback.', 'images': ['https://images.unsplash.com/photo-1471479917193-f00955256237?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'USB Charging']},
            {'make': 'Mazda', 'model': 'CX-5', 'year': 2023, 'registration_number': 'KDL 234L', 'vehicle_type': 'SUV', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 7500, 'status': 'available', 'available': True, 'location': 'Karen', 'description': 'Stylish SUV with great handling.', 'images': ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'GPS', 'Backup Camera']},
            {'make': 'Subaru', 'model': 'Forester', 'year': 2023, 'registration_number': 'KDM 345M', 'vehicle_type': 'SUV', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 7800, 'status': 'available', 'available': True, 'location': 'Nairobi CBD', 'description': 'Adventure-ready SUV with all-wheel drive.', 'images': ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'GPS', 'Backup Camera']},
            {'make': 'Hyundai', 'model': 'Tucson', 'year': 2023, 'registration_number': 'KDN 456N', 'vehicle_type': 'SUV', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 6200, 'status': 'available', 'available': True, 'location': 'Westlands', 'description': 'Modern SUV with great fuel efficiency.', 'images': ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'USB Charging', 'Cruise Control']},
            {'make': 'Kia', 'model': 'Sportage', 'year': 2023, 'registration_number': 'KDO 567O', 'vehicle_type': 'SUV', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 6800, 'status': 'available', 'available': True, 'location': 'Kilimani', 'description': 'Stylish and practical SUV.', 'images': ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'GPS', 'Backup Camera']},
            {'make': 'Lexus', 'model': 'RX 350', 'year': 2023, 'registration_number': 'KDP 678P', 'vehicle_type': 'Luxury', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 15000, 'status': 'available', 'available': True, 'location': 'Karen', 'description': 'Luxury SUV with premium features.', 'images': ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'GPS', 'Leather Seats', 'Sunroof']},
            {'make': 'Porsche', 'model': 'Cayenne', 'year': 2023, 'registration_number': 'KDQ 789Q', 'vehicle_type': 'Luxury', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 5, 'daily_rental_rate': 20000, 'status': 'available', 'available': True, 'location': 'Westlands', 'description': 'High-performance luxury SUV.', 'images': ['https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'GPS', 'Leather Seats', 'Sunroof', 'Premium Sound']},
            {'make': 'Chevrolet', 'model': 'Tahoe', 'year': 2022, 'registration_number': 'KDR 890R', 'vehicle_type': 'SUV', 'transmission': 'Automatic', 'fuel_type': 'Petrol', 'seating_capacity': 8, 'daily_rental_rate': 11000, 'status': 'available', 'available': True, 'location': 'Nairobi CBD', 'description': 'Spacious SUV for large groups.', 'images': ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Parking Sensors']},
            {'make': 'Jeep', 'model': 'Wrangler', 'year': 2023, 'registration_number': 'KDS 901S', 'vehicle_type': 'SUV', 'transmission': 'Manual', 'fuel_type': 'Petrol', 'seating_capacity': 4, 'daily_rental_rate': 9500, 'status': 'available', 'available': True, 'location': 'Kilimani', 'description': 'Off-road adventure vehicle.', 'images': ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'GPS', '4WD']},
            {'make': 'Toyota', 'model': 'Hilux', 'year': 2022, 'registration_number': 'KDT 012T', 'vehicle_type': 'Truck', 'transmission': 'Manual', 'fuel_type': 'Diesel', 'seating_capacity': 5, 'daily_rental_rate': 8000, 'status': 'available', 'available': True, 'location': 'Westlands', 'description': 'Heavy-duty pickup truck.', 'images': ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'], 'features': ['Air Conditioning', 'Bluetooth', 'Backup Camera']},
        ]
        for v in vehicle_list:
            if not Vehicle.query.filter_by(registration_number=v['registration_number']).first():
                vehicle = Vehicle(**v)
                db.session.add(vehicle)
                db.session.flush()
                created['vehicles'].append({'id': vehicle.id, 'name': f"{vehicle.make} {vehicle.model}"})

    db.session.commit()
    return jsonify({'message': 'Data seeded successfully', 'created': created})


def create_staff_internal(payload, shift_start, shift_end):
    password = generate_password(8)
    user = User(
        name=payload['name'],
        email=payload['email'],
        phone=payload.get('phone'),
        role='staff',
        is_active=True,
        password_hash=generate_password_hash(password),
        must_change_password=True,
    )
    db.session.add(user)
    db.session.flush()

    shift = Shift(staff_id=user.id, start_time=shift_start, end_time=shift_end)
    db.session.add(shift)
    db.session.flush()

    return {
        'user': {'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role, 'password': password},
        'shift': {'id': shift.id, 'staffId': shift.staff_id, 'startTime': shift.start_time.isoformat(), 'endTime': shift.end_time.isoformat()},
    }


def create_driver_internal(payload):
    password = generate_password(8)
    user = User(
        name=payload['name'],
        email=payload['email'],
        phone=payload.get('phone'),
        role='driver',
        is_active=True,
        password_hash=generate_password_hash(password),
        must_change_password=True,
    )
    db.session.add(user)
    db.session.flush()

    return {
        'user': {'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role, 'password': password},
    }
