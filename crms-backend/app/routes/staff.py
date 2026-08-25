from flask import Blueprint, request, jsonify
from app import db, jwt
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.booking import Booking
from app.models.trip import Trip
from app.models.driver_assignment import DriverAssignment
from app.models.inspection import Inspection
from app.models.report import Report
from app.models.notification import Notification
from datetime import datetime, date

bp = Blueprint('staff', __name__, url_prefix='/staff')

@bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    today = date.today().isoformat()
    bookings = Booking.query.all()
    today_bookings = [b for b in bookings if b.pickup_date == today or b.dropoff_date == today]
    pickups = sum(1 for b in today_bookings if b.pickup_date == today and b.status == 'confirmed')
    returns = sum(1 for b in today_bookings if b.dropoff_date == today and b.status == 'active')
    pending = sum(1 for b in bookings if b.status == 'pending')
    active = sum(1 for b in bookings if b.status == 'active')

    vehicles = Vehicle.query.all()
    available = sum(1 for v in vehicles if v.status == 'available')
    rented = sum(1 for v in vehicles if v.status == 'rented')
    maintenance = sum(1 for v in vehicles if v.status == 'maintenance')

    schedule = []
    for b in today_bookings[:5]:
        schedule.append({
            'time': b.pickup_date,
            'customer': b.user.name,
            'vehicle': b.vehicle.name,
            'action': 'Check-out' if b.pickup_date == today else 'Check-in',
            'status': b.status
        })

    recent = [{
        '_id': f'BKG-{b.id:04d}',
        'user': {'name': b.user.name},
        'vehicle': {'name': b.vehicle.name},
        'pickupDate': str(b.pickup_date),
        'dropoffDate': str(b.dropoff_date),
        'status': b.status
    } for b in bookings[:5]]

    return jsonify({
        'stats': {
            'todayPickups': pickups,
            'todayReturns': returns,
            'pendingTasks': pending,
            'activeRentals': active
        },
        'todaySchedule': schedule,
        'vehicleStatus': {
            'available': available,
            'rented': rented,
            'maintenance': maintenance
        },
        'recentBookings': recent
    }), 200

@bp.route('/bookings', methods=['GET'])
def get_bookings():
    status = request.args.get('status')
    query = Booking.query
    if status:
        query = query.filter_by(status=status)
    bookings = query.all()
    result = [{
        '_id': f'BKG-{b.id:04d}',
        'user': {'name': b.user.name},
        'vehicle': {'name': b.vehicle.name},
        'pickupDate': str(b.pickup_date),
        'dropoffDate': str(b.dropoff_date),
        'status': b.status,
        'pickupLocation': b.pickup_location,
        'dropoffLocation': b.dropoff_location
    } for b in bookings]
    return jsonify(result), 200

@bp.route('/bookings/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    b = Booking.query.get_or_404(booking_id)
    return jsonify({
        '_id': f'BKG-{b.id:04d}',
        'user': {'name': b.user.name},
        'vehicle': {'name': b.vehicle.name},
        'pickupDate': str(b.pickup_date),
        'dropoffDate': str(b.dropoff_date),
        'status': b.status,
        'pickupLocation': b.pickup_location,
        'dropoffLocation': b.dropoff_location
    }), 200

@bp.route('/bookings/<int:booking_id>/approve', methods=['PUT'])
def approve_booking(booking_id):
    b = Booking.query.get_or_404(booking_id)
    b.status = 'confirmed'
    db.session.commit()
    return jsonify({'message': 'Booking approved'}), 200

@bp.route('/bookings/<int:booking_id>/reject', methods=['PUT'])
def reject_booking(booking_id):
    b = Booking.query.get_or_404(booking_id)
    b.status = 'cancelled'
    db.session.commit()
    return jsonify({'message': 'Booking rejected'}), 200

@bp.route('/bookings/<int:booking_id>/checkout', methods=['POST'])
def checkout_booking(booking_id):
    data = request.get_json()
    b = Booking.query.get_or_404(booking_id)
    b.status = 'active'
    b.vehicle.status = 'rented'
    inspection = Inspection(
        booking_id=b.id,
        vehicle_id=b.vehicle_id,
        type='check-out',
        mileage=data.get('mileage'),
        fuel_level=data.get('fuelLevel'),
        condition=data.get('condition'),
        status='passed'
    )
    db.session.add(inspection)
    db.session.commit()
    return jsonify({'message': 'Check-out successful'}), 200

@bp.route('/bookings/<int:booking_id>/checkin', methods=['POST'])
def checkin_booking(booking_id):
    data = request.get_json()
    b = Booking.query.get_or_404(booking_id)
    b.status = 'completed'
    b.vehicle.status = 'available'
    inspection = Inspection(
        booking_id=b.id,
        vehicle_id=b.vehicle_id,
        type='check-in',
        mileage=data.get('mileage'),
        fuel_level=data.get('fuelLevel'),
        condition=data.get('condition'),
        damage_notes=data.get('damage'),
        status='passed'
    )
    db.session.add(inspection)
    db.session.commit()
    return jsonify({'message': 'Check-in successful'}), 200

@bp.route('/trips', methods=['GET'])
def get_trips():
    trips = Trip.query.all()
    result = [{
        '_id': f'TRP-{t.id:03d}',
        'customer': {'name': t.booking.user.name},
        'vehicle': {'name': t.booking.vehicle.name},
        'pickupLocation': t.pickup_location,
        'dropoffLocation': t.dropoff_location,
        'pickupTime': t.pickup_time.isoformat() if t.pickup_time else None,
        'status': t.status
    } for t in trips]
    return jsonify(result), 200

@bp.route('/trips/<int:trip_id>/status', methods=['PUT'])
def update_trip_status(trip_id):
    data = request.get_json()
    t = Trip.query.get_or_404(trip_id)
    t.status = data.get('status', t.status)
    db.session.commit()
    return jsonify({'message': 'Trip status updated'}), 200

@bp.route('/vehicles/inspection', methods=['GET'])
def get_vehicles_for_inspection():
    vehicles = Vehicle.query.filter(Vehicle.status.in_(['available', 'rented'])).all()
    result = [{
        'id': v.id,
        'name': v.name,
        'plate': v.plate_number,
        'status': v.status,
        'condition': '',
        'mileage': '',
        'fuelLevel': '',
        'notes': '',
        'type': 'check-out'
    } for v in vehicles]
    return jsonify(result), 200

@bp.route('/vehicles/<int:vehicle_id>/inspection', methods=['PUT'])
def update_vehicle_inspection(vehicle_id):
    data = request.get_json()
    v = Vehicle.query.get_or_404(vehicle_id)
    v.status = data.get('status', v.status)
    db.session.commit()
    return jsonify({'message': 'Vehicle inspection updated'}), 200

@bp.route('/customers', methods=['GET'])
def get_customers():
    customers = User.query.filter_by(role='customer').all()
    result = [{
        '_id': f'CUS-{c.id:03d}',
        'name': c.name,
        'email': c.email,
        'phone': c.phone,
        'licenseNumber': c.license_number,
        'totalRentals': len(c.bookings),
        'joined': c.created_at.isoformat()
    } for c in customers]
    return jsonify(result), 200

@bp.route('/driver-assignments', methods=['GET'])
def get_driver_requests():
    assignments = DriverAssignment.query.filter_by(status='pending').all()
    result = []
    for a in assignments:
        b = a.booking
        result.append({
            '_id': f'DRQ-{a.id:03d}',
            'bookingId': f'BKG-{b.id:04d}',
            'customer': {'name': b.user.name},
            'vehicle': {'name': b.vehicle.name},
            'pickupDate': str(b.pickup_date),
            'dropoffDate': str(b.dropoff_date),
            'pickupLocation': b.pickup_location,
            'dropoffLocation': b.dropoff_location,
            'status': a.status,
            'requestedAt': a.assigned_at.isoformat()
        })
    return jsonify(result), 200

@bp.route('/driver-assignments', methods=['POST'])
def create_driver_assignment():
    data = request.get_json()
    booking_id = int(data.get('bookingId').replace('BKG-', ''))
    driver_id = int(data.get('driverId').replace('DRV-', ''))
    assignment = DriverAssignment(
        booking_id=booking_id,
        driver_id=driver_id,
        status='assigned'
    )
    db.session.add(assignment)
    db.session.commit()
    return jsonify({'message': 'Driver assigned', 'assignment_id': assignment.id}), 201

@bp.route('/reports', methods=['GET'])
def get_reports():
    reports = Report.query.all()
    result = [{
        '_id': f'RPT-{r.id:03d}',
        'title': r.title,
        'type': r.type,
        'date': r.generated_at.isoformat(),
        'status': r.status
    } for r in reports]
    return jsonify(result), 200

@bp.route('/notifications', methods=['GET'])
def get_notifications():
    notifications = Notification.query.all()
    result = [{
        '_id': f'NTF-{n.id:03d}',
        'title': n.title,
        'message': n.message,
        'time': n.created_at.isoformat(),
        'read': n.read
    } for n in notifications]
    return jsonify(result), 200

@bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    n = Notification.query.get_or_404(notification_id)
    n.read = True
    db.session.commit()
    return jsonify({'message': 'Notification marked as read'}), 200
