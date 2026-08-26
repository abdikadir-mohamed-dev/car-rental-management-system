from flask import Blueprint, request, jsonify
from app import db
from app.models import Payment

bp = Blueprint('payments', __name__, url_prefix='/api/payments')

@bp.route('/', methods=['GET'])
def get_payments():
    driver_id = request.args.get('driver_id', 1)
    payments = Payment.query.filter_by(driver_id=driver_id).order_by(Payment.date.desc()).all()
    return jsonify([p.to_dict() for p in payments]), 200

@bp.route('/', methods=['POST'])
def create_payment():
    data = request.get_json()
    payment = Payment(
        driver_id=data.get('driver_id'),
        amount=data.get('amount'),
        status=data.get('status', 'pending'),
        method=data.get('method', 'cash'),
        date=data.get('date')
    )
    db.session.add(payment)
    db.session.commit()
    return jsonify(payment.to_dict()), 201
