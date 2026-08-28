from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Driver, Trip, Vehicle, Customer, Earning, Payment, Booking, Maintenance
from datetime import datetime
from app.utils.auth import token_required, role_required

bp = Blueprint('driver', __name__, url_prefix='/api/driver')


@bp.route('/drivers', methods=['GET'])
def list_drivers():
    drivers = Driver.query.filter_by(status='available').all()
    result = []
    for d in drivers:
        data = d.to_dict()
        data['image'] = d.user.profile_photo
        result.append(data)
    return jsonify(result), 200


def get_current_driver_id():
    from flask_jwt_extended import get_jwt_identity
    user_id = int(get_jwt_identity())
    driver = Driver.query.filter_by(user_id=user_id).first()
    return driver.id if driver else None


@bp.route('/dashboard', methods=['GET'])
@role_required('driver')
def get_dashboard():
    driver_id = get_current_driver_id()
    today = datetime.utcnow().date()

    trips_today = Trip.query.filter_by(driver_id=driver_id).filter(Trip.date == today).count()
    upcoming = Trip.query.filter_by(driver_id=driver_id, status='upcoming').count()
    completed = Trip.query.filter_by(driver_id=driver_id, status='completed').count()

    earnings = db.session.query(db.func.sum(Earning.amount)).filter(
        Earning.driver_id == driver_id,
        Earning.date == today
    ).scalar() or 0

    return jsonify({
        'trips_today': trips_today,
        'upcoming': upcoming,
        'completed': completed,
        'total_earnings': earnings
    }), 200


@bp.route('/assignments', methods=['GET'])
@role_required('driver')
def get_assignments():
    driver_id = get_current_driver_id()
    status = request.args.get('status', 'all')

    query = Trip.query.filter_by(driver_id=driver_id)
    if status != 'all':
        query = query.filter_by(status=status.lower())

    trips = query.order_by(Trip.created_at.desc()).all()
    return jsonify([trip.to_dict() for trip in trips]), 200


@bp.route('/trips', methods=['GET'])
@role_required('driver')
def get_trips():
    driver_id = get_current_driver_id()
    trips = Trip.query.filter_by(driver_id=driver_id).order_by(Trip.date.desc()).all()
    return jsonify([trip.to_dict() for trip in trips]), 200


@bp.route('/trips/<int:trip_id>', methods=['GET'])
@role_required('driver')
def get_trip(trip_id):
    trip = Trip.query.get_or_404(trip_id)
    return jsonify(trip.to_dict()), 200


@bp.route('/trips/<int:trip_id>/status', methods=['PATCH'])
@role_required('driver')
def update_trip_status(trip_id):
    trip = Trip.query.get_or_404(trip_id)
    data = request.get_json()
    trip.status = data.get('status', trip.status)
    db.session.commit()
    return jsonify(trip.to_dict()), 200


@bp.route('/earnings', methods=['GET'])
@role_required('driver')
def get_earnings():
    driver_id = get_current_driver_id()
    earnings = Earning.query.filter_by(driver_id=driver_id).order_by(Earning.date.desc()).all()
    return jsonify([e.to_dict() for e in earnings]), 200


@bp.route('/earnings/summary', methods=['GET'])
@role_required('driver')
def get_earnings_summary():
    driver_id = get_current_driver_id()
    period = request.args.get('period', 'month')

    total = db.session.query(db.func.sum(Earning.amount)).filter_by(driver_id=driver_id).scalar() or 0
    trips = Trip.query.filter_by(driver_id=driver_id, status='completed').count()
    avg = total / trips if trips > 0 else 0

    return jsonify({
        'total': total,
        'trips': trips,
        'avg': avg,
        'period': period
    }), 200


@bp.route('/bookings', methods=['GET'])
@role_required('driver')
def get_bookings():
    driver_id = get_current_driver_id()
    trips = Trip.query.filter_by(driver_id=driver_id).all()
    trip_ids = [t.id for t in trips]
    bookings = Booking.query.filter(Booking.trip_id.in_(trip_ids)).all() if trip_ids else []
    return jsonify([b.to_dict() for b in bookings]), 200


@bp.route('/bookings/<int:booking_id>', methods=['GET'])
@role_required('driver')
def get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    return jsonify(booking.to_dict()), 200


@bp.route('/vehicles', methods=['GET'])
@role_required('driver')
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([v.to_dict() for v in vehicles]), 200


@bp.route('/vehicles/<int:vehicle_id>', methods=['GET'])
@role_required('driver')
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    return jsonify(vehicle.to_dict()), 200


@bp.route('/customers', methods=['GET'])
@role_required('driver')
def get_customers():
    customers = Customer.query.all()
    return jsonify([c.to_dict() for c in customers]), 200


@bp.route('/maintenance', methods=['GET'])
@role_required('driver')
def get_maintenance():
    vehicle_id = request.args.get('vehicle_id')
    query = Maintenance.query
    if vehicle_id:
        query = query.filter_by(vehicle_id=vehicle_id)
    requests = query.order_by(Maintenance.created_at.desc()).all()
    return jsonify([m.to_dict() for m in requests]), 200


@bp.route('/maintenance', methods=['POST'])
@role_required('driver')
def create_maintenance():
    data = request.get_json()
    maintenance = Maintenance(
        vehicle_id=data.get('vehicle_id'),
        issue=data.get('issue'),
        priority=data.get('priority', 'Medium'),
        status='Open',
        date=data.get('date', datetime.utcnow().strftime('%b %d'))
    )
    db.session.add(maintenance)
    db.session.commit()
    return jsonify(maintenance.to_dict()), 201


@bp.route('/reports', methods=['GET'])
@role_required('driver')
def get_reports():
    driver_id = get_current_driver_id()
    period = request.args.get('period', '30d')

    completed = Trip.query.filter_by(driver_id=driver_id, status='completed').count()
    return jsonify({
        'period': period,
        'trips_completed': completed,
        'on_time_rate': 94,
        'avg_rating': 4.8
    }), 200


@bp.route('/notifications', methods=['GET'])
@role_required('driver')
def get_notifications():
    from flask_jwt_extended import get_jwt_identity
    user_id = int(get_jwt_identity())
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications]), 200


@bp.route('/notifications/<int:notification_id>/read', methods=['PATCH'])
@role_required('driver')
def mark_notification_read(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    notification.read = True
    db.session.commit()
    return jsonify(notification.to_dict()), 200


@bp.route('/notifications/read-all', methods=['PATCH'])
@role_required('driver')
def mark_all_notifications_read():
    from flask_jwt_extended import get_jwt_identity
    user_id = int(get_jwt_identity())
    Notification.query.filter_by(user_id=user_id, read=False).update({'read': True})
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read'}), 200


@bp.route('/payments', methods=['GET'])
@role_required('driver')
def get_payments():
    driver_id = get_current_driver_id()
    payments = Payment.query.filter_by(driver_id=driver_id).order_by(Payment.date.desc()).all()
    return jsonify([p.to_dict() for p in payments]), 200
