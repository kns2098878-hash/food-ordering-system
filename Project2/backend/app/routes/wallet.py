from decimal import Decimal
from flask import Blueprint, jsonify, request
from ..models import db, UserWallet, WalletTransaction, LoyaltyAccount, LoyaltyTier, DietaryTag, Order
from ..utils.security import token_required

wallet_bp = Blueprint('wallet', __name__)

@wallet_bp.route('/wallet', methods=['GET'])
@token_required
def get_user_wallet(current_user):
    """Retrieve the authenticated user's wallet details and recent transactions."""
    wallet = UserWallet.query.filter_by(user_id=current_user.id).first()
    if not wallet:
        wallet = UserWallet(user_id=current_user.id, balance=Decimal('500.00'), currency='INR')
        db.session.add(wallet)
        db.session.commit()
        # Add welcome transaction
        tx = WalletTransaction(
            wallet_id=wallet.id,
            user_id=current_user.id,
            transaction_type='credit',
            amount=Decimal('500.00'),
            balance_after=Decimal('500.00'),
            reference_type='welcome_bonus',
            description='Foodie Welcome Bonus Credit'
        )
        db.session.add(tx)
        db.session.commit()

    txs = WalletTransaction.query.filter_by(user_id=current_user.id).order_by(WalletTransaction.created_at.desc()).limit(20).all()

    return jsonify({
        'wallet': wallet.to_dict(),
        'transactions': [t.to_dict() for t in txs]
    }), 200

@wallet_bp.route('/wallet/topup', methods=['POST'])
@token_required
def topup_wallet(current_user):
    """Top-up simulated funds into user's digital wallet."""
    data = request.get_json() or {}
    amount = Decimal(str(data.get('amount', '500.00')))
    if amount <= 0 or amount > 10000:
        return jsonify({'message': 'Invalid top-up amount. Must be between Rs 1 and Rs 10,000.'}), 400

    wallet = UserWallet.query.filter_by(user_id=current_user.id).first()
    if not wallet:
        wallet = UserWallet(user_id=current_user.id, balance=Decimal('0.00'))
        db.session.add(wallet)
        db.session.flush()

    new_balance = wallet.balance + amount
    wallet.balance = new_balance

    tx = WalletTransaction(
        wallet_id=wallet.id,
        user_id=current_user.id,
        transaction_type='credit',
        amount=amount,
        balance_after=new_balance,
        reference_type='user_topup',
        description=f'Self Top-Up via UPI/Card (Demo)'
    )
    db.session.add(tx)
    db.session.commit()

    return jsonify({
        'message': f'Successfully topped up Rs {amount:.2f}!',
        'wallet': wallet.to_dict(),
        'transaction': tx.to_dict()
    }), 200

@wallet_bp.route('/loyalty', methods=['GET'])
@token_required
def get_loyalty_status(current_user):
    """Retrieve user loyalty tier status, points balance, and progression."""
    account = LoyaltyAccount.query.filter_by(user_id=current_user.id).first()
    if not account:
        account = LoyaltyAccount(user_id=current_user.id, tier_id=1, current_points=100, lifetime_points=100, lifetime_spent=Decimal('0.00'))
        db.session.add(account)
        db.session.commit()

    all_tiers = LoyaltyTier.query.order_by(LoyaltyTier.min_spend.asc()).all()
    current_tier = account.tier or all_tiers[0]

    # Calculate next tier progress
    next_tier = None
    spend_needed = Decimal('0.00')
    progress_percentage = 100
    for t in all_tiers:
        if t.min_spend > current_tier.min_spend:
            next_tier = t
            spend_needed = max(Decimal('0.00'), t.min_spend - account.lifetime_spent)
            if t.min_spend > current_tier.min_spend:
                denominator = (t.min_spend - current_tier.min_spend)
                if denominator > 0:
                    progress_percentage = min(100, int(((account.lifetime_spent - current_tier.min_spend) / denominator) * 100))
            break

    return jsonify({
        'account': account.to_dict(),
        'current_tier': current_tier.to_dict(),
        'next_tier': next_tier.to_dict() if next_tier else None,
        'spend_needed_for_next_tier': float(spend_needed),
        'progress_percentage': max(0, progress_percentage),
        'all_tiers': [t.to_dict() for t in all_tiers]
    }), 200

@wallet_bp.route('/dietary-tags', methods=['GET'])
def get_dietary_tags():
    """Retrieve list of dietary tags for filtering menus."""
    tags = DietaryTag.query.all()
    return jsonify([t.to_dict() for t in tags]), 200

@wallet_bp.route('/orders/<int:order_id>/track', methods=['GET'])
@token_required
def get_order_tracking(current_user, order_id):
    """Real-time order delivery tracker simulation."""
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    # Security check
    if order.user_id != current_user.id and current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403

    # Simulation stages
    status_steps = [
        {'key': 'placed', 'label': 'Order Received', 'description': 'The restaurant has received your order.', 'completed': True},
        {'key': 'confirmed', 'label': 'Order Accepted', 'description': 'Restaurant kitchen has confirmed your order.', 'completed': order.status in ['confirmed', 'preparing', 'out_for_delivery', 'delivered']},
        {'key': 'preparing', 'label': 'In The Kitchen', 'description': 'Master chef is preparing your dishes with fresh ingredients.', 'completed': order.status in ['preparing', 'out_for_delivery', 'delivered']},
        {'key': 'out_for_delivery', 'label': 'Out For Delivery', 'description': 'Delivery partner is on the way to your doorstep.', 'completed': order.status in ['out_for_delivery', 'delivered']},
        {'key': 'delivered', 'label': 'Delivered', 'description': 'Package delivered. Enjoy your meal!', 'completed': order.status == 'delivered'}
    ]

    return jsonify({
        'order_id': order.id,
        'order_number': order.order_number,
        'current_status': order.status,
        'estimated_minutes': 18 if order.status == 'out_for_delivery' else (30 if order.status in ['placed', 'confirmed', 'preparing'] else 0),
        'delivery_partner': {
            'name': 'Praveen Das (Super Rider)',
            'phone': '+91 98402 91823',
            'vehicle': 'TVS Jupiter (TN-10-DE-5541)',
            'rating': 4.9
        },
        'coordinates': {
            'restaurant_lat': 13.0418,
            'restaurant_lng': 80.2341,
            'partner_lat': 13.0435 if order.status == 'out_for_delivery' else 13.0418,
            'partner_lng': 80.2372 if order.status == 'out_for_delivery' else 80.2341,
            'customer_lat': 13.0450,
            'customer_lng': 80.2400
        },
        'timeline': status_steps
    }), 200
