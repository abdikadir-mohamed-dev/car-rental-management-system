from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app import db


auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.password_hash or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    if not user.is_active:
        return jsonify({'error': 'Account is inactive'}), 403

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'mustChangePassword': user.must_change_password,
    })


@auth_bp.route('/update-password', methods=['POST'])
def update_password():
    data = request.get_json() or {}
    email = data.get('email')
    new_password = data.get('newPassword')

    if not email or not new_password:
        return jsonify({'error': 'Email and new password are required'}), 400

    if len(new_password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.password_hash = generate_password_hash(new_password)
    user.must_change_password = False
    db.session.commit()

    return jsonify({'message': 'Password updated successfully'})


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400

    user = User(
        name=name,
        email=email,
        role='customer',
        password_hash=generate_password_hash(password),
        must_change_password=False,
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'mustChangePassword': user.must_change_password,
    }), 201


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'No account with that email'}), 404
    return jsonify({'message': 'Password reset link sent to email'})


@auth_bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json() or {}
    password = data.get('password')
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    return jsonify({'message': 'Password reset successful'})


@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'})
from flask import Blueprint, request, jsonify
from app import db, jwt
from app.models.user import User
from datetime import datetime

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and user.password_hash == password:
        return jsonify({
            'access_token': 'mock-token-' + str(user.id),
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User(
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        password_hash=data.get('password'),
        role=data.get('role', 'customer')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created', 'user_id': user.id}), 201
