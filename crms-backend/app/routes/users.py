from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app import db
from app.utils.auth import token_required, role_required

bp = Blueprint('users', __name__, url_prefix='/users')

@bp.route('/', methods=['GET'])
@role_required('admin')
def get_users():
    users = User.query.all()
    return jsonify({'users': [u.to_dict() for u in users]}), 200


@bp.route('/<int:user_id>', methods=['GET'])
@token_required
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({'user': user.to_dict()}), 200


@bp.route('/<int:user_id>', methods=['PUT'])
@role_required('admin')
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    for field in ['name', 'email', 'phone', 'role', 'drivers_license', 'license_expiry',
                  'country', 'profile_photo', 'reset_password_token', 'reset_password_expire']:
        if field in data:
            setattr(user, field, data[field])
    if 'password' in data:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify({'user': user.to_dict()}), 200


@bp.route('/<int:user_id>', methods=['DELETE'])
@role_required('admin')
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200


@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify({'user': user.to_dict()}), 200


@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    for field in ['name', 'email', 'phone', 'drivers_license', 'license_expiry', 'country', 'profile_photo']:
        if field in data:
            setattr(user, field, data[field])
    db.session.commit()
    return jsonify({'user': user.to_dict()}), 200


@bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    if not current_password or not new_password:
        return jsonify({'message': 'Current password and new password are required'}), 400
    if not user.check_password(current_password):
        return jsonify({'message': 'Current password is incorrect'}), 400
    user.set_password(new_password)
    db.session.commit()
    return jsonify({'message': 'Password changed successfully'}), 200
