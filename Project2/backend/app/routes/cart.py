from flask import Blueprint, request, jsonify
from ..models import db, CartItem, MenuItem
from ..utils.security import get_current_user_from_request

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('', methods=['GET'])
@cart_bp.route('/', methods=['GET'])
def get_user_cart():
    user = get_current_user_from_request()
    if not user:
        return jsonify({'items': [], 'subtotal': 0.0, 'count': 0}), 200

    cart_items = CartItem.query.filter_by(user_id=user.id).all()
    serialized = [item.to_dict() for item in cart_items]
    subtotal = sum(item['subtotal'] for item in serialized)

    return jsonify({
        'items': serialized,
        'subtotal': subtotal,
        'count': sum(item['quantity'] for item in serialized)
    }), 200


@cart_bp.route('/items', methods=['POST'])
def add_to_cart():
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Please login to manage persistent cart.'}), 401

    data = request.get_json() or {}
    item_id = data.get('menu_item_id') or data.get('item_id')
    qty = int(data.get('quantity', 1))
    notes = data.get('customization_notes', '')

    if not item_id:
        return jsonify({'message': 'menu_item_id is required.'}), 400

    item = MenuItem.query.get(item_id)
    if not item or not item.is_available:
        return jsonify({'message': 'Item is not available.'}), 404

    cart_item = CartItem.query.filter_by(user_id=user.id, menu_item_id=item_id).first()
    if cart_item:
        cart_item.quantity += qty
        if notes:
            cart_item.customization_notes = notes
    else:
        cart_item = CartItem(
            user_id=user.id,
            menu_item_id=item_id,
            quantity=qty,
            customization_notes=notes
        )
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({'message': 'Item added to cart.', 'item': cart_item.to_dict()}), 201


@cart_bp.route('/items/<int:cart_item_id>', methods=['PATCH', 'PUT'])
def update_cart_item(cart_item_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Unauthorized.'}), 401

    cart_item = CartItem.query.filter_by(id=cart_item_id, user_id=user.id).first()
    if not cart_item:
        return jsonify({'message': 'Cart item not found.'}), 404

    data = request.get_json() or {}
    qty = data.get('quantity')
    if qty is not None:
        qty = int(qty)
        if qty <= 0:
            db.session.delete(cart_item)
            db.session.commit()
            return jsonify({'message': 'Item removed from cart.'}), 200
        cart_item.quantity = qty

    if 'customization_notes' in data:
        cart_item.customization_notes = data['customization_notes']

    db.session.commit()
    return jsonify({'message': 'Cart updated.', 'item': cart_item.to_dict()}), 200


@cart_bp.route('/items/<int:cart_item_id>', methods=['DELETE'])
def remove_cart_item(cart_item_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Unauthorized.'}), 401

    cart_item = CartItem.query.filter_by(id=cart_item_id, user_id=user.id).first()
    if not cart_item:
        return jsonify({'message': 'Cart item not found.'}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({'message': 'Item removed from cart.'}), 200


@cart_bp.route('/clear', methods=['DELETE', 'POST'])
def clear_cart():
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Unauthorized.'}), 401

    CartItem.query.filter_by(user_id=user.id).delete()
    db.session.commit()
    return jsonify({'message': 'Cart cleared.'}), 200
