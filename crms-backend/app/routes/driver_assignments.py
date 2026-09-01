from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.driver_assignment import DriverAssignment
from app.models.booking import Booking
from app.models.user import User
from app.models.vehicle import Vehicle
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

    except Exception:
        pass


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
            else None
        ),

        'pickupLocation': booking.pickup_location,
        'dropoffLocation': booking.dropoff_location,

        'status': booking.status,

        'drivingOption': booking.driving_option,

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

        'name': getattr(driver, 'name', 'N/A'),

        'phone': getattr(driver, 'phone', None),

        'licenseNumber': (
            getattr(driver, 'license_number', None)
            or getattr(driver, 'licenseNumber', None)
            or 'N/A'
        ),

        'status': (
            getattr(driver, 'status', None)
            or 'available'
        ),

        'role': driver.role
    }


# ============================================================
# GET ALL ASSIGNMENTS
# ============================================================

@bp.route('/', methods=['GET'])
@token_required
def get_driver_assignments():

    current_user_id = int(get_jwt_identity())

    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({
            'message': 'User not found'
        }), 404

    if current_user.role == 'driver':

        assignments = DriverAssignment.query.filter_by(
            driver_id=current_user_id
        ).order_by(
            DriverAssignment.assigned_at.desc()
        ).all()

    else:

        assignments = DriverAssignment.query.order_by(
            DriverAssignment.assigned_at.desc()
        ).all()

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

        # Include the staff member who made the assignment
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

    bookings = Booking.query.order_by(
        Booking.created_at.desc()
    ).all()

    result = []

    for booking in bookings:

        # Only bookings requesting a driver
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

        # Check whether driver has already been assigned
        existing_assignment = DriverAssignment.query.filter_by(
            booking_id=booking.id
        ).first()

        if existing_assignment:
            continue

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
                booking.pickup_date.isoformat()
                if booking.pickup_date
                else None
            ),

            'dropoffDate': (
                booking.dropoff_date.isoformat()
                if booking.dropoff_date
                else None
            ),

            'pickupLocation': booking.pickup_location,

            'dropoffLocation': booking.dropoff_location,

            'status': 'pending',

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

    drivers = User.query.filter_by(
        role='driver'
    ).all()

    result = []

    for driver in drivers:

        status = (
            getattr(driver, 'status', None)
            or 'available'
        )

        if status.lower() != 'available':
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

    # User currently making the assignment
    staff_user_id = int(get_jwt_identity())

    booking_id = data.get('booking_id')
    driver_id = data.get('driver_id')

    if not booking_id or not driver_id:

        return jsonify({
            'message': (
                'booking_id and driver_id are required'
            )
        }), 400

    # --------------------------------------------------------
    # Check booking
    # --------------------------------------------------------

    booking = Booking.query.get(booking_id)

    if not booking:

        return jsonify({
            'message': 'Booking not found'
        }), 404

    # --------------------------------------------------------
    # Check driver
    # --------------------------------------------------------

    driver = User.query.get(driver_id)

    if not driver:

        return jsonify({
            'message': 'Driver not found'
        }), 404

    if driver.role != 'driver':

        return jsonify({
            'message': 'Selected user is not a driver'
        }), 400

    # --------------------------------------------------------
    # Check existing assignment
    # --------------------------------------------------------

    existing = DriverAssignment.query.filter_by(
        booking_id=booking_id
    ).first()

    if existing:

        return jsonify({
            'message': (
                'Driver already assigned to this booking'
            )
        }), 400

    # --------------------------------------------------------
    # Check driver availability
    # --------------------------------------------------------

    driver_status = (
        getattr(driver, 'status', None)
        or 'available'
    )

    if driver_status.lower() != 'available':

        return jsonify({
            'message': 'Driver is not available'
        }), 400

    # --------------------------------------------------------
    # Create assignment
    # --------------------------------------------------------

    assignment = DriverAssignment(
        booking_id=booking_id,
        driver_id=driver_id,
        status='assigned',
        assigned_by_id=staff_user_id
    )

    db.session.add(assignment)

    # --------------------------------------------------------
    # Update booking
    # --------------------------------------------------------

    booking.driver_id = driver_id

    # --------------------------------------------------------
    # Update driver status
    # --------------------------------------------------------

    if hasattr(driver, 'status'):
        driver.status = 'busy'

    # --------------------------------------------------------
    # Notify driver
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
    # Notify customer
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
    # Save
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

        'message': 'Driver assigned successfully',

        'assignment': {
            'id': assignment.id,
            '_id': str(assignment.id),
            'bookingId': booking.id,
            'driverId': driver.id,
            'status': assignment.status,
            'assignedById': assignment.assigned_by_id,
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
def accept_driver_assignment(assignment_id):

    driver_user_id = int(get_jwt_identity())

    # Only the driver who was assigned can accept it
    assignment = DriverAssignment.query.filter_by(
        id=assignment_id,
        driver_id=driver_user_id
    ).first()

    if not assignment:

        return jsonify({
            'message': 'Assignment not found'
        }), 404

    # Assignment must still be waiting for acceptance
    if assignment.status != 'assigned':

        return jsonify({
            'message': (
                f'Assignment cannot be accepted '
                f'because it is already '
                f'{assignment.status}.'
            )
        }), 400

    # --------------------------------------------------------
    # Accept assignment
    # --------------------------------------------------------

    assignment.status = 'accepted'

    # --------------------------------------------------------
    # Notify staff member who assigned the driver
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

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

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