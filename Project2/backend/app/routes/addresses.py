from flask import Blueprint, request, jsonify
from ..models import db, Address
from ..utils.security import get_current_user_from_request

addresses_bp = Blueprint('addresses', __name__)

@addresses_bp.route('', methods=['GET'])
@addresses_bp.route('/', methods=['GET'])
def list_addresses():
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Please login.'}), 401

    addresses = Address.query.filter_by(user_id=user.id).all()
    return jsonify([a.to_dict() for a in addresses]), 200


@addresses_bp.route('', methods=['POST'])
@addresses_bp.route('/', methods=['POST'])
def add_address():
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Please login.'}), 401

    data = request.get_json() or {}
    addr_line = data.get('address_line1') or data.get('address')
    city = data.get('city', 'Chennai')
    postal_code = data.get('postal_code', '600001')
    title = data.get('title', 'Home')
    recipient = data.get('recipient_name', user.name)
    phone = data.get('phone', user.phone)
    is_default = bool(data.get('is_default', False))

    if not addr_line:
        return jsonify({'message': 'Address line is required.'}), 400

    if is_default:
        Address.query.filter_by(user_id=user.id).update({'is_default': False})

    address = Address(
        user_id=user.id,
        title=title,
        recipient_name=recipient,
        phone=phone,
        address_line1=addr_line,
        address_line2=data.get('address_line2'),
        landmark=data.get('landmark'),
        city=city,
        state=data.get('state', 'Tamil Nadu'),
        postal_code=postal_code,
        is_default=is_default
    )
    db.session.add(address)
    db.session.commit()

    return jsonify({'message': 'Address saved.', 'address': address.to_dict()}), 201


@addresses_bp.route('/<int:address_id>', methods=['PATCH', 'PUT'])
def update_address(address_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Please login.'}), 401

    addr = Address.query.filter_by(id=address_id, user_id=user.id).first()
    if not addr:
        return jsonify({'message': 'Address not found.'}), 404

    data = request.get_json() or {}
    if 'address_line1' in data:
        addr.address_line1 = data['address_line1']
    if 'city' in data:
        addr.city = data['city']
    if 'postal_code' in data:
        addr.postal_code = data['postal_code']
    if 'title' in data:
        addr.title = data['title']
    if 'is_default' in data and data['is_default']:
        Address.query.filter_by(user_id=user.id).update({'is_default': False})
        addr.is_default = True

    db.session.commit()
    return jsonify({'message': 'Address updated.', 'address': addr.to_dict()}), 200


@addresses_bp.route('/<int:address_id>', methods=['DELETE'])
def delete_address(address_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Please login.'}), 401

    addr = Address.query.filter_by(id=address_id, user_id=user.id).first()
    if not addr:
        return jsonify({'message': 'Address not found.'}), 404

    db.session.delete(addr)
    db.session.commit()
    return jsonify({'message': 'Address deleted.'}), 200
