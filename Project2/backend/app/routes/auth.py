from flask import Blueprint, request, jsonify
from ..models import db, User
from ..utils.security import generate_token, token_required, get_current_user_from_request

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    phone = data.get('phone', '').strip() or None

    if not name or not email or not password:
        return jsonify({'message': 'Name, email, and password are required.'}), 400

    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email is already registered. Please login.'}), 409

    user = User(
        name=name,
        email=email,
        role='customer',
        phone=phone
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id, user.role)
    user_data = user.to_dict()
    user_data['token'] = token

    return jsonify({
        'message': 'Registration successful!',
        'token': token,
        'user': user_data
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email or password.'}), 401

    if not user.is_active:
        return jsonify({'message': 'Your account is deactivated. Contact support.'}), 403

    token = generate_token(user.id, user.role)
    user_data = user.to_dict()
    user_data['token'] = token

    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': user_data
    }), 200


@auth_bp.route('/me', methods=['GET'])
def get_current_user_profile():
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Unauthorized. Please login.'}), 401
    return jsonify({'user': user.to_dict()}), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully.'}), 200


@auth_bp.route('/profile', methods=['GET', 'PATCH'])
def manage_profile():
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Unauthorized. Please login.'}), 401

    if request.method == 'GET':
        return jsonify({'user': user.to_dict()}), 200

    data = request.get_json() or {}
    if 'name' in data and data['name'].strip():
        user.name = data['name'].strip()
    if 'phone' in data:
        user.phone = data['phone'].strip()
    if 'avatar_url' in data:
        user.avatar_url = data['avatar_url'].strip()

    if 'password' in data and len(data['password']) >= 6:
        user.set_password(data['password'])

    db.session.commit()
    return jsonify({
        'message': 'Profile updated successfully!',
        'user': user.to_dict()
    }), 200
