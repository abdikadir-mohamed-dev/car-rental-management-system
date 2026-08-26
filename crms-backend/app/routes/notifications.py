from flask import Blueprint, request, jsonify
from app import db
from app.models import Notification

bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

@bp.route('/', methods=['GET'])
def get_notifications():
    user_id = request.args.get('user_id', 1)
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications]), 200

@bp.route('/<int:notification_id>/read', methods=['PATCH'])
def mark_notification_read(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    notification.read = True
    db.session.commit()
    return jsonify(notification.to_dict()), 200

@bp.route('/read-all', methods=['PATCH'])
def mark_all_notifications_read():
    user_id = request.args.get('user_id', 1)
    Notification.query.filter_by(user_id=user_id, read=False).update({'read': True})
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read'}), 200
