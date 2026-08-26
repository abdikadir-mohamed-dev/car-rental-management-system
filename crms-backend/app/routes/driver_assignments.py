from flask import Blueprint, request, jsonify
from app import db
from app.models.driver_assignment import DriverAssignment

bp = Blueprint('driver_assignments', __name__)

@bp.route('/', methods=['GET'])
def get_driver_assignments():
    assignments = DriverAssignment.query.all()
    result = [{
        'id': a.id,
        'booking_id': a.booking_id,
        'driver_id': a.driver_id,
        'status': a.status,
        'assigned_at': a.assigned_at.isoformat()
    } for a in assignments]
    return jsonify(result), 200

@bp.route('/', methods=['POST'])
def create_driver_assignment():
    data = request.get_json()
    assignment = DriverAssignment(
        booking_id=data.get('booking_id'),
        driver_id=data.get('driver_id'),
        status='assigned'
    )
    db.session.add(assignment)
    db.session.commit()
    return jsonify({'message': 'Driver assigned', 'id': assignment.id}), 201
