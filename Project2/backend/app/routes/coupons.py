from flask import Blueprint, request, jsonify
from datetime import datetime
from decimal import Decimal
from ..models import Coupon

coupons_bp = Blueprint('coupons', __name__)

@coupons_bp.route('', methods=['GET'])
@coupons_bp.route('/', methods=['GET'])
def list_active_coupons():
    now = datetime.now()
    coupons = Coupon.query.filter_by(is_active=True).filter(
        Coupon.valid_from <= now,
        Coupon.valid_to >= now
    ).all()
    return jsonify([c.to_dict() for c in coupons]), 200


@coupons_bp.route('/validate', methods=['POST'])
def validate_coupon():
    data = request.get_json() or {}
    code = data.get('code', '').strip().upper()
    subtotal = Decimal(str(data.get('subtotal', 0)))

    if not code:
        return jsonify({'message': 'Coupon code is required.'}), 400

    now = datetime.now()
    coupon = Coupon.query.filter_by(code=code, is_active=True).first()

    if not coupon or not (coupon.valid_from <= now <= coupon.valid_to):
        return jsonify({'valid': False, 'message': 'Invalid or expired coupon code.'}), 400

    if coupon.times_used >= coupon.usage_limit:
        return jsonify({'valid': False, 'message': 'This coupon has reached its maximum usage limit.'}), 400

    if subtotal < Decimal(str(coupon.min_order_amount)):
        return jsonify({
            'valid': False,
            'message': f"Minimum order amount of ₹{coupon.min_order_amount} required for this coupon."
        }), 400

    if coupon.discount_type == 'percentage':
        discount = (subtotal * (Decimal(str(coupon.discount_value)) / Decimal('100.00'))).quantize(Decimal('0.01'))
        if coupon.max_discount_amount:
            discount = min(discount, Decimal(str(coupon.max_discount_amount)))
    else:
        discount = Decimal(str(coupon.discount_value))

    return jsonify({
        'valid': True,
        'code': coupon.code,
        'discount_type': coupon.discount_type,
        'discount_amount': float(discount),
        'message': f"Coupon '{coupon.code}' applied successfully!"
    }), 200
