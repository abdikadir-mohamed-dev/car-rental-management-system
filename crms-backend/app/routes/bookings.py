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


def add_booking_details(booking):
    """
    Add related vehicle, customer and payment information
    to a booking response.
    """

    data = booking.to_dict()

    # --------------------------------------------------------
    # VEHICLE
    # --------------------------------------------------------

    vehicle = Vehicle.query.get(booking.vehicle_id)

    data['vehicle'] = (
        vehicle.to_dict()
        if vehicle
        else None
    )

    # --------------------------------------------------------
    # CUSTOMER
    # --------------------------------------------------------

    if booking.user:
        data['customer'] = {
            'id': str(booking.user.id),
            'name': booking.user.name,
            'email': booking.user.email,
            'phone': booking.user.phone,
        }
    else:
        data['customer'] = None

    # --------------------------------------------------------
    # PAYMENT
    # --------------------------------------------------------

    payment = (
        Payment.query
        .filter_by(booking_id=booking.id)
        .order_by(Payment.created_at.desc())
        .first()
    )

    if payment:
        data['paymentStatus'] = payment.status
        data['paymentMethod'] = payment.method
        data['paymentId'] = payment.id
        data['paymentAmount'] = payment.amount
    else:
        data['paymentStatus'] = 'pending'
        data['paymentMethod'] = None
        data['paymentId'] = None
        data['paymentAmount'] = None

    return data


# ============================================================
# GET ALL BOOKINGS
# ============================================================

@bp.route('/', methods=['GET'])
@token_required
def get_bookings():

    status = request.args.get('status')

    page = int(
        request.args.get('page', 1)
    )

    limit = int(
        request.args.get('limit', 20)
    )

    offset = (page - 1) * limit

    current_user_id = int(
        get_jwt_identity()
    )

    current_user = User.query.get(
        current_user_id
    )

    query = Booking.query

    # --------------------------------------------------------
    # STATUS FILTER
    # --------------------------------------------------------

    if status:
        query = query.filter_by(
            status=status
        )

    # --------------------------------------------------------
    # CUSTOMER ACCESS
    # --------------------------------------------------------

    if current_user.role == 'customer':
        query = query.filter_by(
            user_id=current_user_id
        )

    # --------------------------------------------------------
    # GET BOOKINGS
    # --------------------------------------------------------

    bookings = (
        query
        .order_by(
            Booking.created_at.desc()
        )
        .limit(limit)
        .offset(offset)
        .all()
    )

    result = []

    for booking in bookings:

        data = add_booking_details(
            booking
        )

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

    booking = Booking.query.get_or_404(
        booking_id
    )

    current_user_id = int(
        get_jwt_identity()
    )

    current_user = User.query.get(
        current_user_id
    )

    # --------------------------------------------------------
    # CUSTOMER ACCESS
    # --------------------------------------------------------

    if (
        current_user.role == 'customer'
        and booking.user_id != current_user_id
    ):
        return jsonify({
            'message': 'Access denied'
        }), 403

    data = add_booking_details(
        booking
    )

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

    vehicle_id = data.get(
        'vehicleId'
    )

    pickup_date = data.get(
        'pickupDate'
    )

    dropoff_date = (
        data.get('returnDate')
        or data.get('dropoffDate')
    )

    pickup_location = data.get(
        'pickupLocation'
    )

    dropoff_location = (
        data.get('returnLocation')
        or data.get('dropoffLocation')
    )

    total_amount = data.get(
        'totalAmount'
    )

    special_requests = data.get(
        'specialRequests'
    )

    driving_option = data.get(
        'drivingOption',
        'self'
    )

    # --------------------------------------------------------
    # IMPORTANT:
    #
    # Customer DOES NOT select a driver.
    #
    # driverId may exist in old frontend requests, but we
    # deliberately ignore it for customer bookings.
    #
    # Staff will assign the driver later.
    # --------------------------------------------------------

    driver_id = None

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

        vehicle_id = int(
            vehicle_id
        )

        total_amount = float(
            total_amount
        )

    except (TypeError, ValueError):

        return jsonify({
            'message': (
                'Invalid vehicle ID '
                'or total amount'
            )
        }), 400

    if total_amount <= 0:

        return jsonify({
            'message': (
                'Total amount must be '
                'greater than zero'
            )
        }), 400

    # ========================================================
    # NORMALIZE DRIVING OPTION
    # ========================================================

    if driving_option in [
        'hire',
        'with_driver'
    ]:

        driving_option = 'with_driver'

    else:

        driving_option = 'self'

    # ========================================================
    # GET VEHICLE
    # ========================================================

    vehicle = Vehicle.query.get(
        vehicle_id
    )

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
        or str(vehicle.status).lower()
        == 'maintenance'
    ):

        return jsonify({
            'available': False,
            'message': (
                'Vehicle is currently '
                'unavailable'
            )
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
            'message': (
                'Invalid pickup '
                'or return date'
            )
        }), 400

    # ========================================================
    # DATE VALIDATION
    # ========================================================

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

    min_duration = (
        minimum_days * 24
    )

    max_duration = (
        maximum_days * 24
    )

    if duration_hours < min_duration:

        return jsonify({
            'message': (
                f'Minimum rental duration '
                f'is {minimum_days:g} day(s)'
            )
        }), 400

    if duration_hours > max_duration:

        return jsonify({
            'message': (
                f'Maximum rental duration '
                f'is {maximum_days:g} day(s)'
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

    # ========================================================
    # CURRENT USER
    # ========================================================

    current_user_id = int(
        get_jwt_identity()
    )

    current_user = User.query.get(
        current_user_id
    )

    if not current_user:

        return jsonify({
            'message': 'User not found'
        }), 404

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

        # IMPORTANT:
        # Customer does not choose driver.
        driver_id=None,

        status='pending'
    )

    db.session.add(
        booking
    )

    db.session.flush()

    # ========================================================
    # DRIVER ASSIGNMENT
    # ========================================================
    #
    # We DO NOT assign a driver here.
    #
    # If customer requested a driver:
    #
    #     driving_option = with_driver
    #
    # Staff will later choose an available driver
    # through the driver assignment endpoint.
    #
    # Therefore we intentionally do NOT create a
    # DriverAssignment here because there is no driver_id yet.
    #
    # ========================================================

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
            (
                f'New booking #{booking.id} '
                f'created by '
                f'{current_user.name}.'
            )
        )

    # ========================================================
    # NOTIFY CUSTOMER
    # ========================================================

    create_notification(
        booking.user_id,
        'Booking Submitted',
        (
            f'Your booking #{booking.id} '
            f'has been submitted and is '
            f'awaiting confirmation.'
        )
    )

    db.session.commit()

    # ========================================================
    # RESPONSE
    # ========================================================

    booking_data = add_booking_details(
        booking
    )

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

    # --------------------------------------------------------
    # CUSTOMER ACCESS
    # --------------------------------------------------------

    if current_user.role == 'customer':

        if booking.user_id != current_user_id:

            return jsonify({
                'message': 'Access denied'
            }), 403

    # --------------------------------------------------------
    # COMPLETED / CANCELLED
    # --------------------------------------------------------

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

        # ----------------------------------------------------
        # CHECK CONFLICTS
        # ----------------------------------------------------

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
    # CUSTOMER EDITABLE FIELDS
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
                    'message': (
                        'Invalid total amount'
                    )
                }), 400

        # ----------------------------------------------------
        # DRIVING OPTION
        # ----------------------------------------------------

        if 'drivingOption' in data:

            driving_option = data[
                'drivingOption'
            ]

            if driving_option in [
                'hire',
                'with_driver'
            ]:

                booking.driving_option = (
                    'with_driver'
                )

            else:

                booking.driving_option = 'self'

        # ----------------------------------------------------
        # DRIVER
        # ----------------------------------------------------
        #
        # ONLY STAFF / ADMIN can assign a driver.
        #
        # Customer cannot do this.
        #
        # ----------------------------------------------------

        if 'driverId' in data:

            driver_id = data[
                'driverId'
            ]

            if driver_id:

                try:

                    driver_id = int(
                        driver_id
                    )

                except (TypeError, ValueError):

                    return jsonify({
                        'message': (
                            'Invalid driver ID'
                        )
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

        else:

            # Keep existing driver assignment
            # if staff/admin didn't send driverId.
            pass

    db.session.commit()

    booking_data = add_booking_details(
        booking
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

    status = data.get(
        'status'
    )

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

    booking_data = add_booking_details(
        booking
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
            (
                f'Booking #{booking.id}: '
                f'{status_messages[status]}'
            )
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

    # ========================================================
    # CUSTOMER ACCESS
    # ========================================================

    if current_user.role == 'customer':

        if booking.user_id != current_user_id:

            return jsonify({
                'message': 'Access denied'
            }), 403

    # ========================================================
    # BOOKING STATUS
    # ========================================================

    if booking.status in [
        'completed',
        'cancelled',
        'active'
    ]:

        return jsonify({
            'message': (
                'Booking cannot be cancelled'
            )
        }), 400

    # ========================================================
    # CANCELLATION POLICY
    # ========================================================
    #
    # BUSINESS RULE:
    #
    # More than 24 hours before pickup:
    #     Cancellation allowed
    #     Fee = 0%
    #
    # Within 24 hours of pickup:
    #     Cancellation allowed
    #     Fee = 10%
    #
    # This matches the agreed customer policy.
    #
    # ========================================================

    pickup = booking.pickup_date

    now = datetime.utcnow()

    hours_until = (
        pickup - now
    ).total_seconds() / 3600

    cancellation_window = 24

    cancellation_percentage = 10

    if hours_until < 0:

        return jsonify({
            'message': (
                'This booking can no longer '
                'be cancelled because the '
                'pickup time has passed.'
            )
        }), 400

    if hours_until <= cancellation_window:

        cancellation_fee = (
            booking.total_amount
            * cancellation_percentage
            / 100
        )

    else:

        cancellation_fee = 0

    # ========================================================
    # REFUND
    # ========================================================
    #
    # If the customer already paid (a completed payment exists
    # for this booking), the amount above the cancellation fee
    # is refunded: mark that payment 'refunded'. Pending/failed
    # payments are left alone — nothing was collected, so there
    # is nothing to refund.
    # ========================================================

    refund_amount = (
        booking.total_amount
        - cancellation_fee
    )

    paid_payment = (
        Payment.query
        .filter_by(booking_id=booking.id, status='completed')
        .order_by(Payment.created_at.desc())
        .first()
    )

    if paid_payment:
        paid_payment.status = 'refunded'

    # ========================================================
    # CANCELLATION REASON
    # ========================================================

    data = request.get_json(
        silent=True
    ) or {}

    booking.cancellation_reason = data.get(
        'cancellationReason',
        ''
    )

    booking.status = 'cancelled'

    booking.cancellation_fee = (
        cancellation_fee
    )

    booking.refund_amount = (
        refund_amount
    )

    db.session.commit()

    if paid_payment:
        create_notification(
            booking.user_id,
            'Refund Processed',
            (
                f'A refund of KES {refund_amount:.0f} for booking '
                f'#{booking.id} has been processed'
                + (
                    f' (KES {cancellation_fee:.0f} cancellation fee applied).'
                    if cancellation_fee
                    else '.'
                )
            )
        )

    # ========================================================
    # NOTIFY CUSTOMER
    # ========================================================

    create_notification(
        booking.user_id,
        'Booking Cancelled',
        (
            f'Your booking #{booking.id} '
            f'has been cancelled.'
        )
    )

    db.session.commit()

    return jsonify({
        'message': (
            'Booking cancelled successfully'
        ),
        'refundAmount': refund_amount,
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
    # VEHICLE AVAILABILITY / MAINTENANCE
    # ========================================================

    if (
        not vehicle
        or not vehicle.is_available
        or not vehicle.available
        or str(vehicle.status).lower()
        == 'maintenance'
    ):

        return jsonify({
            'available': False,
            'message': (
                'Vehicle is currently '
                'unavailable'
            )
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
    # VEHICLE AVAILABLE
    # ========================================================

    return jsonify({
        'available': True,
        'message': (
            'Vehicle is available '
            'for the selected dates'
        )
    }), 200