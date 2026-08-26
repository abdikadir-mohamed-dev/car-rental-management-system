from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from app.utils.jwt import generate_token

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = generate_token(user.id, user.role)
    
    return jsonify({
        'user': user.to_dict(),
        'token': token
    }), 200

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    user = User(
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        role=data.get('role', 'customer')
    )
    user.set_password(data.get('password'))
    
    db.session.add(user)
    db.session.commit()
    
    token = generate_token(user.id, user.role)
    
    return jsonify({
        'user': user.to_dict(),
        'token': token
    }), 201

@bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200

@bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    return jsonify({'message': 'Password reset link sent'}), 200

@bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    return jsonify({'message': 'Password reset successfully'}), 200
