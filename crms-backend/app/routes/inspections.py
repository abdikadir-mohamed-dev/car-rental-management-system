from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.inspection import Inspection

bp = Blueprint('inspections', __name__, url_prefix='/api/inspections')


@bp.route('/', methods=['GET'])
def get_inspections():
    inspections = Inspection.query.all()
    result = [i.to_dict() for i in inspections]
    return jsonify(result), 200
