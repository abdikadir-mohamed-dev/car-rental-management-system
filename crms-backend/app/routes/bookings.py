from flask import Blueprint, jsonify, request
from datetime import datetime
from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app.models.payment import Payment
from app.models.policy import RentalPolicy
from app.models.user import User
from app.models.notification import Notification
from app.models.driver_assignment import DriverAssignment
from app import db
from app.utils.auth import token_required, role_required
from flask_jwt_extended import get_jwt_identity

bp = Blueprint('bookings', __name__, url_prefix='/api/bookings')


def get_policy_value(key, default=None):
    policy = RentalPolicy.query.filter_by(key=key).first()
    return policy.value if policy else default


def create_notification(user_id, title, message):
    try:
        notification = Notification(user_id=user_id, title=title, message=message)
        db.session.add(notification)
    except Exception:
        pass


def parse_iso_datetime(value):
    if isinstance(value, str):
        value = value.replace('Z', '+00:00')
        dt = datetime.fromisoformat(value)
        return dt.replace(tzinfo=None)
    return value


@bp.route('/', methods=['GET'])
@token_required
def get_bookings():
    status = request.args.get('status')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    offset = (page - 1) * limit

    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    query = Booking.query
    if status:
        query = query.filter_by(status=status)

    if current_user.role == 'customer':
        query = query.filter_by(user_id=current_user_id)

    query = query.order_by(Booking.created_at.desc()).limit(limit).offset(offset)
    bookings = query.all()
    result = []
    for b in bookings:
        data = b.to_dict()
        data['paymentStatus'] = 'pending'
        payment = Payment.query.filter_by(booking_id=b.id).order_by(Payment.created_at.desc()).first()
        if payment:
            data['paymentStatus'] = payment.status
        result.append(data)
    return jsonify({'bookings': result}), 200


@bp.route('/<int:booking_id>', methods=['GET'])
@token_required
def get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if current_user.role == 'customer' and booking.user_id != current_user_id:
        return jsonify({'message': 'Access denied'}), 403

    data = booking.to_dict()
    data['paymentStatus'] = 'pending'
    payment = Payment.query.filter_by(booking_id=booking_id).order_by(Payment.created_at.desc()).first()
    if payment:
        data['paymentStatus'] = payment.status
    vehicle = Vehicle.query.get(booking.vehicle_id)
    customer = None
    if booking.user_id:
        customer_row = User.query.get(booking.user_id)
        if customer_row:
            customer = {
                'id': str(customer_row.id),
                'name': customer_row.name,
                'email': customer_row.email,
                'phone': customer_row.phone,
            }
    data['vehicle'] = vehicle.to_dict() if vehicle else None
    data['customer'] = customer
    return jsonify({'booking': data}), 200


@bp.route('/', methods=['POST'])
@token_required
def create_booking():
    data = request.get_json() or {}
    vehicle_id = data.get('vehicleId')
    pickup_date = data.get('pickupDate')
    dropoff_date = data.get('returnDate') or data.get('dropoffDate')
    pickup_location = data.get('pickupLocation')
    dropoff_location = data.get('returnLocation') or data.get('dropoffLocation')
    total_amount = data.get('totalAmount')
    special_requests = data.get('specialRequests')
    driving_option = data.get('drivingOption', 'self')
    driver_id = data.get('driverId')

    if not all([vehicle_id, pickup_date, dropoff_date, pickup_location, dropoff_location, total_amount]):
        return jsonify({'message': 'Missing required fields'}), 400

    vehicle = Vehicle.query.get(int(vehicle_id))
    if not vehicle:
        return jsonify({'message': 'Vehicle not found'}), 404

    if not vehicle.is_available:
        return jsonify({'message': 'Vehicle is not available for booking'}), 400

    pickup = parse_iso_datetime(pickup_date)
    dropoff = parse_iso_datetime(dropoff_date)

    now = datetime.utcnow()
    if pickup < now or dropoff <= pickup:
        return jsonify({'message': 'Pickup date/time cannot be in the past'}), 400

    duration_hours = (dropoff - pickup).total_seconds() / 3600
    min_duration = float(get_policy_value('minimumRentalDuration', 1)) * 24
    max_duration = float(get_policy_value('maximumRentalDuration', 30)) * 24
    if duration_hours < min_duration:
        return jsonify({'message': f'Minimum rental duration is {get_policy_value("minimumRentalDuration", 1)} day(s)'}), 400
    if duration_hours > max_duration:
        return jsonify({'message': f'Maximum rental duration is {get_policy_value("maximumRentalDuration", 30)} day(s)'}), 400

    conflict = Booking.query.filter(
        Booking.vehicle_id == int(vehicle_id),
        Booking.status.in_(['pending', 'confirmed', 'active']),
        Booking.pickup_date < dropoff,
        Booking.dropoff_date > pickup,
    ).first()
    if conflict:
        return jsonify({'message': 'Vehicle is already booked for the selected dates'}), 400

    booking = Booking(
        user_id=int(get_jwt_identity()),
        vehicle_id=int(vehicle_id),
        pickup_location=pickup_location,
        dropoff_location=dropoff_location,
        pickup_date=pickup,
        dropoff_date=dropoff,
        total_amount=float(total_amount),
        special_requests=special_requests,
        driving_option=driving_option,
        driver_id=int(driver_id) if driver_id else None,
        status='pending',
    )
    db.session.add(booking)
    db.session.flush()

    if driving_option == 'with_driver' and driver_id:
        assignment = DriverAssignment(booking_id=booking.id, driver_id=int(driver_id), status='pending')
        db.session.add(assignment)

    staff_users = User.query.filter_by(role='staff', is_active=True).all()
    for staff in staff_users:
        create_notification(staff.id, 'New Booking', f'New booking #{booking.id} created by {booking.user.name}.')

    db.session.commit()
    return jsonify({'booking': booking.to_dict()}), 201


@bp.route('/<int:booking_id>', methods=['PUT'])
@token_required
def update_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if current_user.role == 'customer' and booking.user_id != current_user_id:
        return jsonify({'message': 'Access denied'}), 403

    if booking.status in ['completed', 'cancelled']:
        return jsonify({'message': 'Cannot modify a completed or cancelled booking'}), 400

    data = request.get_json() or {}
    new_pickup = data.get('pickupDate')
    new_dropoff = data.get('returnDate') or data.get('dropoffDate')

    if new_pickup or new_dropoff:
        pickup = parse_iso_datetime(new_pickup) if new_pickup else booking.pickup_date
        dropoff = parse_iso_datetime(new_dropoff) if new_dropoff else booking.dropoff_date
        now = datetime.utcnow()
        if pickup < now:
            return jsonify({'message': 'Pickup date/time cannot be in the past'}), 400
        if dropoff <= pickup:
            return jsonify({'message': 'Return date must be after pickup date'}), 400

        conflict = Booking.query.filter(
            Booking.vehicle_id == booking.vehicle_id,
            Booking.id != booking_id,
            Booking.status.in_(['pending', 'confirmed', 'active']),
            Booking.pickup_date < dropoff,
            Booking.dropoff_date > pickup,
        ).first()
        if conflict:
            return jsonify({'message': 'Vehicle is already booked for the selected dates'}), 400

    fields = ['pickup_location', 'dropoff_location', 'pickup_date', 'dropoff_date',
              'total_amount', 'special_requests', 'cancellation_reason', 'cancellation_fee',
              'refund_amount', 'driving_option', 'driver_id', 'status']
    for field in fields:
        if field in data:
            if field in ['pickup_date', 'dropoff_date']:
                val = data[field].replace('Z', '+00:00') if isinstance(data[field], str) else data[field]
                setattr(booking, field, parse_iso_datetime(val))
            else:
                setattr(booking, field, data[field])
    db.session.commit()
    return jsonify({'booking': booking.to_dict()}), 200


@bp.route('/<int:booking_id>', methods=['PATCH'])
@token_required
def update_booking_status(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if current_user.role == 'customer' and booking.user_id != current_user_id:
        return jsonify({'message': 'Access denied'}), 403

    data = request.get_json() or {}
    status = data.get('status')
    if status:
        booking.status = status
    db.session.commit()
    return jsonify({'booking': booking.to_dict()}), 200


@bp.route('/<int:booking_id>', methods=['DELETE'])
@token_required
def cancel_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if current_user.role == 'customer' and booking.user_id != current_user_id:
        return jsonify({'message': 'Access denied'}), 403

    if booking.status in ['completed', 'cancelled']:
        return jsonify({'message': 'Booking cannot be cancelled'}), 400

    pickup = booking.pickup_date
    now = datetime.utcnow()
    hours_until = (pickup - now).total_seconds() / 3600
    cancellation_fee = booking.total_amount * 0.5 if hours_until < 48 else 0
    booking.status = 'cancelled'
    booking.cancellation_fee = cancellation_fee
    booking.refund_amount = booking.total_amount - cancellation_fee
    data = request.get_json(silent=True) or {}
    booking.cancellation_reason = data.get('cancellationReason', '')
    db.session.commit()
    return jsonify({
        'message': 'Booking cancelled successfully',
        'refundAmount': booking.refund_amount,
        'cancellationFee': cancellation_fee,
    }), 200


@bp.route('/availability', methods=['GET'])
def check_availability():
    vehicle_id = request.args.get('vehicleId', type=int)
    pickup_date = request.args.get('pickupDate')
    dropoff_date = request.args.get('returnDate')

    if not all([vehicle_id, pickup_date, dropoff_date]):
        return jsonify({'available': False, 'message': 'Missing parameters'}), 400

    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle or not vehicle.is_available:
        return jsonify({'available': False, 'message': 'Vehicle not available'}), 404

    pickup = parse_iso_datetime(pickup_date)
    dropoff = parse_iso_datetime(dropoff_date)

    now = datetime.utcnow()
    if pickup < now or dropoff <= pickup:
        return jsonify({'available': False, 'message': 'Invalid dates'}), 400

    conflict = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status.in_(['pending', 'confirmed', 'active']),
        Booking.pickup_date < dropoff,
        Booking.dropoff_date > pickup,
    ).first()
    if conflict:
        return jsonify({'available': False, 'message': 'Vehicle is already booked for the selected dates'}), 409

    return jsonify({'available': True, 'message': 'Vehicle is available for the selected dates'}), 200
