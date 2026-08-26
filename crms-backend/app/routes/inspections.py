from flask import Blueprint, request, jsonify
from app import db
from app.models.inspection import Inspection

bp = Blueprint('inspections', __name__)

@bp.route('/', methods=['GET'])
def get_inspections():
    inspections = Inspection.query.all()
    result = [{
        'id': i.id,
        'booking_id': i.booking_id,
        'vehicle_id': i.vehicle_id,
        'inspector_id': i.inspector_id,
        'type': i.type,
        'mileage': i.mileage,
        'fuel_level': i.fuel_level,
        'condition': i.condition,
        'damage_notes': i.damage_notes,
        'status': i.status
    } for i in inspections]
    return jsonify(result), 200
