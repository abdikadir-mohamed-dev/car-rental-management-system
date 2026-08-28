from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.report import Report

bp = Blueprint('reports', __name__, url_prefix='/api/reports')


@bp.route('/', methods=['GET'])
def get_reports():
    reports = Report.query.all()
    result = [{
        'id': r.id,
        'report_type': r.report_type,
        'period': r.period,
        'data': r.data,
        'created_at': r.created_at.isoformat() if r.created_at else None,
    } for r in reports]
    return jsonify(result), 200


@bp.route('/', methods=['POST'])
def create_report():
    data = request.get_json()
    report = Report(
        report_type=data.get('report_type') or data.get('type'),
        period=data.get('period'),
        data=data.get('data', {}),
    )
    db.session.add(report)
    db.session.commit()
    return jsonify({'message': 'Report created', 'id': report.id}), 201
