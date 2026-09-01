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


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_policy_value(key, default=None):
    policy = RentalPolicy.query.filter_by(key=key).first()
    return policy.value if policy else default


def create_notification(user_id, title, message):
    try:
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message
        )
        db.session.add(notification)
    except Exception:
        pass


def parse_iso_datetime(value):
    if isinstance(value, str):
        value = value.replace('Z', '+00:00')
        dt = datetime.fromisoformat(value)
        return dt.replace(tzinfo=None)

    return value


# ============================================================
# GET ALL BOOKINGS
# ============================================================

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

    # Customers only see their own bookings
    if current_user.role == 'customer':
        query = query.filter_by(user_id=current_user_id)

    bookings = (
        query
        .order_by(Booking.created_at.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )

    result = []

    for b in bookings:
        data = b.to_dict()

        # Vehicle information
        vehicle = Vehicle.query.get(b.vehicle_id)

        if vehicle:
            data['vehicle'] = vehicle.to_dict()
        else:
            data['vehicle'] = None

        # Customer information
        if b.user:
            data['customer'] = {
                'id': str(b.user.id),
                'name': b.user.name,
                'email': b.user.email,
                'phone': b.user.phone,
            }
        else:
            data['customer'] = None

        # Payment status
        data['paymentStatus'] = 'pending'

        payment = (
            Payment.query
            .filter_by(booking_id=b.id)
            .order_by(Payment.created_at.desc())
            .first()
        )

        if payment:
            data['paymentStatus'] = payment.status

        result.append(data)

    return jsonify({
        'bookings': result
    }), 200


# ============================================================
# GET SINGLE BOOKING
# ============================================================

@bp.route('/<int:booking_id>', methods=['GET'])
@token_required
def get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)

    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    # Customers can only access their own booking
    if (
        current_user.role == 'customer'
        and booking.user_id != current_user_id
    ):
        return jsonify({
            'message': 'Access denied'
        }), 403

    data = booking.to_dict()

    # Payment status
    data['paymentStatus'] = 'pending'

    payment = (
        Payment.query
        .filter_by(booking_id=booking_id)
        .order_by(Payment.created_at.desc())
        .first()
    )

    if payment:
        data['paymentStatus'] = payment.status

    # Vehicle information
    vehicle = Vehicle.query.get(booking.vehicle_id)

    data['vehicle'] = (
        vehicle.to_dict()
        if vehicle
        else None
    )

    # Customer information
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

    data['customer'] = customer

    return jsonify({
        'booking': data
    }), 200


# ============================================================
# CREATE BOOKING
# ============================================================

@bp.route('/', methods=['POST'])
@token_required
def create_booking():
    data = request.get_json() or {}

    vehicle_id = data.get('vehicleId')
    pickup_date = data.get('pickupDate')

    dropoff_date = (
        data.get('returnDate')
        or data.get('dropoffDate')
    )

    pickup_location = data.get('pickupLocation')

    dropoff_location = (
        data.get('returnLocation')
        or data.get('dropoffLocation')
    )

    total_amount = data.get('totalAmount')
    special_requests = data.get('specialRequests')

    driving_option = data.get(
        'drivingOption',
        'self'
    )

    driver_id = data.get('driverId')

    # ========================================================
    # REQUIRED FIELDS
    # ========================================================

    required_fields = [
        vehicle_id,
        pickup_date,
        dropoff_date,
        pickup_location,
        dropoff_location,
        total_amount
    ]

    if not all(required_fields):
        return jsonify({
            'message': 'Missing required fields'
        }), 400

    # ========================================================
    # VALIDATE VEHICLE ID / AMOUNT
    # ========================================================

    try:
        vehicle_id = int(vehicle_id)
        total_amount = float(total_amount)

    except (TypeError, ValueError):
        return jsonify({
            'message': 'Invalid vehicle ID or total amount'
        }), 400

    if total_amount <= 0:
        return jsonify({
            'message': 'Total amount must be greater than zero'
        }), 400

    # ========================================================
    # GET VEHICLE
    # ========================================================

    vehicle = Vehicle.query.get(vehicle_id)

    if not vehicle:
        return jsonify({
            'available': False,
            'message': 'Vehicle not found'
        }), 404

    # ========================================================
    # VEHICLE AVAILABILITY / MAINTENANCE CHECK
    # ========================================================

    if (
        not vehicle.is_available
        or not vehicle.available
        or vehicle.status == 'maintenance'
    ):
        return jsonify({
            'available': False,
            'message': 'Vehicle is currently unavailable'
        }), 404

    # ========================================================
    # PARSE DATES
    # ========================================================

    try:
        pickup = parse_iso_datetime(
            pickup_date
        )

        dropoff = parse_iso_datetime(
            dropoff_date
        )

    except (ValueError, TypeError):
        return jsonify({
            'message': 'Invalid pickup or return date'
        }), 400

    # ========================================================
    # DATE VALIDATION
    # ========================================================

    now = datetime.utcnow()

    if pickup < now:
        return jsonify({
            'message': 'Pickup date/time cannot be in the past'
        }), 400

    if dropoff <= pickup:
        return jsonify({
            'message': 'Return date must be after pickup date'
        }), 400

    duration_hours = (
        dropoff - pickup
    ).total_seconds() / 3600

    # ========================================================
    # RENTAL DURATION POLICY
    # ========================================================

    minimum_days = float(
        get_policy_value(
            'minimumRentalDuration',
            1
        )
    )

    maximum_days = float(
        get_policy_value(
            'maximumRentalDuration',
            30
        )
    )

    min_duration = minimum_days * 24
    max_duration = maximum_days * 24

    if duration_hours < min_duration:
        return jsonify({
            'message': (
                f'Minimum rental duration is '
                f'{minimum_days:g} day(s)'
            )
        }), 400

    if duration_hours > max_duration:
        return jsonify({
            'message': (
                f'Maximum rental duration is '
                f'{maximum_days:g} day(s)'
            )
        }), 400

    # ========================================================
    # CHECK VEHICLE BOOKING CONFLICTS
    # ========================================================

    conflict = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status.in_([
            'pending',
            'confirmed',
            'active'
        ]),
        Booking.pickup_date < dropoff,
        Booking.dropoff_date > pickup
    ).first()

    if conflict:
        return jsonify({
            'message': (
                'Vehicle is already booked '
                'for the selected dates'
            )
        }), 409

    current_user_id = int(
        get_jwt_identity()
    )

    # ========================================================
    # DRIVER VALIDATION
    # ========================================================

    if driving_option == 'hire':

        if not driver_id:
            return jsonify({
                'message': (
                    'driverId is required when '
                    'booking with a driver'
                )
            }), 400

        try:
            driver_id = int(driver_id)

        except (TypeError, ValueError):
            return jsonify({
                'message': 'Invalid driver ID'
            }), 400

        driver = User.query.filter_by(
            id=driver_id,
            role='driver',
            is_active=True
        ).first()

        if not driver:
            return jsonify({
                'message': 'Driver not found or unavailable'
            }), 404

    else:
        driver_id = None

    # ========================================================
    # CREATE BOOKING
    # ========================================================

    booking = Booking(
        user_id=current_user_id,
        vehicle_id=vehicle_id,
        pickup_location=pickup_location,
        dropoff_location=dropoff_location,
        pickup_date=pickup,
        dropoff_date=dropoff,
        total_amount=total_amount,
        special_requests=special_requests,
        driving_option=driving_option,
        driver_id=driver_id,
        status='pending'
    )

    db.session.add(booking)
    db.session.flush()

    # ========================================================
    # DRIVER ASSIGNMENT
    # ========================================================

    if driving_option == 'hire':

        assignment = DriverAssignment(
            booking_id=booking.id,
            driver_id=driver_id,
            status='pending'
        )

        db.session.add(assignment)

    current_user = User.query.get(
        current_user_id
    )

    # ========================================================
    # NOTIFY STAFF
    # ========================================================

    staff_users = User.query.filter_by(
        role='staff',
        is_active=True
    ).all()

    for staff in staff_users:
        create_notification(
            staff.id,
            'New Booking',
            f'New booking #{booking.id} '
            f'created by {current_user.name}.'
        )

    # ========================================================
    # NOTIFY CUSTOMER
    # ========================================================

    create_notification(
        booking.user_id,
        'Booking Submitted',
        f'Your booking #{booking.id} '
        f'has been submitted and is awaiting confirmation.'
    )

    db.session.commit()

    # ========================================================
    # RESPONSE
    # ========================================================

    booking_data = booking.to_dict()

    vehicle = Vehicle.query.get(
        booking.vehicle_id
    )

    booking_data['vehicle'] = (
        vehicle.to_dict()
        if vehicle
        else None
    )

    booking_data['paymentStatus'] = 'pending'

    return jsonify({
        'booking': booking_data
    }), 201


# ============================================================
# UPDATE BOOKING
# ============================================================

@bp.route('/<int:booking_id>', methods=['PUT'])
@token_required
def update_booking(booking_id):
    booking = Booking.query.get_or_404(
        booking_id
    )

    current_user_id = int(
        get_jwt_identity()
    )

    current_user = User.query.get(
        current_user_id
    )

    # Customer can only edit their own booking
    if current_user.role == 'customer':

        if booking.user_id != current_user_id:
            return jsonify({
                'message': 'Access denied'
            }), 403

    # Completed/cancelled bookings cannot be modified
    if booking.status in [
        'completed',
        'cancelled'
    ]:
        return jsonify({
            'message': (
                'Cannot modify a completed '
                'or cancelled booking'
            )
        }), 400

    data = request.get_json() or {}

    new_pickup = data.get(
        'pickupDate'
    )

    new_dropoff = (
        data.get('returnDate')
        or data.get('dropoffDate')
    )

    # ========================================================
    # UPDATE DATES
    # ========================================================

    if new_pickup or new_dropoff:

        pickup = (
            parse_iso_datetime(new_pickup)
            if new_pickup
            else booking.pickup_date
        )

        dropoff = (
            parse_iso_datetime(new_dropoff)
            if new_dropoff
            else booking.dropoff_date
        )

        now = datetime.utcnow()

        if pickup < now:
            return jsonify({
                'message': (
                    'Pickup date/time '
                    'cannot be in the past'
                )
            }), 400

        if dropoff <= pickup:
            return jsonify({
                'message': (
                    'Return date must be '
                    'after pickup date'
                )
            }), 400

        # Check conflicts
        conflict = Booking.query.filter(
            Booking.vehicle_id == booking.vehicle_id,
            Booking.id != booking_id,
            Booking.status.in_([
                'pending',
                'confirmed',
                'active'
            ]),
            Booking.pickup_date < dropoff,
            Booking.dropoff_date > pickup
        ).first()

        if conflict:
            return jsonify({
                'message': (
                    'Vehicle is already booked '
                    'for the selected dates'
                )
            }), 409

        booking.pickup_date = pickup
        booking.dropoff_date = dropoff

    # ========================================================
    # EDITABLE FIELDS
    # ========================================================

    editable_fields = {
        'pickupLocation': 'pickup_location',
        'dropoffLocation': 'dropoff_location',
        'specialRequests': 'special_requests'
    }

    for request_field, model_field in editable_fields.items():

        if request_field in data:
            setattr(
                booking,
                model_field,
                data[request_field]
            )

    # ========================================================
    # STAFF / ADMIN FIELDS
    # ========================================================

    if current_user.role in [
        'admin',
        'staff'
    ]:

        # ----------------------------------------------------
        # TOTAL AMOUNT
        # ----------------------------------------------------

        if 'totalAmount' in data:

            try:
                amount = float(
                    data['totalAmount']
                )

                if amount <= 0:
                    return jsonify({
                        'message': (
                            'Total amount must '
                            'be greater than zero'
                        )
                    }), 400

                booking.total_amount = amount

            except (TypeError, ValueError):

                return jsonify({
                    'message': 'Invalid total amount'
                }), 400

        # ----------------------------------------------------
        # DRIVING OPTION
        # ----------------------------------------------------

        if 'drivingOption' in data:

            booking.driving_option = data[
                'drivingOption'
            ]

        # ----------------------------------------------------
        # DRIVER
        # ----------------------------------------------------

        if 'driverId' in data:

            driver_id = data['driverId']

            if driver_id:

                try:
                    driver_id = int(
                        driver_id
                    )

                except (TypeError, ValueError):

                    return jsonify({
                        'message': 'Invalid driver ID'
                    }), 400

                driver = User.query.filter_by(
                    id=driver_id,
                    role='driver',
                    is_active=True
                ).first()

                if not driver:
                    return jsonify({
                        'message': (
                            'Driver not found '
                            'or unavailable'
                        )
                    }), 404

            booking.driver_id = driver_id

    db.session.commit()

    # ========================================================
    # RESPONSE
    # ========================================================

    booking_data = booking.to_dict()

    vehicle = Vehicle.query.get(
        booking.vehicle_id
    )

    booking_data['vehicle'] = (
        vehicle.to_dict()
        if vehicle
        else None
    )

    return jsonify({
        'booking': booking_data
    }), 200


# ============================================================
# UPDATE BOOKING STATUS
# STAFF / ADMIN ONLY
# ============================================================

@bp.route('/<int:booking_id>', methods=['PATCH'])
@role_required('staff', 'admin')
def update_booking_status(booking_id):

    booking = Booking.query.get_or_404(
        booking_id
    )

    data = request.get_json() or {}

    status = data.get('status')

    allowed_statuses = [
        'pending',
        'confirmed',
        'active',
        'completed',
        'cancelled'
    ]

    if status not in allowed_statuses:
        return jsonify({
            'message': 'Invalid booking status'
        }), 400

    booking.status = status

    db.session.commit()

    booking_data = booking.to_dict()

    vehicle = Vehicle.query.get(
        booking.vehicle_id
    )

    booking_data['vehicle'] = (
        vehicle.to_dict()
        if vehicle
        else None
    )

    # ========================================================
    # NOTIFY CUSTOMER
    # ========================================================

    status_messages = {
        'confirmed': (
            'Your booking has been confirmed.'
        ),
        'active': (
            'Your rental is now active.'
        ),
        'completed': (
            'Your rental has been completed.'
        ),
        'cancelled': (
            'Your booking has been cancelled.'
        )
    }

    if status in status_messages:

        create_notification(
            booking.user_id,
            'Booking Status Updated',
            f'Booking #{booking.id}: '
            f'{status_messages[status]}'
        )

        db.session.commit()

    return jsonify({
        'booking': booking_data
    }), 200


# ============================================================
# CANCEL BOOKING
# ============================================================

@bp.route('/<int:booking_id>', methods=['DELETE'])
@token_required
def cancel_booking(booking_id):

    booking = Booking.query.get_or_404(
        booking_id
    )

    current_user_id = int(
        get_jwt_identity()
    )

    current_user = User.query.get(
        current_user_id
    )

    # Customers can only cancel their own bookings
    if current_user.role == 'customer':

        if booking.user_id != current_user_id:
            return jsonify({
                'message': 'Access denied'
            }), 403

    if booking.status in [
        'completed',
        'cancelled'
    ]:
        return jsonify({
            'message': 'Booking cannot be cancelled'
        }), 400

    pickup = booking.pickup_date
    now = datetime.utcnow()

    hours_until = (
        pickup - now
    ).total_seconds() / 3600

    cancellation_window = float(
        get_policy_value(
            'cancellationWindow',
            48
        )
    )

    cancellation_percentage = float(
        get_policy_value(
            'cancellationFeePercentage',
            50
        )
    )

    if hours_until < cancellation_window:

        cancellation_fee = (
            booking.total_amount
            * cancellation_percentage
            / 100
        )

    else:
        cancellation_fee = 0

    booking.status = 'cancelled'

    booking.cancellation_fee = (
        cancellation_fee
    )

    booking.refund_amount = (
        booking.total_amount
        - cancellation_fee
    )

    data = request.get_json(
        silent=True
    ) or {}

    booking.cancellation_reason = data.get(
        'cancellationReason',
        ''
    )

    db.session.commit()

    create_notification(
        booking.user_id,
        'Booking Cancelled',
        f'Your booking #{booking.id} '
        f'has been cancelled.'
    )

    db.session.commit()

    return jsonify({
        'message': (
            'Booking cancelled successfully'
        ),
        'refundAmount': booking.refund_amount,
        'cancellationFee': cancellation_fee
    }), 200


# ============================================================
# CHECK VEHICLE AVAILABILITY
# ============================================================

@bp.route('/availability', methods=['GET'])
def check_availability():

    vehicle_id = request.args.get(
        'vehicleId',
        type=int
    )

    pickup_date = request.args.get(
        'pickupDate'
    )

    dropoff_date = request.args.get(
        'returnDate'
    )

    # ========================================================
    # VALIDATE PARAMETERS
    # ========================================================

    if not all([
        vehicle_id,
        pickup_date,
        dropoff_date
    ]):
        return jsonify({
            'available': False,
            'message': 'Missing parameters'
        }), 400

    # ========================================================
    # GET VEHICLE
    # ========================================================

    vehicle = Vehicle.query.get(
        vehicle_id
    )

    # ========================================================
    # VEHICLE AVAILABILITY / MAINTENANCE CHECK
    # ========================================================

    if (
        not vehicle
        or not vehicle.is_available
        or not vehicle.available
        or vehicle.status == 'maintenance'
    ):
        return jsonify({
            'available': False,
            'message': 'Vehicle is currently unavailable'
        }), 404

    # ========================================================
    # PARSE DATES
    # ========================================================

    try:
        pickup = parse_iso_datetime(
            pickup_date
        )

        dropoff = parse_iso_datetime(
            dropoff_date
        )

    except (ValueError, TypeError):

        return jsonify({
            'available': False,
            'message': 'Invalid dates'
        }), 400

    # ========================================================
    # DATE VALIDATION
    # ========================================================

    now = datetime.utcnow()

    if pickup < now or dropoff <= pickup:

        return jsonify({
            'available': False,
            'message': 'Invalid dates'
        }), 400

    # ========================================================
    # CHECK BOOKING CONFLICTS
    # ========================================================

    conflict = Booking.query.filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status.in_([
            'pending',
            'confirmed',
            'active'
        ]),
        Booking.pickup_date < dropoff,
        Booking.dropoff_date > pickup
    ).first()

    if conflict:

        return jsonify({
            'available': False,
            'message': (
                'Vehicle is already booked '
                'for the selected dates'
            )
        }), 409

    # ========================================================
    # VEHICLE IS AVAILABLE
    # ========================================================

    return jsonify({
        'available': True,
        'message': (
            'Vehicle is available '
            'for the selected dates'
        )
    }), 200