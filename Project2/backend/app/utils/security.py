import jwt
from datetime import datetime, timezone
from functools import wraps
from flask import request, jsonify, current_app
from ..models import db, User

def generate_token(user_id, role, expires_delta=None):
    """Generate a signed JWT token for the user."""
    if expires_delta is None:
        expires_delta = current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES')

    now = datetime.now(timezone.utc)
    payload = {
        'sub': str(user_id),
        'role': role,
        'iat': now,
        'exp': now + expires_delta
    }
    secret = current_app.config.get('JWT_SECRET_KEY')
    return jwt.encode(payload, secret, algorithm='HS256')


def decode_token(token):
    """Decode and validate a JWT token."""
    secret = current_app.config.get('JWT_SECRET_KEY')
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except Exception as e:
        return None


def get_current_user_from_request():
    """Extract and authenticate the user from Authorization header or fallback header."""
    auth_header = request.headers.get('Authorization', '')
    token = None

    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ', 1)[1].strip()
    elif request.cookies.get('access_token'):
        token = request.cookies.get('access_token')

    if token:
        payload = decode_token(token)
        if payload and 'sub' in payload:
            user = db.session.get(User, int(payload['sub']))
            if user and user.is_active:
                return user

    # Academic/demo fallback: allow X-User-Id
    fallback_id = request.headers.get('X-User-Id')
    if fallback_id and fallback_id.isdigit():
        user = db.session.get(User, int(fallback_id))
        if user and user.is_active:
            return user

    return None


def token_required(f):
    """Decorator requiring a valid authenticated user."""
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user = get_current_user_from_request()
        if not current_user:
            return jsonify({'message': 'Authentication required. Invalid or missing token.'}), 401
        return f(current_user, *args, **kwargs)
    return decorated


def role_required(*allowed_roles):
    """Decorator requiring specific role privileges."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            current_user = get_current_user_from_request()
            if not current_user:
                return jsonify({'message': 'Authentication required.'}), 401
            if current_user.role not in allowed_roles:
                return jsonify({'message': f'Access forbidden: requires one of {allowed_roles}'}), 403
            return f(current_user, *args, **kwargs)
        return decorated
    return decorator
