from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.driver_assignment import DriverAssignment
from app.models.booking import Booking
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.notification import Notification
from app.utils.auth import token_required, role_required
from flask_jwt_extended import get_jwt_identity

bp = Blueprint('driver_assignments', __name__, url_prefix='/api/driver-assignments')


def create_notification(user_id, title, message):
    try:
        notification = Notification(user_id=user_id, title=title, message=message)
        db.session.add(notification)
    except Exception:
        pass


@bp.route('/', methods=['GET'])
@token_required
def get_driver_assignments():
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if current_user.role == 'driver':
        assignments = DriverAssignment.query.filter_by(driver_id=current_user_id).all()
    else:
        assignments = DriverAssignment.query.all()

    result = []
    for a in assignments:
        data = a.to_dict()
        booking = Booking.query.get(a.booking_id)
        if booking:
            data['booking'] = {
                'id': booking.id,
                'pickupDate': booking.pickup_date.isoformat() if booking.pickup_date else None,
                'dropoffDate': booking.dropoff_date.isoformat() if booking.dropoff_date else None,
                'pickupLocation': booking.pickup_location,
                'dropoffLocation': booking.dropoff_location,
                'status': booking.status,
                'customer': {'name': booking.user.name} if booking.user else {},
                'vehicle': {'name': f"{booking.vehicle.make} {booking.vehicle.model}"} if booking.vehicle else {},
            }
        result.append(data)
    return jsonify(result), 200


@bp.route('/', methods=['POST'])
@role_required('staff', 'admin')
def create_driver_assignment():
    data = request.get_json()
    booking_id = data.get('booking_id')
    driver_id = data.get('driver_id')

    if not booking_id or not driver_id:
        return jsonify({'message': 'booking_id and driver_id are required'}), 400

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

    return jsonify({'message': 'Driver assigned', 'id': assignment.id}), 201
