from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.report import Report
from app.utils.auth import role_required

bp = Blueprint('reports', __name__, url_prefix='/api/reports')


# ============================================================
# GET REPORTS
# ============================================================

@bp.route('/', methods=['GET'])
@role_required('staff', 'admin')
def get_reports():

    reports = Report.query.order_by(
        Report.created_at.desc()
    ).all()

    result = []

    for r in reports:

        report_type = r.report_type or 'General'

        # Create a readable title from report type
        title_map = {
            'Revenue': 'Monthly Revenue',
            'Bookings': 'Booking Summary',
            'Fleet': 'Fleet Utilization',
            'Most Rented Vehicles': 'Most Rented Vehicles',
        }

        title = title_map.get(
            report_type,
            report_type
        )

        result.append({
            'id': r.id,
            '_id': f'RPT-{r.id + 100:03d}',

            'title': title,

            'type': report_type,

            'date': (
                r.created_at.strftime('%Y-%m-%d')
                if r.created_at
                else None
            ),

            'period': r.period,

            'status': 'ready',

            'data': r.data,

            'createdAt': (
                r.created_at.isoformat()
                if r.created_at
                else None
            )
        })

    return jsonify(result), 200


# ============================================================
# CREATE REPORT
# ============================================================

@bp.route('/', methods=['POST'])
@role_required('staff', 'admin')
def create_report():

    data = request.get_json() or {}

    report = Report(
        report_type=data.get('report_type') or data.get('type'),
        period=data.get('period'),
        data=data.get('data', {}),
    )

    db.session.add(report)
    db.session.commit()

    return jsonify({
        'message': 'Report created',
        'report': {
            'id': report.id,
            '_id': f'RPT-{report.id + 100:03d}',
        }
    }), 201