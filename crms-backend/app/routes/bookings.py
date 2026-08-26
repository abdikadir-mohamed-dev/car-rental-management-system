from flask import Blueprint, jsonify, request
from app import db
from app.models.booking import Booking
from app.models.vehicle import Vehicle


bookings_bp = Blueprint('bookings', __name__, url_prefix='/api/bookings')


@bookings_bp.route('/', methods=['GET'])
def get_bookings():
    user_id = request.args.get('userId')
    status = request.args.get('status')
    query = Booking.query
    if user_id:
        query = query.filter_by(user_id=user_id)
    if status:
        query = query.filter_by(status=status)
    bookings = query.order_by(Booking.created_at.desc()).all()
    return jsonify({'bookings': [b.to_dict() for b in bookings]})


@bookings_bp.route('/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    return jsonify(booking.to_dict())


@bookings_bp.route('/', methods=['POST'])
def create_booking():
    data = request.get_json() or {}

    booking = Booking(
        user_id=data.get('userId'),
        vehicle_id=data.get('vehicleId'),
        pickup_location=data.get('pickupLocation'),
        return_location=data.get('returnLocation'),
        pickup_date=data.get('pickupDate'),
        return_date=data.get('returnDate'),
        driver_option=data.get('driverOption', False),
        driver_id=data.get('driverId'),
        special_requests=data.get('specialRequests'),
        total_amount=data.get('totalAmount', 0),
        status='pending',
    )

    vehicle = Vehicle.query.get(booking.vehicle_id)
    if vehicle:
        vehicle.status = 'rented'
        vehicle.available = False

    db.session.add(booking)
    db.session.commit()
    return jsonify({'booking': booking.to_dict()}), 201


@bookings_bp.route('/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json() or {}

    if 'pickupLocation' in data:
        booking.pickup_location = data['pickupLocation']
    if 'returnLocation' in data:
        booking.return_location = data['returnLocation']
    if 'pickupDate' in data:
        booking.pickup_date = data['pickupDate']
    if 'returnDate' in data:
        booking.return_date = data['returnDate']
    if 'status' in data:
        booking.status = data['status']
        if data['status'] == 'completed':
            vehicle = Vehicle.query.get(booking.vehicle_id)
            if vehicle:
                vehicle.status = 'available'
                vehicle.available = True

    db.session.commit()
    return jsonify({'booking': booking.to_dict()})


@bookings_bp.route('/<int:booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    booking.status = 'cancelled'
    vehicle = Vehicle.query.get(booking.vehicle_id)
    if vehicle:
        vehicle.status = 'available'
        vehicle.available = True
    db.session.commit()
    return jsonify({'message': 'Booking cancelled'})
