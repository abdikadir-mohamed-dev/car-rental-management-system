from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.driver_assignment import DriverAssignment
from app.models.booking import Booking
from app.models.user import User
from app.models.notification import Notification
from app.utils.auth import token_required, role_required
from flask_jwt_extended import get_jwt_identity


bp = Blueprint(
    'driver_assignments',
    __name__,
    url_prefix='/api/driver-assignments'
)


# ============================================================
# NOTIFICATIONS
# ============================================================

def create_notification(user_id, title, message):
    try:
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message
        )

        db.session.add(notification)

    except Exception as e:
        print(f'Notification creation failed: {e}')


# ============================================================
# HELPERS
# ============================================================

def serialize_booking(booking):
    if not booking:
        return None

    return {
        'id': booking.id,
        '_id': str(booking.id),
        'displayId': f'BKG-{booking.id:04d}',

        'pickupDate': (
            booking.pickup_date.isoformat()
            if booking.pickup_date
            else None
        ),

        'dropoffDate': (
            booking.dropoff_date.isoformat()
            if booking.dropoff_date
            else (
                booking.return_date.isoformat()
                if booking.return_date
                else None
            )
        ),

        'pickupLocation': booking.pickup_location,
        'dropoffLocation': (
            booking.dropoff_location
            or booking.return_location
        ),

        'status': booking.status,

        'drivingOption': (
            booking.driving_option
            or (
                'with_driver'
                if booking.driver_option
                else 'self'
            )
        ),

        'customer': {
            'id': booking.user.id,
            'name': booking.user.name,
            'email': booking.user.email,
            'phone': booking.user.phone
        } if booking.user else {},

        'vehicle': {
            'id': booking.vehicle.id,
            'name': (
                f'{booking.vehicle.make} '
                f'{booking.vehicle.model}'
            ),
            'registrationNumber': (
                booking.vehicle.registration_number
            )
        } if booking.vehicle else {}
    }


def serialize_driver(driver):
    if not driver:
        return None

    return {
        'id': driver.id,
        '_id': str(driver.id),
        'name': driver.name,
        'phone': driver.phone,

        'licenseNumber': (
            driver.license_number
            or 'N/A'
        ),

        'status': 'available',
        'role': driver.role
    }


def get_booking_dates(booking):
    """
    Return the actual rental period used for
    driver scheduling.
    """

    pickup = (
        booking.pickup_date
        if booking
        else None
    )

    dropoff = None

    if booking:
        dropoff = (
            booking.dropoff_date
            or booking.return_date
        )

    return pickup, dropoff


def driver_has_overlapping_assignment(
    driver_id,
    pickup_date,
    dropoff_date,
    exclude_booking_id=None
):
    """
    Check whether this driver already has an
    assignment overlapping the requested booking.

    Date ranges are treated as inclusive because
    the driver is considered occupied for every
    rental day.
    """

    if not pickup_date or not dropoff_date:
        return False

    assignments = DriverAssignment.query.filter(
        DriverAssignment.driver_id == driver_id,
        DriverAssignment.status.in_([
            'assigned',
            'accepted'
        ])
    ).all()

    for assignment in assignments:

        if (
            exclude_booking_id
            and assignment.booking_id == exclude_booking_id
        ):
            continue

        existing_booking = Booking.query.get(
            assignment.booking_id
        )

        if not existing_booking:
            continue

        existing_pickup, existing_dropoff = (
            get_booking_dates(existing_booking)
        )

        if not existing_pickup or not existing_dropoff:
            continue

        # Inclusive date overlap:
        #
        # existing_start <= new_end
        # AND
        # existing_end >= new_start
        #
        if (
            existing_pickup <= dropoff_date
            and existing_dropoff >= pickup_date
        ):
            return True

    return False


# ============================================================
# GET ALL ASSIGNMENTS
# ============================================================

@bp.route('/', methods=['GET'])
@token_required
def get_driver_assignments():

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

    if current_user.role == 'driver':

        assignments = (
            DriverAssignment.query
            .filter_by(driver_id=current_user_id)
            .order_by(
                DriverAssignment.assigned_at.desc()
            )
            .all()
        )

    else:

        assignments = (
            DriverAssignment.query
            .order_by(
                DriverAssignment.assigned_at.desc()
            )
            .all()
        )

    result = []

    for assignment in assignments:

        booking = Booking.query.get(
            assignment.booking_id
        )

        driver = User.query.get(
            assignment.driver_id
        )

        data = assignment.to_dict()

        data['booking'] = serialize_booking(
            booking
        )

        data['driver'] = serialize_driver(
            driver
        )

        if assignment.assigned_by_id:

            assigned_by = User.query.get(
                assignment.assigned_by_id
            )

            data['assignedBy'] = {
                'id': assigned_by.id,
                'name': assigned_by.name,
                'email': assigned_by.email,
                'role': assigned_by.role
            } if assigned_by else None

        else:

            data['assignedBy'] = None

        result.append(data)

    return jsonify(result), 200


# ============================================================
# GET PENDING DRIVER REQUESTS
# ============================================================

@bp.route('/requests', methods=['GET'])
@role_required('staff', 'admin')
def get_driver_requests():

    bookings = (
        Booking.query
        .order_by(Booking.created_at.desc())
        .all()
    )

    result = []

    for booking in bookings:

        if booking.status in ['cancelled', 'completed']:
            continue

        driving_option = (
            booking.driving_option or ''
        ).lower().strip()

        driver_requested = driving_option in [
            'with_driver',
            'with driver',
            'driver',
            'chauffeur',
            'with chauffeur'
        ]

        if not driver_requested:
            continue

        existing_assignment = (
            DriverAssignment.query
            .filter_by(booking_id=booking.id)
            .first()
        )

        if existing_assignment:
            continue

        pickup_date, dropoff_date = (
            get_booking_dates(booking)
        )

        result.append({

            '_id': f'DRQ-{booking.id:04d}',

            'bookingId': (
                f'BKG-{booking.id:04d}'
            ),

            'booking_id': booking.id,

            'customer': {
                'id': booking.user.id,
                'name': booking.user.name
            } if booking.user else {},

            'vehicle': {
                'id': booking.vehicle.id,
                'name': (
                    f'{booking.vehicle.make} '
                    f'{booking.vehicle.model}'
                )
            } if booking.vehicle else {},

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

            'pickupLocation': (
                booking.pickup_location
            ),

            'dropoffLocation': (
                booking.dropoff_location
                or booking.return_location
            ),

            'status': booking.status,

            'requestedAt': (
                booking.created_at.isoformat()
                if booking.created_at
                else None
            )
        })

    return jsonify(result), 200


# ============================================================
# GET AVAILABLE DRIVERS
# ============================================================

@bp.route('/available-drivers', methods=['GET'])
@role_required('staff', 'admin')
def get_available_drivers():

    booking_id = request.args.get(
        'bookingId',
        type=int
    )

    if not booking_id:
        return jsonify({
            'message': (
                'bookingId is required to check '
                'driver availability'
            )
        }), 400

    booking = Booking.query.get(
        booking_id
    )

    if not booking:
        return jsonify({
            'message': 'Booking not found'
        }), 404

    pickup_date, dropoff_date = (
        get_booking_dates(booking)
    )

    if not pickup_date or not dropoff_date:
        return jsonify({
            'message': (
                'Booking does not have valid '
                'pickup and return dates'
            )
        }), 400

    drivers = (
        User.query
        .filter_by(
            role='driver',
            is_active=True
        )
        .order_by(User.name.asc())
        .all()
    )

    result = []

    for driver in drivers:

        # General driver status check.
        #
        # We only reject explicitly inactive/banned
        # statuses. Schedule availability is checked
        # separately below.
        driver_status = (
            getattr(driver, 'status', None)
            or 'available'
        ).lower()

        if driver_status in [
            'inactive',
            'unavailable',
            'suspended'
        ]:
            continue

        # ----------------------------------------------------
        # DATE-SCHEDULE CHECK
        # ----------------------------------------------------

        if driver_has_overlapping_assignment(
            driver.id,
            pickup_date,
            dropoff_date,
            exclude_booking_id=booking.id
        ):
            continue

        result.append(
            serialize_driver(driver)
        )

    return jsonify(result), 200


# ============================================================
# CREATE DRIVER ASSIGNMENT
# ============================================================

@bp.route('/', methods=['POST'])
@role_required('staff', 'admin')
def create_driver_assignment():

    data = request.get_json() or {}

    staff_user_id = int(
        get_jwt_identity()
    )

    # Support both frontend naming styles.
    booking_id = (
        data.get('booking_id')
        or data.get('bookingId')
    )

    driver_id = (
        data.get('driver_id')
        or data.get('driverId')
    )

    if not booking_id or not driver_id:

        return jsonify({
            'message': (
                'booking_id and driver_id are required'
            )
        }), 400

    booking = Booking.query.get(
        int(booking_id)
    )

    if not booking:

        return jsonify({
            'message': 'Booking not found'
        }), 404

    # --------------------------------------------------------
    # A cancelled or completed booking no longer needs a
    # driver — reject the assignment outright.
    # --------------------------------------------------------

    if booking.status in ['cancelled', 'completed']:

        return jsonify({
            'message': (
                f'Cannot assign a driver to a '
                f'{booking.status} booking'
            )
        }), 400

    driver = User.query.get(
        int(driver_id)
    )

    if not driver:

        return jsonify({
            'message': 'Driver not found'
        }), 404

    if driver.role != 'driver':

        return jsonify({
            'message': 'Selected user is not a driver'
        }), 400

    # --------------------------------------------------------
    # Booking must have a valid rental period
    # --------------------------------------------------------

    pickup_date, dropoff_date = (
        get_booking_dates(booking)
    )

    if not pickup_date or not dropoff_date:

        return jsonify({
            'message': (
                'Booking does not have valid '
                'pickup and return dates'
            )
        }), 400

    # --------------------------------------------------------
    # Check existing assignment for this booking
    # --------------------------------------------------------

    existing = (
        DriverAssignment.query
        .filter_by(booking_id=booking.id)
        .first()
    )

    if existing:

        return jsonify({
            'message': (
                'Driver already assigned to '
                'this booking'
            )
        }), 400

    # --------------------------------------------------------
    # Check general driver status
    # --------------------------------------------------------

    driver_status = (
        getattr(driver, 'status', None)
        or 'available'
    ).lower()

    if driver_status in [
        'inactive',
        'unavailable',
        'suspended'
    ]:

        return jsonify({
            'message': (
                'Driver is not available for assignments'
            )
        }), 400

    # --------------------------------------------------------
    # CHECK DRIVER SCHEDULE
    # --------------------------------------------------------

    if driver_has_overlapping_assignment(
        driver.id,
        pickup_date,
        dropoff_date
    ):

        return jsonify({
            'message': (
                'Driver is already assigned to '
                'another booking during these dates'
            )
        }), 400

    # --------------------------------------------------------
    # CREATE ASSIGNMENT
    # --------------------------------------------------------

    assignment = DriverAssignment(
        booking_id=booking.id,
        driver_id=driver.id,
        status='assigned',
        assigned_by_id=staff_user_id
    )

    db.session.add(assignment)

    # --------------------------------------------------------
    # UPDATE BOOKING
    # --------------------------------------------------------

    booking.driver_id = driver.id

    # IMPORTANT:
    #
    # Do NOT set driver.status = 'busy'.
    #
    # Driver availability is date-based and is
    # determined from DriverAssignment + Booking dates.
    #

    # --------------------------------------------------------
    # NOTIFY DRIVER
    # --------------------------------------------------------

    create_notification(
        driver.id,
        'New Assignment',
        (
            f'You have been assigned to '
            f'booking #{booking.id}. '
            f'Please review and accept the assignment.'
        )
    )

    # --------------------------------------------------------
    # NOTIFY CUSTOMER
    # --------------------------------------------------------

    if booking.user_id:

        create_notification(
            booking.user_id,
            'Driver Assigned',
            (
                f'A driver has been assigned '
                f'to your booking #{booking.id}.'
            )
        )

    # --------------------------------------------------------
    # SAVE
    # --------------------------------------------------------

    try:

        db.session.commit()

    except Exception as e:

        db.session.rollback()

        print(
            f'Driver assignment failed: {e}'
        )

        return jsonify({
            'message': (
                'Failed to create driver assignment'
            )
        }), 500

    return jsonify({

        'message': (
            'Driver assigned successfully'
        ),

        'assignment': {
            'id': assignment.id,
            '_id': str(assignment.id),

            'bookingId': booking.id,

            'driverId': driver.id,

            'status': assignment.status,

            'assignedById': (
                assignment.assigned_by_id
            ),

            'assignedAt': (
                assignment.assigned_at.isoformat()
                if assignment.assigned_at
                else None
            )
        },

        'booking': serialize_booking(
            booking
        ),

        'driver': serialize_driver(
            driver
        )

    }), 201


# ============================================================
# DRIVER ACCEPT ASSIGNMENT
# ============================================================

@bp.route(
    '/<int:assignment_id>/accept',
    methods=['PATCH']
)
@role_required('driver')
def accept_driver_assignment(
    assignment_id
):

    driver_user_id = int(
        get_jwt_identity()
    )

    assignment = (
        DriverAssignment.query
        .filter_by(
            id=assignment_id,
            driver_id=driver_user_id
        )
        .first()
    )

    if not assignment:

        return jsonify({
            'message': 'Assignment not found'
        }), 404

    if assignment.status != 'assigned':

        return jsonify({
            'message': (
                f'Assignment cannot be accepted '
                f'because it is already '
                f'{assignment.status}.'
            )
        }), 400

    assignment.status = 'accepted'

    # --------------------------------------------------------
    # Notify staff member
    # --------------------------------------------------------

    if assignment.assigned_by_id:

        driver = User.query.get(
            driver_user_id
        )

        driver_name = (
            driver.name
            if driver
            else 'Driver'
        )

        create_notification(
            assignment.assigned_by_id,
            'Assignment Accepted',
            (
                f'{driver_name} has accepted '
                f'assignment #{assignment.id}.'
            )
        )

    try:

        db.session.commit()

    except Exception as e:

        db.session.rollback()

        print(
            f'Accept assignment failed: {e}'
        )

        return jsonify({
            'message': (
                'Failed to accept assignment'
            )
        }), 500

    return jsonify({
        'message': (
            'Assignment accepted successfully'
        ),
        'assignment': assignment.to_dict()
    }), 200