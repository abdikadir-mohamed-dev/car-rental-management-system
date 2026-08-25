from flask import Blueprint, request, jsonify
from app import db
from app.models.trip import Trip

bp = Blueprint('trips', __name__)

@bp.route('/', methods=['GET'])
def get_trips():
    trips = Trip.query.all()
    result = [{
        'id': t.id,
        'booking_id': t.booking_id,
        'driver_id': t.driver_id,
        'pickup_location': t.pickup_location,
        'dropoff_location': t.dropoff_location,
        'pickup_time': t.pickup_time.isoformat() if t.pickup_time else None,
        'status': t.status
    } for t in trips]
    return jsonify(result), 200

@bp.route('/<int:trip_id>/status', methods=['PUT'])
def update_trip_status(trip_id):
    data = request.get_json()
    t = Trip.query.get_or_404(trip_id)
    t.status = data.get('status', t.status)
    db.session.commit()
    return jsonify({'message': 'Trip status updated'}), 200
