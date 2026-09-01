from flask import Blueprint, request, jsonify
from datetime import datetime

from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models import (
    Driver,
    Trip,
    Booking,
    Notification
)
from app.utils.auth import role_required


bp = Blueprint(
    'driver',
    __name__,
    url_prefix='/api/driver'
)


# ============================================================
# HELPERS
# ============================================================

def get_current_driver():
    """
    Get the Driver profile belonging to the currently
    authenticated User.
    """

    user_id = int(get_jwt_identity())

    return Driver.query.filter_by(
        user_id=user_id
    ).first()


def get_current_driver_id():
    driver = get_current_driver()

    return driver.id if driver else None


# ============================================================
# SERIALIZE CUSTOMER
# ============================================================

def serialize_customer(booking):
    """
    Customer information comes from Booking.user.
    """

    if not booking or not booking.user:
        return None

    user = booking.user

    return {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone
    }


# ============================================================
# SERIALIZE VEHICLE
# ============================================================

def serialize_vehicle(booking):
    """
    Vehicle information comes from Booking.vehicle.
    """

    if not booking or not booking.vehicle:
        return None

    vehicle = booking.vehicle

    return {
        'id': vehicle.id,
        'name': (
            vehicle.name
            or f'{vehicle.make} {vehicle.model}'
        ),
        'make': vehicle.make,
        'model': vehicle.model,
        'registrationNumber': vehicle.registration_number
    }


# ============================================================
# SERIALIZE BOOKING FOR DRIVER
# ============================================================

def serialize_driver_booking(booking):
    """
    Converts a real Booking into the format needed
    by the Driver frontend.

    The booking status comes directly from the database.
    """

    if not booking:
        return None

    pickup_date = (
        booking.pickup_date.isoformat()
        if booking.pickup_date
        else None
    )

    dropoff_date = (
        booking.dropoff_date.isoformat()
        if booking.dropoff_date
        else (
            booking.return_date.isoformat()
            if booking.return_date
            else None
        )
    )

    return {
        'id': booking.id,

        '_id': str(booking.id),

        'displayId': (
            f'BKG-{booking.id:04d}'
        ),

        'customerId': booking.user_id,

        'vehicleId': booking.vehicle_id,

        'driverId': booking.driver_id,

        'customer': serialize_customer(
            booking
        ),

        'vehicle': serialize_vehicle(
            booking
        ),

        'pickupLocation': booking.pickup_location,

        'dropoffLocation': (
            booking.dropoff_location
            or booking.return_location
        ),

        'pickupDate': pickup_date,

        'dropoffDate': dropoff_date,

        'returnDate': dropoff_date,

        'drivingOption': (
            booking.driving_option
            or (
                'with_driver'
                if booking.driver_option
                else 'self'
            )
        ),

        'specialRequests': booking.special_requests,

        'totalAmount': (
            booking.total_amount_customer
            if booking.total_amount_customer is not None
            else booking.total_amount
        ),

        # IMPORTANT:
        # Always return the real database status.
        'status': booking.status,

        'createdAt': (
            booking.created_at.isoformat()
            if booking.created_at
            else None
        ),

        'updatedAt': (
            booking.updated_at.isoformat()
            if booking.updated_at
            else None
        )
    }


# ============================================================
# SERIALIZE TRIP FROM BOOKING
# ============================================================

def serialize_trip_from_booking(
    booking,
    assignment=None
):
    """
    A driver's trip is based on the real Booking.

    IMPORTANT:
    Trip status is derived from booking.status.

    This prevents a trip that was already started from
    becoming "upcoming" again when the driver leaves the
    page and returns.

    Database is the single source of truth.
    """

    if not booking:
        return None

    pickup_date = booking.pickup_date

    dropoff_date = (
        booking.dropoff_date
        or booking.return_date
    )

    # --------------------------------------------------------
    # Determine trip status from REAL booking status
    # --------------------------------------------------------

    booking_status = (
        booking.status or 'pending'
    ).lower()

    if booking_status in [
        'active',
        'in_progress'
    ]:
        trip_status = 'active'

    elif booking_status == 'completed':
        trip_status = 'completed'

    elif booking_status in [
        'cancelled',
        'rejected'
    ]:
        trip_status = 'cancelled'

    elif booking_status in [
        'pending',
        'confirmed',
        'approved',
        'assigned',
        'upcoming'
    ]:
        trip_status = 'upcoming'

    else:
        trip_status = 'upcoming'

    return {
        'id': booking.trip_id or booking.id,

        '_id': (
            f'TRP-{booking.id:04d}'
        ),

        'bookingId': booking.id,

        'booking': serialize_driver_booking(
            booking
        ),

        'customerId': booking.user_id,

        'vehicleId': booking.vehicle_id,

        'driverId': booking.driver_id,

        'customer': serialize_customer(
            booking
        ),

        'vehicle': serialize_vehicle(
            booking
        ),

        'pickupLocation': booking.pickup_location,

        'dropoffLocation': (
            booking.dropoff_location
            or booking.return_location
        ),

        'pickupDate': (
            pickup_date.isoformat()
            if pickup_date
            else None
        ),

        'dropoffDate': (
            dropoff_date.isoformat()
            if dropoff_date
            else None
        ),

        'date': (
            pickup_date.date().isoformat()
            if pickup_date
            else None
        ),

        'time': (
            pickup_date.strftime('%H:%M')
            if pickup_date
            else None
        ),

        'fare': (
            booking.total_amount_customer
            if booking.total_amount_customer is not None
            else booking.total_amount
        ),

        # Real persisted trip status
        'status': trip_status,

        # Assignment status is kept separate from trip status
        'assignmentStatus': (
            assignment.status
            if assignment
            else None
        ),

        'createdAt': (
            booking.created_at.isoformat()
            if booking.created_at
            else None
        )
    }


# ============================================================
# AVAILABLE DRIVERS
# ============================================================

@bp.route('/drivers', methods=['GET'])
@role_required('driver')
def list_drivers():

    drivers = Driver.query.filter_by(
        status='available'
    ).all()

    result = []

    for driver in drivers:

        data = driver.to_dict()

        data['image'] = (
            driver.user.profile_photo
            if driver.user
            else None
        )

        result.append(data)

    return jsonify(result), 200


# ============================================================
# DRIVER DASHBOARD
# ============================================================

@bp.route('/dashboard', methods=['GET'])
@role_required('driver')
def get_dashboard():

    driver = get_current_driver()

    if not driver:
        return jsonify({
            'message': 'Driver profile not found'
        }), 404

    today = datetime.utcnow().date()

    # --------------------------------------------------------
    # Get real bookings assigned to this driver
    # --------------------------------------------------------

    bookings = Booking.query.filter_by(
        driver_id=driver.user_id
    ).all()

    trips_today = 0
    upcoming = 0
    completed = 0

    for booking in bookings:

        if booking.pickup_date:
            if booking.pickup_date.date() == today:
                trips_today += 1

        status = (
            booking.status or ''
        ).lower()

        if status in [
            'pending',
            'confirmed',
            'approved',
            'assigned',
            'upcoming'
        ]:
            upcoming += 1

        if status == 'completed':
            completed += 1

    return jsonify({
        'trips_today': trips_today,
        'upcoming': upcoming,
        'completed': completed
    }), 200


# ============================================================
# DRIVER ASSIGNMENTS / TRIPS
#
# These come from REAL DRIVER ASSIGNMENTS.
# ============================================================

@bp.route('/assignments', methods=['GET'])
@role_required('driver')
def get_assignments():

    from app.models.driver_assignment import DriverAssignment

    user_id = int(get_jwt_identity())

    assignments = DriverAssignment.query.filter_by(
        driver_id=user_id
    ).order_by(
        DriverAssignment.assigned_at.desc()
    ).all()

    result = []

    for assignment in assignments:

        booking = Booking.query.get(
            assignment.booking_id
        )

        if not booking:
            continue

        result.append(
            serialize_trip_from_booking(
                booking,
                assignment
            )
        )

    return jsonify(result), 200


# ============================================================
# TRIPS
#
# GET /api/driver/trips
#
# REAL BOOKINGS ASSIGNED TO DRIVER
# ============================================================

@bp.route('/trips', methods=['GET'])
@role_required('driver')
def get_trips():

    user_id = int(get_jwt_identity())

    bookings = Booking.query.filter_by(
        driver_id=user_id
    ).order_by(
        Booking.pickup_date.asc()
    ).all()

    result = []

    for booking in bookings:

        result.append(
            serialize_trip_from_booking(
                booking
            )
        )

    return jsonify(result), 200


# ============================================================
# GET SINGLE TRIP
# ============================================================

@bp.route('/trips/<int:trip_id>', methods=['GET'])
@role_required('driver')
def get_trip(trip_id):

    user_id = int(get_jwt_identity())

    # --------------------------------------------------------
    # First try the real Trip record
    # --------------------------------------------------------

    trip = Trip.query.get(trip_id)

    if trip:

        booking = Booking.query.filter_by(
            id=trip.booking.id
            if trip.booking
            else None
        ).first()

        if booking and booking.driver_id == user_id:

            return jsonify(
                serialize_trip_from_booking(
                    booking
                )
            ), 200

    # --------------------------------------------------------
    # Otherwise treat ID as Booking ID
    # --------------------------------------------------------

    booking = Booking.query.filter_by(
        id=trip_id,
        driver_id=user_id
    ).first()

    if not booking:

        return jsonify({
            'message': 'Trip not found'
        }), 404

    return jsonify(
        serialize_trip_from_booking(
            booking
        )
    ), 200


# ============================================================
# UPDATE TRIP STATUS
# ============================================================

@bp.route(
    '/trips/<int:trip_id>/status',
    methods=['PATCH']
)
@role_required('driver')
def update_trip_status(trip_id):

    user_id = int(get_jwt_identity())

    booking = Booking.query.filter_by(
        id=trip_id,
        driver_id=user_id
    ).first()

    if not booking:

        return jsonify({
            'message': 'Trip not found'
        }), 404

    data = request.get_json() or {}

    status = (
        data.get('status') or ''
    ).lower()

    allowed_statuses = [
        'upcoming',
        'active',
        'in_progress',
        'completed',
        'cancelled'
    ]

    if status not in allowed_statuses:

        return jsonify({
            'message': 'Invalid trip status'
        }), 400

    # --------------------------------------------------------
    # Normalize trip status
    # --------------------------------------------------------

    if status == 'in_progress':
        booking.status = 'active'
    else:
        booking.status = status

    # --------------------------------------------------------
    # Update driver availability
    #
    # Active trip = driver busy
    # Completed/cancelled = driver available
    # --------------------------------------------------------

    driver = Driver.query.filter_by(
        user_id=user_id
    ).first()

    if driver:

        if status in [
            'active',
            'in_progress'
        ]:
            driver.status = 'busy'

        elif status in [
            'completed',
            'cancelled'
        ]:
            driver.status = 'available'

    db.session.commit()

    return jsonify(
        serialize_driver_booking(
            booking
        )
    ), 200


# ============================================================
# BOOKINGS
#
# REAL BOOKINGS ASSIGNED TO DRIVER
# ============================================================

@bp.route('/bookings', methods=['GET'])
@role_required('driver')
def get_bookings():

    user_id = int(get_jwt_identity())

    bookings = Booking.query.filter_by(
        driver_id=user_id
    ).order_by(
        Booking.created_at.desc()
    ).all()

    return jsonify([
        serialize_driver_booking(
            booking
        )
        for booking in bookings
    ]), 200


# ============================================================
# SINGLE BOOKING
# ============================================================

@bp.route(
    '/bookings/<int:booking_id>',
    methods=['GET']
)
@role_required('driver')
def get_booking(booking_id):

    user_id = int(get_jwt_identity())

    booking = Booking.query.filter_by(
        id=booking_id,
        driver_id=user_id
    ).first()

    if not booking:

        return jsonify({
            'message': 'Booking not found'
        }), 404

    return jsonify(
        serialize_driver_booking(
            booking
        )
    ), 200


# ============================================================
# NOTIFICATIONS
# ============================================================

@bp.route('/notifications', methods=['GET'])
@role_required('driver')
def get_notifications():

    user_id = int(
        get_jwt_identity()
    )

    notifications = Notification.query.filter_by(
        user_id=user_id
    ).order_by(
        Notification.created_at.desc()
    ).all()

    return jsonify([
        notification.to_dict()
        for notification in notifications
    ]), 200


# ============================================================
# MARK NOTIFICATION AS READ
# ============================================================

@bp.route(
    '/notifications/<int:notification_id>/read',
    methods=['PATCH']
)
@role_required('driver')
def mark_notification_read(
    notification_id
):

    user_id = int(
        get_jwt_identity()
    )

    notification = Notification.query.filter_by(
        id=notification_id,
        user_id=user_id
    ).first()

    if not notification:

        return jsonify({
            'message': 'Notification not found'
        }), 404

    notification.read = True

    db.session.commit()

    return jsonify(
        notification.to_dict()
    ), 200


# ============================================================
# MARK ALL NOTIFICATIONS AS READ
# ============================================================

@bp.route(
    '/notifications/read-all',
    methods=['PATCH']
)
@role_required('driver')
def mark_all_notifications_read():

    user_id = int(
        get_jwt_identity()
    )

    Notification.query.filter_by(
        user_id=user_id,
        read=False
    ).update({
        'read': True
    })

    db.session.commit()

    return jsonify({
        'message': 'All notifications marked as read'
    }), 200