from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.trip import Trip

bp = Blueprint('trips', __name__, url_prefix='/api/trips')


@bp.route('/', methods=['GET'])
def get_trips():
    trips = Trip.query.all()
    result = [t.to_dict() for t in trips]
    return jsonify(result), 200


@bp.route('/<int:trip_id>/status', methods=['PUT'])
def update_trip_status(trip_id):
    data = request.get_json()
    t = Trip.query.get_or_404(trip_id)
    t.status = data.get('status', t.status)
    db.session.commit()
    return jsonify({'message': 'Trip status updated'}), 200
