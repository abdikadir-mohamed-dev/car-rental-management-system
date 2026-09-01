from functools import wraps

from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.user import User


def get_current_user():
    """Return the currently authenticated user."""
    user_id = get_jwt_identity()

    if not user_id:
        return None

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        return None

    return User.query.get(user_id)


def token_required(f):
    """Require a valid JWT and an existing user."""

    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):

        # OPTIONS requests are handled by CORS and should not
        # require JWT authentication.
        if request.method == 'OPTIONS':
            return '', 204

        user = get_current_user()

        if not user:
            return jsonify({
                'message': 'User not found'
            }), 401

        return f(*args, **kwargs)

    return decorated


def role_required(*allowed_roles):
    """Require a valid JWT and one of the allowed user roles."""

    def decorator(f):

        @wraps(f)
        @jwt_required()
        def decorated(*args, **kwargs):

            # =================================================
            # Allow browser CORS preflight requests
            # =================================================

            if request.method == 'OPTIONS':
                return '', 204

            user = get_current_user()

            if not user:
                return jsonify({
                    'message': 'User not found'
                }), 401

            if user.role not in allowed_roles:
                return jsonify({
                    'message': 'Insufficient permissions'
                }), 403

            return f(*args, **kwargs)

        return decorated

    return decorator