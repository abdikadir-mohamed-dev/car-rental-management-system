from flask import Blueprint, request, jsonify
from app import db
from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app.models.user import User
from datetime import datetime

bp = Blueprint('bookings', __name__, url_prefix='/bookings')

@bp.route('/', methods=['GET'])
def get_all_bookings():
    bookings = Booking.query.all()
    result = [{
        '_id': f'BKG-{b.id:04d}',
        'vehicle': {'name': b.vehicle.name},
        'user': {'name': b.user.name},
        'pickupDate': str(b.pickup_date),
        'dropoffDate': str(b.dropoff_date),
        'status': b.status,
        'totalAmount': b.total_amount
    } for b in bookings]
    return jsonify(result), 200

@bp.route('/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    b = Booking.query.get_or_404(booking_id)
    return jsonify({
        '_id': f'BKG-{b.id:04d}',
        'vehicle': {'name': b.vehicle.name},
        'user': {'name': b.user.name},
        'pickupDate': str(b.pickup_date),
        'dropoffDate': str(b.dropoff_date),
        'status': b.status,
        'totalAmount': b.total_amount
    }), 200

@bp.route('/', methods=['POST'])
def create_booking():
    data = request.get_json()
    booking = Booking(
        user_id=data.get('user_id'),
        vehicle_id=data.get('vehicle_id'),
        pickup_date=data.get('pickupDate'),
        dropoff_date=data.get('dropoffDate'),
        pickup_location=data.get('pickupLocation'),
        dropoff_location=data.get('dropoffLocation'),
        total_amount=data.get('totalAmount', 0.0),
        status='pending'
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify({'message': 'Booking created', 'booking_id': booking.id}), 201
