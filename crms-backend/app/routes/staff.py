from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.booking import Booking
from app.models.trip import Trip
from app.models.driver_assignment import DriverAssignment
from app.models.inspection import Inspection
from app.models.report import Report
from app.models.notification import Notification
from app.models.maintenance import Maintenance
from datetime import datetime, date
from app.utils.auth import token_required, role_required

bp = Blueprint('staff', __name__, url_prefix='/staff')


@bp.route('/dashboard', methods=['GET'])
@role_required('staff', 'admin')
def get_dashboard():
    today = date.today()
    bookings = Booking.query.all()
    today_bookings = [b for b in bookings if b.pickup_date and b.pickup_date.date() == today or b.dropoff_date and b.dropoff_date.date() == today]
    pickups = sum(1 for b in today_bookings if b.pickup_date and b.pickup_date.date() == today and b.status == 'confirmed')
    returns = sum(1 for b in today_bookings if b.dropoff_date and b.dropoff_date.date() == today and b.status == 'active')
    pending = sum(1 for b in bookings if b.status == 'pending')
    active = sum(1 for b in bookings if b.status == 'active')

    vehicles = Vehicle.query.all()
    available = sum(1 for v in vehicles if v.status == 'available')
    rented = sum(1 for v in vehicles if v.status == 'rented')
    maintenance = sum(1 for v in vehicles if v.status == 'maintenance')

    schedule = []
    for b in today_bookings[:5]:
        vehicle_name = f"{b.vehicle.make} {b.vehicle.model}" if b.vehicle else 'Unknown'
        customer_name = b.user.name if b.user else 'Unknown'
        schedule.append({
            'time': b.pickup_date.isoformat() if b.pickup_date else None,
            'customer': customer_name,
            'vehicle': vehicle_name,
            'action': 'Check-out' if b.pickup_date and b.pickup_date.date() == today else 'Check-in',
            'status': b.status
        })

    recent = [{
        '_id': f'BKG-{b.id:04d}',
        'user': {'name': b.user.name} if b.user else {},
        'vehicle': {'name': f"{b.vehicle.make} {b.vehicle.model}"} if b.vehicle else {},
        'pickupDate': b.pickup_date.isoformat() if b.pickup_date else None,
        'dropoffDate': b.dropoff_date.isoformat() if b.dropoff_date else None,
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
@role_required('staff', 'admin')
def get_bookings():
    status = request.args.get('status')
    query = Booking.query
    if status:
        query = query.filter_by(status=status)
    bookings = query.all()
    result = [{
        '_id': f'BKG-{b.id:04d}',
        'user': {'name': b.user.name} if b.user else {},
        'vehicle': {'name': f"{b.vehicle.make} {b.vehicle.model}"} if b.vehicle else {},
        'pickupDate': b.pickup_date.isoformat() if b.pickup_date else None,
        'dropoffDate': b.dropoff_date.isoformat() if b.dropoff_date else None,
        'status': b.status,
        'pickupLocation': b.pickup_location,
        'dropoffLocation': b.dropoff_location
    } for b in bookings]
    return jsonify(result), 200


@bp.route('/bookings/pending', methods=['GET'])
@role_required('staff', 'admin')
def get_pending_bookings():
    bookings = Booking.query.filter_by(status='pending').all()
    result = [{
        '_id': f'BKG-{b.id:04d}',
        'user': {'name': b.user.name} if b.user else {},
        'vehicle': {'name': f"{b.vehicle.make} {b.vehicle.model}"} if b.vehicle else {},
        'pickupDate': b.pickup_date.isoformat() if b.pickup_date else None,
        'dropoffDate': b.dropoff_date.isoformat() if b.dropoff_date else None,
        'status': b.status,
        'pickupLocation': b.pickup_location,
        'dropoffLocation': b.dropoff_location
    } for b in bookings]
    return jsonify(result), 200


@bp.route('/bookings/<int:booking_id>', methods=['GET'])
@role_required('staff', 'admin')
def get_booking(booking_id):
    b = Booking.query.get_or_404(booking_id)
    return jsonify({
        '_id': f'BKG-{b.id:04d}',
        'user': {'name': b.user.name} if b.user else {},
        'vehicle': {'name': f"{b.vehicle.make} {b.vehicle.model}"} if b.vehicle else {},
        'pickupDate': b.pickup_date.isoformat() if b.pickup_date else None,
        'dropoffDate': b.dropoff_date.isoformat() if b.dropoff_date else None,
        'status': b.status,
        'pickupLocation': b.pickup_location,
        'dropoffLocation': b.dropoff_location
    }), 200


@bp.route('/bookings/<int:booking_id>/approve', methods=['PUT'])
@role_required('staff', 'admin')
def approve_booking(booking_id):
    b = Booking.query.get_or_404(booking_id)
    b.status = 'confirmed'
    db.session.commit()
    return jsonify({'message': 'Booking approved'}), 200


@bp.route('/bookings/<int:booking_id>/reject', methods=['PUT'])
@role_required('staff', 'admin')
def reject_booking(booking_id):
    b = Booking.query.get_or_404(booking_id)
    b.status = 'cancelled'
    db.session.commit()
    return jsonify({'message': 'Booking rejected'}), 200


@bp.route('/bookings/<int:booking_id>/checkout', methods=['POST'])
@role_required('staff', 'admin')
def checkout_booking(booking_id):
    data = request.get_json()
    b = Booking.query.get_or_404(booking_id)
    b.status = 'active'
    if b.vehicle:
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
@role_required('staff', 'admin')
def checkin_booking(booking_id):
    data = request.get_json()
    b = Booking.query.get_or_404(booking_id)
    b.status = 'completed'
    if b.vehicle:
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
@role_required('staff', 'admin')
def get_trips():
    trips = Trip.query.all()
    result = [{
        '_id': f'TRP-{t.id:03d}',
        'customer': {'name': t.booking.user.name} if t.booking and t.booking.user else {},
        'vehicle': {'name': f"{t.booking.vehicle.make} {t.booking.vehicle.model}"} if t.booking and t.booking.vehicle else {},
        'pickupLocation': t.pickup_location,
        'dropoffLocation': t.dropoff_location,
        'pickupTime': t.date.isoformat() if t.date else None,
        'status': t.status
    } for t in trips]
    return jsonify(result), 200


@bp.route('/trips/<int:trip_id>/status', methods=['PUT'])
@role_required('staff', 'admin')
def update_trip_status(trip_id):
    data = request.get_json()
    t = Trip.query.get_or_404(trip_id)
    t.status = data.get('status', t.status)
    db.session.commit()
    return jsonify({'message': 'Trip status updated'}), 200


@bp.route('/vehicles/inspection', methods=['GET'])
@role_required('staff', 'admin')
def get_vehicles_for_inspection():
    vehicles = Vehicle.query.filter(Vehicle.status.in_(['available', 'rented'])).all()
    result = [{
        'id': v.id,
        'name': f"{v.make} {v.model}",
        'plate': v.registration_number,
        'status': v.status,
        'condition': '',
        'mileage': '',
        'fuelLevel': '',
        'notes': '',
        'type': 'check-out'
    } for v in vehicles]
    return jsonify(result), 200


@bp.route('/vehicles/<int:vehicle_id>/inspection', methods=['PUT'])
@role_required('staff', 'admin')
def update_vehicle_inspection(vehicle_id):
    data = request.get_json()
    v = Vehicle.query.get_or_404(vehicle_id)
    v.status = data.get('status', v.status)
    db.session.commit()
    return jsonify({'message': 'Vehicle inspection updated'}), 200


@bp.route('/customers', methods=['GET'])
@role_required('staff', 'admin')
def get_customers():
    customers = User.query.filter_by(role='customer').all()
    result = [{
        '_id': f'CUS-{c.id:03d}',
        'name': c.name,
        'email': c.email,
        'phone': c.phone,
        'licenseNumber': c.license_number,
        'totalRentals': len(c.customer_bookings),
        'joined': c.created_at.isoformat()
    } for c in customers]
    return jsonify(result), 200


@bp.route('/driver-assignments', methods=['GET'])
@role_required('staff', 'admin')
def get_driver_requests():
    assignments = DriverAssignment.query.filter_by(status='pending').all()
    result = []
    for a in assignments:
        b = a.booking
        result.append({
            '_id': f'DRQ-{a.id:03d}',
            'bookingId': f'BKG-{b.id:04d}',
            'customer': {'name': b.user.name} if b.user else {},
            'vehicle': {'name': f"{b.vehicle.make} {b.vehicle.model}"} if b.vehicle else {},
            'pickupDate': b.pickup_date.isoformat() if b.pickup_date else None,
            'dropoffDate': b.dropoff_date.isoformat() if b.dropoff_date else None,
            'pickupLocation': b.pickup_location,
            'dropoffLocation': b.dropoff_location,
            'status': a.status,
            'requestedAt': a.assigned_at.isoformat()
        })
    return jsonify(result), 200


@bp.route('/driver-assignments', methods=['POST'])
@role_required('staff', 'admin')
def create_driver_assignment():
    data = request.get_json()
    booking_id = data.get('bookingId')
    driver_id = data.get('driverId')

    if not booking_id or not driver_id:
        return jsonify({'message': 'bookingId and driverId are required'}), 400

    existing = DriverAssignment.query.filter_by(booking_id=booking_id).first()
    if existing:
        return jsonify({'message': 'Driver already assigned to this booking'}), 400

    assignment = DriverAssignment(
        booking_id=booking_id,
        driver_id=driver_id,
        status='assigned'
    )
    db.session.add(assignment)
    db.session.commit()

    booking = Booking.query.get(booking_id)
    driver = User.query.get(driver_id)
    if driver:
        create_notification(driver.id, 'New Assignment', f'You have been assigned to booking #{booking_id}.')
    if booking and booking.user_id:
        create_notification(booking.user_id, 'Driver Assigned', f'A driver has been assigned to your booking #{booking_id}.')

    return jsonify({'message': 'Driver assigned', 'assignment_id': assignment.id}), 201


@bp.route('/reports', methods=['GET'])
@role_required('staff', 'admin')
def get_reports():
    reports = Report.query.all()
    result = [{
        '_id': f'RPT-{r.id:03d}',
        'report_type': r.report_type,
        'period': r.period,
        'data': r.data,
        'created_at': r.created_at.isoformat() if r.created_at else None,
    } for r in reports]
    return jsonify(result), 200


@bp.route('/notifications', methods=['GET'])
@role_required('staff', 'admin')
def get_notifications():
    notifications = Notification.query.all()
    result = [n.to_dict() for n in notifications]
    return jsonify(result), 200


@bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@role_required('staff', 'admin')
def mark_notification_read(notification_id):
    n = Notification.query.get_or_404(notification_id)
    n.read = True
    db.session.commit()
    return jsonify({'message': 'Notification marked as read'}), 200


@bp.route('/vehicles/<int:vehicle_id>/maintenance', methods=['POST'])
@role_required('staff', 'admin')
def flag_maintenance(vehicle_id):
    data = request.get_json() or {}
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    notes = data.get('notes', '')
    vehicle.status = 'maintenance'
    vehicle.is_available = False
    db.session.commit()

    maintenance = Maintenance(
        vehicle_id=vehicle_id,
        reported_by=int(get_jwt_identity()) if token_required else None,
        notes=notes,
        status='pending',
    )
    db.session.add(maintenance)
    db.session.commit()

    admins = User.query.filter_by(role='admin', is_active=True).all()
    for admin in admins:
        create_notification(admin.id, 'Maintenance Required', f'Vehicle {vehicle.make} {vehicle.model} ({vehicle.registration_number}) flagged for maintenance.')

    return jsonify({'message': 'Vehicle flagged for maintenance'}), 201
