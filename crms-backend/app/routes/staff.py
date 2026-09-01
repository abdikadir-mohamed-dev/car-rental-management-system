from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
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
from datetime import date
from app.utils.auth import role_required


bp = Blueprint('staff', __name__, url_prefix='/staff')


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
# DASHBOARD
# ============================================================

@bp.route('/dashboard', methods=['GET'])
@role_required('staff', 'admin')
def get_dashboard():
    today = date.today()

    # =========================
    # BOOKING STATISTICS
    # =========================

    today_pickups = Booking.query.filter(
        db.func.date(Booking.pickup_date) == today
    ).count()

    today_returns = Booking.query.filter(
        db.func.date(
            db.func.coalesce(
                Booking.dropoff_date,
                Booking.return_date
            )
        ) == today
    ).count()

    pending_bookings = Booking.query.filter_by(
        status='pending'
    ).count()

    active_rentals = Booking.query.filter(
        Booking.status.in_([
            'confirmed',
            'active',
            'ongoing',
            'rented'
        ])
    ).count()

    # =========================
    # VEHICLE STATISTICS
    # =========================

    available_vehicles = Vehicle.query.filter(
        db.or_(
            Vehicle.status == 'available',
            Vehicle.available == True
        )
    ).count()

    rented_vehicles = Vehicle.query.filter(
        db.or_(
            Vehicle.status.in_([
                'rented',
                'booked',
                'on_rent'
            ]),
            Vehicle.available == False
        )
    ).count()

    maintenance_vehicles = Vehicle.query.filter(
        Vehicle.status.in_([
            'maintenance',
            'under_maintenance'
        ])
    ).count()

    # =========================
    # TODAY'S SCHEDULE
    # =========================

    today_bookings = Booking.query.filter(
        db.or_(
            db.func.date(Booking.pickup_date) == today,
            db.func.date(
                db.func.coalesce(
                    Booking.dropoff_date,
                    Booking.return_date
                )
            ) == today
        )
    ).order_by(
        Booking.pickup_date.asc()
    ).all()

    today_schedule = []

    for booking in today_bookings:

        pickup_is_today = (
            booking.pickup_date
            and booking.pickup_date.date() == today
        )

        return_date = (
            booking.dropoff_date
            or booking.return_date
        )

        return_is_today = (
            return_date
            and return_date.date() == today
        )

        if pickup_is_today:
            action = 'Pickup'
            schedule_time = booking.pickup_date.strftime('%H:%M')

        elif return_is_today:
            action = 'Return'
            schedule_time = return_date.strftime('%H:%M')

        else:
            continue

        customer_name = (
            booking.user.name
            if booking.user
            else 'N/A'
        )

        vehicle_name = (
            f'{booking.vehicle.make} {booking.vehicle.model}'
            if booking.vehicle
            else 'N/A'
        )

        today_schedule.append({
            'time': schedule_time,
            'customer': customer_name,
            'vehicle': vehicle_name,
            'action': action,
            'status': booking.status
        })

    # =========================
    # RECENT / UPCOMING BOOKINGS
    # =========================

    recent_bookings = Booking.query.order_by(
        Booking.created_at.desc()
    ).limit(10).all()

    recent_booking_data = []

    for booking in recent_bookings:

        recent_booking_data.append({
            'id': booking.id,
            '_id': str(booking.id),

            'user': {
                'id': booking.user.id,
                'name': booking.user.name,
                'email': booking.user.email
            } if booking.user else {},

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

            'pickup_date': (
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

            'dropoff_date': (
                booking.dropoff_date.isoformat()
                if booking.dropoff_date
                else (
                    booking.return_date.isoformat()
                    if booking.return_date
                    else None
                )
            ),

            'status': booking.status
        })

    # =========================
    # RESPONSE
    # =========================

    return jsonify({
        'stats': {
            'todayPickups': today_pickups,
            'todayReturns': today_returns,
            'pendingTasks': pending_bookings,
            'activeRentals': active_rentals
        },

        'todaySchedule': today_schedule,

        'vehicleStatus': {
            'available': available_vehicles,
            'rented': rented_vehicles,
            'maintenance': maintenance_vehicles
        },

        'recentBookings': recent_booking_data
    }), 200


# ============================================================
# BOOKINGS
# ============================================================

@bp.route('/bookings', methods=['GET'])
@role_required('staff', 'admin')
def get_bookings():
    status = request.args.get('status')

    query = Booking.query

    if status:
        query = query.filter_by(status=status)

    bookings = query.order_by(
        Booking.created_at.desc()
    ).all()

    result = []

    for b in bookings:
        result.append({
            'id': b.id,
            '_id': str(b.id),
            'displayId': f'BKG-{b.id:04d}',

            'user': {
                'id': b.user.id,
                'name': b.user.name,
                'email': b.user.email,
                'phone': b.user.phone
            } if b.user else {},

            'vehicle': {
                'id': b.vehicle.id,
                'name': f'{b.vehicle.make} {b.vehicle.model}',
                'registrationNumber': b.vehicle.registration_number
            } if b.vehicle else {},

            'pickupDate': (
                b.pickup_date.isoformat()
                if b.pickup_date else None
            ),

            'dropoffDate': (
                b.dropoff_date.isoformat()
                if b.dropoff_date else None
            ),

            'pickupLocation': b.pickup_location,
            'dropoffLocation': b.dropoff_location,

            'drivingOption': b.driving_option,
            'driverId': b.driver_id,

            'totalAmount': b.total_amount,
            'status': b.status,

            'createdAt': (
                b.created_at.isoformat()
                if b.created_at else None
            )
        })

    return jsonify(result), 200


@bp.route('/bookings/pending', methods=['GET'])
@role_required('staff', 'admin')
def get_pending_bookings():

    bookings = Booking.query.filter_by(
        status='pending'
    ).order_by(
        Booking.created_at.desc()
    ).all()

    result = []

    for b in bookings:
        result.append({
            'id': b.id,
            '_id': str(b.id),
            'displayId': f'BKG-{b.id:04d}',

            'user': {
                'id': b.user.id,
                'name': b.user.name,
                'email': b.user.email,
                'phone': b.user.phone
            } if b.user else {},

            'vehicle': {
                'id': b.vehicle.id,
                'name': f'{b.vehicle.make} {b.vehicle.model}',
                'registrationNumber': b.vehicle.registration_number
            } if b.vehicle else {},

            'pickupDate': (
                b.pickup_date.isoformat()
                if b.pickup_date else None
            ),

            'dropoffDate': (
                b.dropoff_date.isoformat()
                if b.dropoff_date else None
            ),

            'pickupLocation': b.pickup_location,
            'dropoffLocation': b.dropoff_location,

            'drivingOption': b.driving_option,
            'driverId': b.driver_id,

            'totalAmount': b.total_amount,
            'status': b.status,

            'createdAt': (
                b.created_at.isoformat()
                if b.created_at else None
            )
        })

    return jsonify(result), 200


@bp.route('/bookings/<int:booking_id>', methods=['GET'])
@role_required('staff', 'admin')
def get_booking(booking_id):

    b = Booking.query.get_or_404(booking_id)

    return jsonify({
        'id': b.id,
        '_id': str(b.id),
        'displayId': f'BKG-{b.id:04d}',

        'user': {
            'id': b.user.id,
            'name': b.user.name,
            'email': b.user.email,
            'phone': b.user.phone
        } if b.user else {},

        'vehicle': {
            'id': b.vehicle.id,
            'name': f'{b.vehicle.make} {b.vehicle.model}',
            'registrationNumber': b.vehicle.registration_number
        } if b.vehicle else {},

        'pickupDate': (
            b.pickup_date.isoformat()
            if b.pickup_date else None
        ),

        'dropoffDate': (
            b.dropoff_date.isoformat()
            if b.dropoff_date else None
        ),

        'pickupLocation': b.pickup_location,
        'dropoffLocation': b.dropoff_location,

        'drivingOption': b.driving_option,
        'driverId': b.driver_id,

        'totalAmount': b.total_amount,
        'status': b.status,

        'createdAt': (
            b.created_at.isoformat()
            if b.created_at else None
        )
    }), 200


@bp.route('/bookings/<int:booking_id>/approve', methods=['PUT'])
@role_required('staff', 'admin')
def approve_booking(booking_id):

    b = Booking.query.get_or_404(booking_id)

    if b.status != 'pending':
        return jsonify({
            'message': 'Only pending bookings can be approved'
        }), 400

    b.status = 'confirmed'

    db.session.commit()

    return jsonify({
        'message': 'Booking approved successfully',
        'booking': b.to_dict()
    }), 200


@bp.route('/bookings/<int:booking_id>/reject', methods=['PUT'])
@role_required('staff', 'admin')
def reject_booking(booking_id):

    b = Booking.query.get_or_404(booking_id)

    if b.status != 'pending':
        return jsonify({
            'message': 'Only pending bookings can be rejected'
        }), 400

    b.status = 'cancelled'

    db.session.commit()

    return jsonify({
        'message': 'Booking rejected successfully',
        'booking': b.to_dict()
    }), 200


# ============================================================
# FLAG VEHICLE FOR MAINTENANCE
# ============================================================

@bp.route('/vehicles/<int:vehicle_id>/maintenance', methods=['POST'])
@role_required('staff', 'admin')
def flag_vehicle_maintenance(vehicle_id):

    vehicle = Vehicle.query.get_or_404(vehicle_id)

    data = request.get_json() or {}

    issue = data.get('issue', '').strip()
    priority = data.get('priority', 'Medium')

    if not issue:
        return jsonify({
            'message': 'Maintenance issue is required'
        }), 400

    if priority not in ['Low', 'Medium', 'High']:
        return jsonify({
            'message': 'Invalid maintenance priority'
        }), 400

    # --------------------------------------------------------
    # Prevent duplicate maintenance requests
    # --------------------------------------------------------

    existing = Maintenance.query.filter(
        Maintenance.vehicle_id == vehicle.id,
        Maintenance.status.in_([
            'Open',
            'In Progress',
            'open',
            'in_progress'
        ])
    ).first()

    if existing:
        return jsonify({
            'message': 'Vehicle already has an active maintenance request'
        }), 400

    # --------------------------------------------------------
    # Create maintenance request
    # --------------------------------------------------------

    maintenance = Maintenance(
        vehicle_id=vehicle.id,
        issue=issue,
        priority=priority,
        status='Open',
        date=date.today().strftime('%b %d')
    )

    db.session.add(maintenance)

    # --------------------------------------------------------
    # Flag vehicle
    # --------------------------------------------------------

    vehicle.status = 'maintenance'
    vehicle.available = False
    vehicle.is_available = False

    # --------------------------------------------------------
    # Save changes
    # --------------------------------------------------------

    try:
        db.session.commit()

    except Exception as e:
        db.session.rollback()

        print(
            f'Maintenance flag failed for vehicle '
            f'{vehicle.id}: {e}'
        )

        return jsonify({
            'message': 'Failed to flag vehicle for maintenance'
        }), 500

    return jsonify({
        'message': 'Vehicle flagged for maintenance successfully',
        'maintenance': maintenance.to_dict(),
        'vehicle': vehicle.to_dict()
    }), 201
# ============================================================
# RELEASE VEHICLE FROM MAINTENANCE
# ============================================================

@bp.route(
    '/vehicles/<int:vehicle_id>/maintenance/release',
    methods=['PUT']
)
@role_required('staff', 'admin')
def release_vehicle_maintenance(vehicle_id):

    vehicle = Vehicle.query.get_or_404(vehicle_id)

    # --------------------------------------------------------
    # Make vehicle available again
    # --------------------------------------------------------

    vehicle.status = 'available'
    vehicle.available = True
    vehicle.is_available = True

    # --------------------------------------------------------
    # Close active maintenance requests
    # --------------------------------------------------------

    active_requests = Maintenance.query.filter(
        Maintenance.vehicle_id == vehicle.id,
        Maintenance.status.in_([
            'Open',
            'In Progress',
            'open',
            'in_progress'
        ])
    ).all()

    for maintenance in active_requests:
        maintenance.status = 'Resolved'

    # --------------------------------------------------------
    # Save changes
    # --------------------------------------------------------

    try:

        db.session.commit()

    except Exception as e:

        db.session.rollback()

        print(
            f'Maintenance release failed for vehicle '
            f'{vehicle.id}: {e}'
        )

        return jsonify({
            'message': 'Failed to release vehicle from maintenance'
        }), 500

    return jsonify({
        'message': 'Vehicle released from maintenance successfully',
        'vehicle': vehicle.to_dict()
    }), 200

            

    

# ============================================================
# CHECK-OUT BOOKING
# ============================================================

@bp.route('/bookings/<int:booking_id>/checkout', methods=['POST'])
@role_required('staff', 'admin')
def checkout_booking(booking_id):

    booking = Booking.query.get_or_404(booking_id)

    # --------------------------------------------------------
    # Only confirmed bookings can be checked out
    # --------------------------------------------------------

    if booking.status != 'confirmed':
        return jsonify({
            'message': (
                'Only confirmed bookings can be checked out'
            )
        }), 400

    vehicle = Vehicle.query.get(booking.vehicle_id)

    if not vehicle:
        return jsonify({
            'message': 'Vehicle not found'
        }), 404

    # --------------------------------------------------------
    # Make sure vehicle is actually available
    # --------------------------------------------------------

    if (
        vehicle.status not in ['available', 'booked']
        and vehicle.available is False
    ):
        return jsonify({
            'message': (
                'Vehicle is not available for check-out'
            )
        }), 400

    data = request.get_json() or {}

    # --------------------------------------------------------
    # Checkout inspection information
    # --------------------------------------------------------

    mileage = data.get('mileage')
    fuel_level = data.get('fuelLevel', 'full')
    condition = data.get('condition', 'good')

    if mileage is None or mileage == 0:
        mileage = vehicle.mileage or 0

    try:
        mileage = int(mileage)
    except (TypeError, ValueError):
        return jsonify({
            'message': 'Invalid mileage'
        }), 400

    if mileage < 0:
        return jsonify({
            'message': 'Mileage cannot be negative'
        }), 400

    current_mileage = vehicle.mileage or 0

    if mileage < current_mileage:
        return jsonify({
            'message': (
                'Checkout mileage cannot be less than '
                'the vehicle current mileage'
            )
        }), 400

    # --------------------------------------------------------
    # Create checkout inspection
    # --------------------------------------------------------

    current_user_id = int(get_jwt_identity())

    checkout_inspection = Inspection(
        booking_id=booking.id,
        vehicle_id=vehicle.id,
        inspector_id=current_user_id,
        type='checkout',
        mileage=mileage,
        fuel_level=fuel_level,
        condition=condition,
        damage_notes='',
        status='completed'
    )

    db.session.add(checkout_inspection)

    # --------------------------------------------------------
    # Update booking
    # --------------------------------------------------------

    booking.status = 'active'

    # --------------------------------------------------------
    # Update vehicle
    # --------------------------------------------------------

    vehicle.mileage = mileage
    vehicle.status = 'rented'
    vehicle.available = False
    vehicle.is_available = False

    # --------------------------------------------------------
    # Notify customer
    # --------------------------------------------------------

    create_notification(
        booking.user_id,
        'Vehicle Checked Out',
        (
            f'Booking #{booking.id} has been checked out '
            f'and your rental is now active.'
        )
    )

    try:
        db.session.commit()

    except Exception as e:
        db.session.rollback()

        print(
            f'Checkout failed for booking '
            f'{booking.id}: {e}'
        )

        return jsonify({
            'message': 'Failed to check out booking'
        }), 500

    return jsonify({
        'message': 'Vehicle checked out successfully',
        'booking': booking.to_dict(),
        'vehicle': vehicle.to_dict(),
        'inspection': checkout_inspection.to_dict()
    }), 200


# ============================================================
# CHECK-IN BOOKING
# ============================================================

@bp.route('/bookings/<int:booking_id>/checkin', methods=['POST'])
@role_required('staff', 'admin')
def checkin_booking(booking_id):

    booking = Booking.query.get_or_404(booking_id)

    # --------------------------------------------------------
    # Only active bookings can be checked in
    # --------------------------------------------------------

    if booking.status != 'active':
        return jsonify({
            'message': (
                'Only active bookings can be checked in'
            )
        }), 400

    vehicle = Vehicle.query.get(booking.vehicle_id)

    if not vehicle:
        return jsonify({
            'message': 'Vehicle not found'
        }), 404

    data = request.get_json() or {}

    # --------------------------------------------------------
    # Check-in inspection information
    # --------------------------------------------------------

    mileage = data.get('mileage')
    fuel_level = data.get('fuelLevel', 'full')
    condition = data.get('condition', 'good')
    damage = data.get('damage', '')

    if mileage is None or mileage == 0:
        mileage = vehicle.mileage or 0

    try:
        mileage = int(mileage)
    except (TypeError, ValueError):
        return jsonify({
            'message': 'Invalid mileage'
        }), 400

    if mileage < 0:
        return jsonify({
            'message': 'Mileage cannot be negative'
        }), 400

    current_mileage = vehicle.mileage or 0

    if mileage < current_mileage:
        return jsonify({
            'message': (
                'Check-in mileage cannot be less than '
                'the vehicle current mileage'
            )
        }), 400

    # --------------------------------------------------------
    # Create check-in inspection
    # --------------------------------------------------------

    current_user_id = int(get_jwt_identity())

    checkin_inspection = Inspection(
        booking_id=booking.id,
        vehicle_id=vehicle.id,
        inspector_id=current_user_id,
        type='checkin',
        mileage=mileage,
        fuel_level=fuel_level,
        condition=condition,
        damage_notes=damage,
        status='completed'
    )

    db.session.add(checkin_inspection)

    # --------------------------------------------------------
    # Complete booking
    # --------------------------------------------------------

    booking.status = 'completed'

    # --------------------------------------------------------
    # Update vehicle
    # --------------------------------------------------------

    vehicle.mileage = mileage

    # --------------------------------------------------------
    # DAMAGE FOUND
    #
    # The vehicle is NOT made available.
    # Instead, create a maintenance request for the admin.
    # --------------------------------------------------------

    if damage and damage.strip():

        vehicle.status = 'maintenance'
        vehicle.available = False
        vehicle.is_available = False

        # Check whether an open maintenance request
        # already exists for this vehicle.

        existing_maintenance = Maintenance.query.filter_by(
            vehicle_id=vehicle.id,
            status='Open'
        ).first()

        if not existing_maintenance:

            maintenance = Maintenance(
                vehicle_id=vehicle.id,
                issue=damage.strip(),
                priority='Medium',
                status='Open',
                date=date.today().strftime('%b %d')
            )

            db.session.add(maintenance)

    # --------------------------------------------------------
    # NO DAMAGE
    #
    # Vehicle can return to the available fleet.
    # --------------------------------------------------------

    else:

        vehicle.status = 'available'
        vehicle.available = True
        vehicle.is_available = True

    # --------------------------------------------------------
    # Notify customer
    # --------------------------------------------------------

    create_notification(
        booking.user_id,
        'Vehicle Checked In',
        (
            f'Booking #{booking.id} has been checked in '
            f'and your rental has been completed.'
        )
    )

    try:
        db.session.commit()

    except Exception as e:
        db.session.rollback()

        print(
            f'Check-in failed for booking '
            f'{booking.id}: {e}'
        )

        return jsonify({
            'message': 'Failed to check in booking'
        }), 500

    return jsonify({
        'message': 'Vehicle checked in successfully',
        'booking': booking.to_dict(),
        'vehicle': vehicle.to_dict(),
        'inspection': checkin_inspection.to_dict()
    }), 200
# ============================================================
# CUSTOMERS
# ============================================================

@bp.route('/customers', methods=['GET'])
@role_required('staff', 'admin')
def get_customers():

    customers = User.query.filter_by(
        role='customer'
    ).order_by(
        User.created_at.desc()
    ).all()

    result = []

    for customer in customers:
        result.append({
            'id': customer.id,
            '_id': str(customer.id),
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone,
            'driversLicense': customer.drivers_license,
            'licenseExpiry': customer.license_expiry,
            'country': customer.country,
            'profilePhoto': customer.profile_photo,
            'isActive': customer.is_active,
            'createdAt': (
                customer.created_at.isoformat()
                if customer.created_at
                else None
            )
        })

    return jsonify(result), 200