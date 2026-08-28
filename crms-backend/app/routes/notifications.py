from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.notification import Notification
from app.utils.auth import token_required

bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')


@bp.route('/', methods=['GET'])
def get_notifications():
    user_id = request.args.get('user_id', type=int)
    query = Notification.query
    if user_id:
        query = query.filter_by(user_id=user_id)
    notifications = query.order_by(Notification.created_at.desc()).all()
    result = [n.to_dict() for n in notifications]
    return jsonify(result), 200


@bp.route('/unread-count', methods=['GET'])
@token_required
def get_unread_count():
    from flask_jwt_extended import get_jwt_identity
    user_id = int(get_jwt_identity())
    count = Notification.query.filter_by(user_id=user_id, read=False).count()
    return jsonify({'count': count}), 200


@bp.route('/<int:notification_id>/read', methods=['PUT'])
def mark_read(notification_id):
    n = Notification.query.get_or_404(notification_id)
    n.read = True
    db.session.commit()
    return jsonify({'message': 'Notification marked as read'}), 200


@bp.route('/read-all', methods=['PUT'])
@token_required
def mark_all_read():
    from flask_jwt_extended import get_jwt_identity
    user_id = int(get_jwt_identity())
    Notification.query.filter_by(user_id=user_id, read=False).update({'read': True})
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read'}), 200
