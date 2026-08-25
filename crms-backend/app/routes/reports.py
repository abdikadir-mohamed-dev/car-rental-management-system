from flask import Blueprint, request, jsonify
from app import db
from app.models.report import Report

bp = Blueprint('reports', __name__)

@bp.route('/', methods=['GET'])
def get_reports():
    reports = Report.query.all()
    result = [{
        'id': r.id,
        'title': r.title,
        'type': r.type,
        'generated_by': r.generated_by,
        'status': r.status,
        'generated_at': r.generated_at.isoformat()
    } for r in reports]
    return jsonify(result), 200

@bp.route('/', methods=['POST'])
def create_report():
    data = request.get_json()
    report = Report(
        title=data.get('title'),
        type=data.get('type'),
        generated_by=data.get('generated_by'),
        status='ready'
    )
    db.session.add(report)
    db.session.commit()
    return jsonify({'message': 'Report created', 'id': report.id}), 201
