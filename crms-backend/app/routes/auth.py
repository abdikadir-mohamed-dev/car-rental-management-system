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
