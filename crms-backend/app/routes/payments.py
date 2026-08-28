from flask import Blueprint, jsonify, request, send_file
from datetime import datetime, timezone
from app.models.payment import Payment
from app.models.booking import Booking
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.notification import Notification
from app import db
from app.utils.auth import token_required, role_required
from flask_jwt_extended import get_jwt_identity
from io import BytesIO

bp = Blueprint('payments', __name__, url_prefix='/api/payments')


def create_notification(user_id, title, message):
    try:
        notification = Notification(user_id=user_id, title=title, message=message)
        db.session.add(notification)
    except Exception:
        pass


@bp.route('/', methods=['GET'])
@token_required
def get_payments():
    status = request.args.get('status')
    booking = request.args.get('booking')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    offset = (page - 1) * limit

    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    query = Payment.query
    if status:
        query = query.filter_by(status=status)
    if booking:
        query = query.filter_by(booking_id=int(booking))
    elif current_user.role == 'customer':
        query = query.filter_by(customer_id=current_user_id)

    payments = query.order_by(Payment.created_at.desc()).limit(limit).offset(offset).all()
    result = []
    for p in payments:
        client = p.to_dict()
        b = Booking.query.get(p.booking_id)
        if b:
            client['booking'] = {
                'pickupDate': b.pickup_date.isoformat() if b.pickup_date else None,
                'returnDate': b.dropoff_date.isoformat() if b.dropoff_date else None,
                'pickupLocation': b.pickup_location,
                'dropoffLocation': b.dropoff_location,
            }
        result.append(client)
    return jsonify({'payments': result}), 200


@bp.route('/<int:payment_id>', methods=['GET'])
@token_required
def get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if current_user.role == 'customer' and payment.customer_id != current_user_id:
        return jsonify({'message': 'Access denied'}), 403

    return jsonify({'payment': payment.to_dict()}), 200


@bp.route('/', methods=['POST'])
@token_required
def create_payment():
    data = request.get_json() or {}
    booking_id = data.get('bookingId')
    amount = data.get('amount')
    method = data.get('method', 'mpesa')

    booking = Booking.query.get(int(booking_id) if booking_id else 0)
    if not booking:
        return jsonify({'message': 'Booking not found'}), 404

    existing = Payment.query.filter_by(booking_id=int(booking_id), status='completed').first()
    if existing:
        return jsonify({'message': 'Payment already made for this booking'}), 400

    current_user_id = int(get_jwt_identity())
    transaction_id = f"TXN{datetime.now(timezone.utc).timestamp():.0f}{__import__('random').randint(100, 999)}"
    payment = Payment(
        booking_id=int(booking_id),
        customer_id=current_user_id,
        amount=float(amount) if amount else booking.total_amount,
        method=method,
        status='completed',
        transaction_id=transaction_id,
        paid_at=datetime.now(timezone.utc),
        date=datetime.now(timezone.utc).date(),
    )
    db.session.add(payment)
    booking.status = 'confirmed'
    db.session.commit()

    customer = User.query.get(current_user_id)
    if customer:
        create_notification(customer.id, 'Payment Successful', f'Payment of KES {payment.amount} received for booking #{booking.id}.')
    staff_users = User.query.filter_by(role='staff', is_active=True).all()
    for staff in staff_users:
        create_notification(staff.id, 'New Payment', f'Payment of KES {payment.amount} received for booking #{booking.id} by {customer.name if customer else "a customer"}.')

    return jsonify({'payment': payment.to_dict()}), 201


@bp.route('/<int:payment_id>/refund', methods=['POST'])
@role_required('admin')
def refund_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    payment.status = 'refunded'
    db.session.commit()
    return jsonify({'message': 'Payment refunded successfully', 'payment': payment.to_dict()}), 200


@bp.route('/<int:payment_id>/receipt', methods=['GET'])
@token_required
def get_receipt(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if current_user.role == 'customer' and payment.customer_id != current_user_id:
        return jsonify({'message': 'Access denied'}), 403

    booking = Booking.query.get(payment.booking_id)
    customer = User.query.get(payment.customer_id) if payment.customer_id else None
    vehicle = Vehicle.query.get(booking.vehicle_id) if booking else None

    receipt = {
        'receiptNumber': f"RCP-{payment.id:06d}",
        'transactionId': payment.transaction_id,
        'date': payment.paid_at.isoformat() if payment.paid_at else datetime.now(timezone.utc).isoformat(),
        'status': payment.status,
        'method': payment.method,
        'amount': payment.amount,
        'customer': {
            'name': customer.name if customer else 'N/A',
            'email': customer.email if customer else 'N/A',
            'phone': customer.phone if customer else 'N/A',
        },
        'booking': {
            'id': booking.id if booking else None,
            'pickupDate': booking.pickup_date.isoformat() if booking and booking.pickup_date else None,
            'returnDate': booking.dropoff_date.isoformat() if booking and booking.dropoff_date else None,
            'pickupLocation': booking.pickup_location if booking else None,
            'vehicle': f"{vehicle.make} {vehicle.model}" if vehicle else 'N/A',
        },
        'business': {
            'name': 'DriveGo Car Rental',
            'address': '123 Main Street, Nairobi, Kenya',
            'phone': '+254 700 123 456',
            'email': 'info@drivego.com',
        },
    }
    return jsonify(receipt), 200
