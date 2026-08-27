import jwt
import datetime
from flask import request, jsonify
from functools import wraps
from app.config import Config

def generate_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')

def decode_token(token):
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        payload = decode_token(token)
        if not payload:
            return jsonify({'message': 'Token is invalid or expired'}), 401
        
        from app.models import User
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'message': 'User not found'}), 401
        
        request.current_user = user
        return f(*args, **kwargs)
    
    return decorated

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
            
            if not token:
                return jsonify({'message': 'Token is missing'}), 401
            
            payload = decode_token(token)
            if not payload:
                return jsonify({'message': 'Token is invalid or expired'}), 401
            
            from app.models import User
            user = User.query.get(payload['user_id'])
            if not user:
                return jsonify({'message': 'User not found'}), 401
            
            if user.role not in allowed_roles:
                return jsonify({'message': 'Insufficient permissions'}), 403
            
            request.current_user = user
            return f(*args, **kwargs)
        
        return decorated
    return decorator
