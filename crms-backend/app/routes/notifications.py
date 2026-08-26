from flask import Blueprint, request, jsonify
from app import db
from app.models.notification import Notification

bp = Blueprint('notifications', __name__)

@bp.route('/', methods=['GET'])
def get_notifications():
    user_id = request.args.get('user_id', type=int)
    query = Notification.query
    if user_id:
        query = query.filter_by(user_id=user_id)
    notifications = query.all()
    result = [{
        'id': n.id,
        'user_id': n.user_id,
        'title': n.title,
        'message': n.message,
        'read': n.read,
        'created_at': n.created_at.isoformat()
    } for n in notifications]
    return jsonify(result), 200

@bp.route('/<int:notification_id>/read', methods=['PUT'])
def mark_read(notification_id):
    n = Notification.query.get_or_404(notification_id)
    n.read = True
    db.session.commit()
    return jsonify({'message': 'Notification marked as read'}), 200
