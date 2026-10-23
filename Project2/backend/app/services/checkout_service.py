import random
from datetime import datetime, timezone
from decimal import Decimal
from ..models import (
    db, Order, OrderItem, OrderStatusHistory, MenuItem, Restaurant,
    Coupon, CouponRedemption, Payment, CartItem, UserWallet, WalletTransaction,
    LoyaltyAccount
)

def calculate_checkout_totals(items, restaurant_id, coupon_code=None, user_id=None):
    """
    Secure server-side price computation.
    Validates items, fetches real database prices, calculates subtotal,
    tax (5%), delivery fee, and applies verified coupon discount.
    """
    restaurant = db.session.get(Restaurant, restaurant_id)
    if not restaurant or not restaurant.is_active:
        raise ValueError("Selected restaurant is invalid or currently inactive.")

    if not items:
        raise ValueError("Cannot checkout with an empty items list.")

    computed_items = []
    subtotal = Decimal('0.00')

    for entry in items:
        item_id = entry.get('id') or entry.get('menu_item_id')
        qty = int(entry.get('quantity', 1))
        if qty <= 0:
            continue

        menu_item = db.session.get(MenuItem, item_id)
        if not menu_item or not menu_item.is_available:
            raise ValueError(f"Menu item ID {item_id} is unavailable.")

        if menu_item.restaurant_id != restaurant.id:
            raise ValueError(f"Item '{menu_item.name}' does not belong to '{restaurant.name}'.")

        # Use effective price: discount price if available, else regular price
        unit_price = Decimal(str(menu_item.discount_price if menu_item.discount_price is not None else menu_item.price))
        line_total = unit_price * qty
        subtotal += line_total

        computed_items.append({
            'menu_item_id': menu_item.id,
            'item_name': menu_item.name,
            'unit_price': unit_price,
            'quantity': qty,
            'subtotal': line_total,
            'notes': entry.get('notes') or entry.get('customization_notes') or ''
        })

    if not computed_items:
        raise ValueError("No valid items in the cart.")

    # Delivery Fee & Tax (5% GST)
    delivery_fee = Decimal(str(restaurant.delivery_fee or 30.00))
    tax_amount = (subtotal * Decimal('0.05')).quantize(Decimal('0.01'))

    # Coupon validation
    discount_amount = Decimal('0.00')
    applied_coupon = None

    if coupon_code:
        coupon = Coupon.query.filter_by(code=coupon_code.strip().upper(), is_active=True).first()
        now = datetime.now()
        if coupon and coupon.valid_from <= now <= coupon.valid_to:
            if subtotal >= Decimal(str(coupon.min_order_amount)):
                if coupon.times_used < coupon.usage_limit:
                    if coupon.discount_type == 'percentage':
                        calc_discount = (subtotal * (Decimal(str(coupon.discount_value)) / Decimal('100.00'))).quantize(Decimal('0.01'))
                        if coupon.max_discount_amount:
                            calc_discount = min(calc_discount, Decimal(str(coupon.max_discount_amount)))
                        discount_amount = calc_discount
                    else:
                        discount_amount = Decimal(str(coupon.discount_value))
                    applied_coupon = coupon

    total_amount = max(Decimal('0.00'), (subtotal + tax_amount + delivery_fee - discount_amount).quantize(Decimal('0.01')))

    return {
        'restaurant': restaurant,
        'computed_items': computed_items,
        'subtotal': subtotal,
        'tax_amount': tax_amount,
        'delivery_fee': delivery_fee,
        'discount_amount': discount_amount,
        'total_amount': total_amount,
        'coupon': applied_coupon
    }


def execute_atomic_checkout(user_id, restaurant_id, items, delivery_address, phone, payment_method='demo_upi', coupon_code=None, customer_notes=''):
    """
    ACID Transaction execution for placing an order:
    1. Re-computes and verifies all prices on backend
    2. Supports Wallet debit with balance checks
    3. Generates unique order number
    4. Saves Order and OrderItem records
    5. Records CouponRedemption if coupon used
    6. Records initial Payment
    7. Accrues Loyalty points
    8. Clears persistent cart
    """
    calc = calculate_checkout_totals(items, restaurant_id, coupon_code=coupon_code, user_id=user_id)
    total_due = calc['total_amount']

    order_num = f"ORD-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"

    try:
        # If paying with wallet, check balance and deduct
        if payment_method == 'wallet':
            wallet = UserWallet.query.filter_by(user_id=user_id).with_for_update().first()
            if not wallet:
                raise ValueError("Active digital wallet not found for user.")
            if wallet.balance < total_due:
                raise ValueError(f"Insufficient wallet balance (Available: Rs {wallet.balance}, Required: Rs {total_due}). Please top up your wallet or select another payment method.")
            
            wallet.balance -= total_due
            wallet_tx = WalletTransaction(
                wallet_id=wallet.id,
                user_id=user_id,
                transaction_type='debit',
                amount=total_due,
                balance_after=wallet.balance,
                reference_type='order_payment',
                description=f'Payment for Order {order_num}'
            )
            db.session.add(wallet_tx)

        new_order = Order(
            order_number=order_num,
            user_id=user_id,
            restaurant_id=restaurant_id,
            delivery_address_text=delivery_address,
            phone=phone,
            status='placed',
            subtotal=calc['subtotal'],
            tax_amount=calc['tax_amount'],
            delivery_fee=calc['delivery_fee'],
            discount_amount=calc['discount_amount'],
            total_amount=total_due,
            coupon_code=calc['coupon'].code if calc['coupon'] else None,
            payment_method=payment_method,
            payment_status='paid',
            customer_notes=customer_notes,
            created_at=datetime.utcnow()
        )
        db.session.add(new_order)
        db.session.flush()  # assign new_order.id

        # Insert items
        for ci in calc['computed_items']:
            order_item = OrderItem(
                order_id=new_order.id,
                menu_item_id=ci['menu_item_id'],
                item_name=ci['item_name'],
                unit_price=ci['unit_price'],
                quantity=ci['quantity'],
                subtotal=ci['subtotal'],
                customization_notes=ci['notes']
            )
            db.session.add(order_item)

        # Coupon redemption
        if calc['coupon']:
            calc['coupon'].times_used += 1
            redemption = CouponRedemption(
                coupon_id=calc['coupon'].id,
                user_id=user_id,
                order_id=new_order.id,
                discount_applied=calc['discount_amount']
            )
            db.session.add(redemption)

        # Status History
        status_log = OrderStatusHistory(
            order_id=new_order.id,
            previous_status=None,
            new_status='placed',
            changed_by_user_id=user_id,
            notes='Order placed and verified by checkout engine'
        )
        db.session.add(status_log)

        # Payment Record
        txn_ref = f"TXN-{'WLT' if payment_method == 'wallet' else 'DEMO'}-{random.randint(100000000, 999999999)}"
        payment = Payment(
            order_id=new_order.id,
            transaction_ref=txn_ref,
            payment_method=payment_method,
            amount=total_due,
            currency='INR',
            status='completed',
            payment_gateway_response='{"status":"SUCCESS","mode":"internal_wallet"}' if payment_method == 'wallet' else '{"status":"SUCCESS","mode":"demo_gateway"}'
        )
        db.session.add(payment)

        # Accrue Loyalty points (1 point per Rs 10 spent)
        loyalty = LoyaltyAccount.query.filter_by(user_id=user_id).first()
        if loyalty:
            multiplier = Decimal(str(loyalty.tier.points_multiplier if loyalty.tier else 1.00))
            points_earned = int((total_due / Decimal('10.00')) * multiplier)
            if points_earned > 0:
                loyalty.current_points += points_earned
                loyalty.lifetime_points += points_earned
                loyalty.lifetime_spent += total_due

        # Clear cart items for this user
        CartItem.query.filter_by(user_id=user_id).delete()

        db.session.commit()
        return new_order
    except Exception as e:
        db.session.rollback()
        raise e
