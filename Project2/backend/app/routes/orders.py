from flask import Blueprint, request, jsonify
from datetime import datetime
from ..models import db, Order, OrderStatusHistory, Restaurant, User
from ..services.checkout_service import execute_atomic_checkout, calculate_checkout_totals
from ..utils.security import get_current_user_from_request

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/calculate', methods=['POST'])
def calculate_order():
    data = request.get_json() or {}
    restaurant_id = data.get('restaurant_id')
    items = data.get('items', [])
    coupon_code = data.get('coupon_code')

    if not restaurant_id or not items:
        return jsonify({'message': 'restaurant_id and items are required.'}), 400

    try:
        calc = calculate_checkout_totals(items, restaurant_id, coupon_code=coupon_code)
        return jsonify({
            'subtotal': float(calc['subtotal']),
            'tax_amount': float(calc['tax_amount']),
            'delivery_fee': float(calc['delivery_fee']),
            'discount_amount': float(calc['discount_amount']),
            'total_amount': float(calc['total_amount']),
            'coupon_applied': calc['coupon'].code if calc['coupon'] else None,
            'items': calc['computed_items']
        }), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': f'Calculation error: {str(e)}'}), 500


@orders_bp.route('', methods=['POST'])
@orders_bp.route('/', methods=['POST'])
@orders_bp.route('/checkout', methods=['POST'])
def create_order():
    data = request.get_json() or {}
    user = get_current_user_from_request()

    user_id = data.get('user_id')
    if user:
        user_id = user.id
    elif not user_id:
        return jsonify({'message': 'Please login to place an order.'}), 401

    restaurant_id = data.get('restaurant_id')
    items = data.get('items', [])
    address = data.get('address') or data.get('delivery_address', '')
    phone = data.get('phone', '')
    coupon_code = data.get('coupon_code')
    payment_method = data.get('payment_method', 'demo_upi')
    notes = data.get('notes', '')

    # If restaurant_id not sent explicitly, infer from first menu item
    if not restaurant_id and items:
        first_item = items[0]
        item_id = first_item.get('id') or first_item.get('menu_item_id')
        from ..models import MenuItem
        m = MenuItem.query.get(item_id)
        if m:
            restaurant_id = m.restaurant_id

    if not restaurant_id:
        return jsonify({'message': 'restaurant_id is required.'}), 400

    if not address or len(address.strip()) < 5:
        return jsonify({'message': 'Please provide a valid delivery address.'}), 400

    if not phone or len(phone.strip()) < 7:
        return jsonify({'message': 'Please provide a valid contact phone number.'}), 400

    if not items:
        return jsonify({'message': 'Your order cart is empty.'}), 400

    try:
        order = execute_atomic_checkout(
            user_id=int(user_id),
            restaurant_id=int(restaurant_id),
            items=items,
            delivery_address=address.strip(),
            phone=phone.strip(),
            payment_method=payment_method,
            coupon_code=coupon_code,
            customer_notes=notes
        )
        return jsonify({
            'message': 'Order placed successfully!',
            'order_id': order.id,
            'order_number': order.order_number,
            'order': order.to_dict()
        }), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': f'Checkout failed: {str(e)}'}), 500


@orders_bp.route('', methods=['GET'])
@orders_bp.route('/', methods=['GET'])
@orders_bp.route('/<int:user_id>', methods=['GET'])
def list_user_orders(user_id=None):
    user = get_current_user_from_request()

    if user and user.role == 'admin' and user_id is None:
        # Admin can view all orders
        orders = Order.query.order_by(Order.created_at.desc()).all()
    else:
        target_uid = user.id if user else user_id
        if not target_uid:
            return jsonify({'message': 'Please login to view orders.'}), 401
        orders = Order.query.filter_by(user_id=target_uid).order_by(Order.created_at.desc()).all()

    return jsonify([o.to_dict() for o in orders]), 200


@orders_bp.route('/<int:order_id>/detail', methods=['GET'])
@orders_bp.route('/detail/<int:order_id>', methods=['GET'])
def get_order_detail(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found.'}), 404

    user = get_current_user_from_request()
    if user and user.role != 'admin' and order.user_id != user.id:
        return jsonify({'message': 'Unauthorized to view this order.'}), 403

    return jsonify(order.to_dict(include_items=True)), 200


@orders_bp.route('/<int:order_id>/cancel', methods=['POST'])
def cancel_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found.'}), 404

    user = get_current_user_from_request()
    if user and user.role != 'admin' and order.user_id != user.id:
        return jsonify({'message': 'Unauthorized to cancel this order.'}), 403

    if order.status not in ('placed', 'confirmed'):
        return jsonify({'message': f"Cannot cancel order in '{order.status}' status."}), 400

    data = request.get_json() or {}
    reason = data.get('reason', 'Customer requested cancellation')

    old_status = order.status
    order.status = 'cancelled'
    order.cancellation_reason = reason

    history = OrderStatusHistory(
        order_id=order.id,
        previous_status=old_status,
        new_status='cancelled',
        changed_by_user_id=user.id if user else order.user_id,
        notes=f"Cancelled: {reason}"
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({'message': 'Order cancelled successfully.', 'order': order.to_dict()}), 200
