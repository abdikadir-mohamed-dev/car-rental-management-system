from flask import Blueprint, request, jsonify
from app import db
from app.models import Booking, Customer, Vehicle

bp = Blueprint('bookings', __name__, url_prefix='/api/bookings')

@bp.route('/', methods=['GET'])
def get_bookings():
    status = request.args.get('status', 'all')
    query = Booking.query
    if status != 'all':
        query = query.filter_by(status=status)
    bookings = query.order_by(Booking.created_at.desc()).all()
    return jsonify([b.to_dict() for b in bookings]), 200

@bp.route('/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    return jsonify(booking.to_dict()), 200

@bp.route('/', methods=['POST'])
def create_booking():
    data = request.get_json()
    booking = Booking(
        customer_id=data.get('customer_id'),
        vehicle_id=data.get('vehicle_id'),
        pickup_location=data.get('pickup_location'),
        date=data.get('date'),
        amount=data.get('amount'),
        status='pending'
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify(booking.to_dict()), 201

@bp.route('/<int:booking_id>/status', methods=['PATCH'])
def update_booking_status(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json()
    booking.status = data.get('status', booking.status)
    db.session.commit()
    return jsonify(booking.to_dict()), 200
