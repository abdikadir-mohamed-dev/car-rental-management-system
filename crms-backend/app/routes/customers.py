from flask import Blueprint, request, jsonify
from app import db
from app.models import Customer

bp = Blueprint('customers', __name__, url_prefix='/api/customers')

@bp.route('/', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    return jsonify([c.to_dict() for c in customers]), 200

@bp.route('/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    return jsonify(customer.to_dict()), 200
