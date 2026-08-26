from flask import Blueprint, request, jsonify
from app import db
from app.models import Maintenance

bp = Blueprint('maintenance', __name__, url_prefix='/api/maintenance')

@bp.route('/', methods=['GET'])
def get_maintenance_requests():
    vehicle_id = request.args.get('vehicle_id')
    query = Maintenance.query
    if vehicle_id:
        query = query.filter_by(vehicle_id=vehicle_id)
    requests = query.order_by(Maintenance.created_at.desc()).all()
    return jsonify([r.to_dict() for r in requests]), 200

@bp.route('/', methods=['POST'])
def create_maintenance_request():
    data = request.get_json()
    request_obj = Maintenance(
        vehicle_id=data.get('vehicle_id'),
        issue=data.get('issue'),
        priority=data.get('priority', 'Medium'),
        status='Open',
        date=data.get('date', 'Today')
    )
    db.session.add(request_obj)
    db.session.commit()
    return jsonify(request_obj.to_dict()), 201

@bp.route('/<int:request_id>', methods=['PATCH'])
def update_maintenance_request(request_id):
    request_obj = Maintenance.query.get_or_404(request_id)
    data = request.get_json()
    for key, value in data.items():
        if hasattr(request_obj, key):
            setattr(request_obj, key, value)
    db.session.commit()
    return jsonify(request_obj.to_dict()), 200
