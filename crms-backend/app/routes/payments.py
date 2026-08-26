from flask import Blueprint, jsonify, request
from app import db
from app.models.payment import Payment


payments_bp = Blueprint('payments', __name__, url_prefix='/api/payments')


@payments_bp.route('/', methods=['GET'])
def get_payments():
    booking_id = request.args.get('bookingId')
    query = Payment.query
    if booking_id:
        query = query.filter_by(booking_id=booking_id)
    payments = query.order_by(Payment.created_at.desc()).all()
    return jsonify({'payments': [p.to_dict() for p in payments]})


@payments_bp.route('/<int:payment_id>', methods=['GET'])
def get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    return jsonify(payment.to_dict())


@payments_bp.route('/', methods=['POST'])
def process_payment():
    data = request.get_json() or {}
    payment = Payment(
        booking_id=data.get('bookingId'),
        amount=data.get('amount'),
        method=data.get('method'),
        transaction_id=data.get('transactionId'),
        status='completed',
    )
    db.session.add(payment)
    db.session.commit()
    return jsonify({'payment': payment.to_dict()}), 201


@payments_bp.route('/<int:payment_id>/refund', methods=['POST'])
def refund_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    payment.status = 'refunded'
    db.session.commit()
    return jsonify({'payment': payment.to_dict()})
