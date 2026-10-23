from flask import Blueprint, request, jsonify
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import func
from ..models import (
    db, User, Restaurant, MenuItem, MenuCategory, Order, OrderItem,
    OrderStatusHistory, Reservation, ReservationStatusHistory, Coupon, AuditLog
)
from ..utils.security import role_required, get_current_user_from_request

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard_metrics():
    user = get_current_user_from_request()
    if not user or user.role != 'admin':
        return jsonify({'message': 'Access denied: Admin credentials required.'}), 403

    total_customers = User.query.filter_by(role='customer').count()
    total_restaurants = Restaurant.query.count()
    total_orders = Order.query.count()
    total_reservations = Reservation.query.count()

    total_rev_query = db.session.query(func.coalesce(func.sum(Order.total_amount), 0.00)).filter(
        Order.status != 'cancelled'
    ).scalar()
    total_revenue = float(total_rev_query or 0.0)

    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(8).all()
    recent_reservations = Reservation.query.order_by(Reservation.created_at.desc()).limit(8).all()

    # Popular items aggregation
    popular_items = db.session.query(
        MenuItem.name,
        Restaurant.name.label('restaurant_name'),
        func.sum(OrderItem.quantity).label('units_sold'),
        func.sum(OrderItem.subtotal).label('sales_revenue')
    ).join(OrderItem, MenuItem.id == OrderItem.menu_item_id)\
     .join(Restaurant, MenuItem.restaurant_id == Restaurant.id)\
     .group_by(MenuItem.id, MenuItem.name, Restaurant.name)\
     .order_by(func.sum(OrderItem.quantity).desc())\
     .limit(5).all()

    popular_list = [{
        'name': item.name,
        'restaurant': item.restaurant_name,
        'units_sold': int(item.units_sold),
        'revenue': float(item.sales_revenue)
    } for item in popular_items]

    # Daily sales for chart
    daily_sales = db.session.query(
        func.date(Order.created_at).label('order_day'),
        func.count(Order.id).label('order_count'),
        func.sum(Order.total_amount).label('day_revenue')
    ).filter(Order.status != 'cancelled')\
     .group_by(func.date(Order.created_at))\
     .order_by(func.date(Order.created_at).asc())\
     .limit(10).all()

    sales_chart = [{
        'date': str(ds.order_day),
        'orders': int(ds.order_count),
        'revenue': float(ds.day_revenue)
    } for ds in daily_sales]

    return jsonify({
        'summary': {
            'total_customers': total_customers,
            'total_restaurants': total_restaurants,
            'total_orders': total_orders,
            'total_reservations': total_reservations,
            'total_revenue': total_revenue,
        },
        'popular_items': popular_list,
        'sales_chart': sales_chart,
        'recent_orders': [o.to_dict() for o in recent_orders],
        'recent_reservations': [r.to_dict() for r in recent_reservations],
    }), 200


@admin_bp.route('/orders', methods=['GET'])
def get_admin_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict(include_items=True) for o in orders]), 200


@admin_bp.route('/orders/<int:order_id>/status', methods=['PATCH', 'PUT'])
def update_order_status(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found.'}), 404

    data = request.get_json() or {}
    new_status = data.get('status')
    notes = data.get('notes', 'Status updated by administrator')

    valid_statuses = ('placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')
    if new_status not in valid_statuses:
        return jsonify({'message': f"Invalid status. Must be one of {valid_statuses}"}), 400

    old_status = order.status
    order.status = new_status
    if new_status == 'delivered':
        order.delivered_at = datetime.utcnow()

    user = get_current_user_from_request()
    history = OrderStatusHistory(
        order_id=order.id,
        previous_status=old_status,
        new_status=new_status,
        changed_by_user_id=user.id if user else None,
        notes=notes
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({'message': 'Order status updated successfully.', 'order': order.to_dict()}), 200


@admin_bp.route('/reservations', methods=['GET'])
def get_admin_reservations():
    reservations = Reservation.query.order_by(Reservation.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reservations]), 200


@admin_bp.route('/reservations/<int:reservation_id>/status', methods=['PATCH', 'PUT'])
def update_reservation_status(reservation_id):
    res = Reservation.query.get(reservation_id)
    if not res:
        return jsonify({'message': 'Reservation not found.'}), 404

    data = request.get_json() or {}
    new_status = data.get('status')
    notes = data.get('notes', 'Status updated by host')

    valid_statuses = ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')
    if new_status not in valid_statuses:
        return jsonify({'message': f"Invalid status. Must be one of {valid_statuses}"}), 400

    old_status = res.status
    res.status = new_status

    user = get_current_user_from_request()
    history = ReservationStatusHistory(
        reservation_id=res.id,
        previous_status=old_status,
        new_status=new_status,
        changed_by_user_id=user.id if user else None,
        notes=notes
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({'message': 'Reservation status updated successfully.', 'reservation': res.to_dict()}), 200


@admin_bp.route('/restaurants', methods=['POST'])
def create_restaurant():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    cuisine = data.get('cuisine_type', 'Multi-Cuisine').strip()
    address = data.get('address', '').strip()
    phone = data.get('phone', '').strip()

    if not name or not address or not phone:
        return jsonify({'message': 'Name, address, and phone are required.'}), 400

    slug = name.lower().replace(' ', '-').replace('&', 'and') + f"-{int(datetime.utcnow().timestamp())}"
    rest = Restaurant(
        name=name,
        slug=slug,
        tagline=data.get('tagline', 'Delicious Dining Experience'),
        description=data.get('description', ''),
        cuisine_type=cuisine,
        address=address,
        city=data.get('city', 'Chennai'),
        phone=phone,
        email=data.get('email', ''),
        image_url=data.get('image_url') or 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        rating=4.5,
        rating_count=0,
        price_tier=data.get('price_tier', '$$'),
        delivery_fee=data.get('delivery_fee', 30.00),
        estimated_delivery_time=data.get('estimated_delivery_time', '30-40 mins'),
        is_pure_veg=bool(data.get('is_pure_veg', False)),
        is_active=True
    )
    db.session.add(rest)
    db.session.commit()

    return jsonify({'message': 'Restaurant created successfully!', 'restaurant': rest.to_dict()}), 201


@admin_bp.route('/restaurants/<int:restaurant_id>', methods=['PUT', 'PATCH'])
def update_restaurant(restaurant_id):
    rest = Restaurant.query.get(restaurant_id)
    if not rest:
        return jsonify({'message': 'Restaurant not found.'}), 404

    data = request.get_json() or {}
    for field in ['name', 'tagline', 'description', 'cuisine_type', 'address', 'city', 'phone', 'email', 'image_url', 'price_tier', 'estimated_delivery_time']:
        if field in data:
            setattr(rest, field, data[field])

    if 'delivery_fee' in data:
        rest.delivery_fee = Decimal(str(data['delivery_fee']))
    if 'is_pure_veg' in data:
        rest.is_pure_veg = bool(data['is_pure_veg'])
    if 'is_active' in data:
        rest.is_active = bool(data['is_active'])

    db.session.commit()
    return jsonify({'message': 'Restaurant updated successfully!', 'restaurant': rest.to_dict()}), 200


@admin_bp.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):
    rest = Restaurant.query.get(restaurant_id)
    if not rest:
        return jsonify({'message': 'Restaurant not found.'}), 404

    db.session.delete(rest)
    db.session.commit()
    return jsonify({'message': 'Restaurant deleted successfully.'}), 200


@admin_bp.route('/menu-items', methods=['POST'])
def create_menu_item():
    data = request.get_json() or {}
    restaurant_id = data.get('restaurant_id')
    name = data.get('name', '').strip()
    price = data.get('price')

    if not restaurant_id or not name or price is None:
        return jsonify({'message': 'restaurant_id, name, and price are required.'}), 400

    # Ensure category exists or default to first category
    category_id = data.get('category_id')
    if not category_id:
        first_cat = MenuCategory.query.filter_by(restaurant_id=restaurant_id).first()
        if not first_cat:
            first_cat = MenuCategory(restaurant_id=restaurant_id, name='Main Specialties', display_order=1)
            db.session.add(first_cat)
            db.session.flush()
        category_id = first_cat.id

    item = MenuItem(
        restaurant_id=restaurant_id,
        category_id=category_id,
        name=name,
        description=data.get('description', ''),
        price=Decimal(str(price)),
        discount_price=Decimal(str(data['discount_price'])) if data.get('discount_price') else None,
        image_url=data.get('image_url') or 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
        is_vegetarian=bool(data.get('is_vegetarian', False)),
        is_spicy=bool(data.get('is_spicy', False)),
        is_popular=bool(data.get('is_popular', False)),
        is_available=bool(data.get('is_available', True))
    )
    db.session.add(item)
    db.session.commit()

    return jsonify({'message': 'Menu item created successfully!', 'item': item.to_dict()}), 201


@admin_bp.route('/menu-items/<int:item_id>', methods=['PUT', 'PATCH'])
def update_menu_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({'message': 'Menu item not found.'}), 404

    data = request.get_json() or {}
    for field in ['name', 'description', 'image_url']:
        if field in data:
            setattr(item, field, data[field])

    if 'price' in data:
        item.price = Decimal(str(data['price']))
    if 'discount_price' in data:
        item.discount_price = Decimal(str(data['discount_price'])) if data['discount_price'] else None
    if 'is_vegetarian' in data:
        item.is_vegetarian = bool(data['is_vegetarian'])
    if 'is_spicy' in data:
        item.is_spicy = bool(data['is_spicy'])
    if 'is_popular' in data:
        item.is_popular = bool(data['is_popular'])
    if 'is_available' in data:
        item.is_available = bool(data['is_available'])

    db.session.commit()
    return jsonify({'message': 'Menu item updated successfully!', 'item': item.to_dict()}), 200


@admin_bp.route('/menu-items/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({'message': 'Menu item not found.'}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Menu item deleted successfully.'}), 200


@admin_bp.route('/coupons', methods=['POST'])
def create_coupon():
    data = request.get_json() or {}
    code = data.get('code', '').strip().upper()
    title = data.get('title', '').strip()
    discount_val = data.get('discount_value')

    if not code or not title or discount_val is None:
        return jsonify({'message': 'code, title, and discount_value are required.'}), 400

    coupon = Coupon(
        code=code,
        title=title,
        description=data.get('description', ''),
        discount_type=data.get('discount_type', 'percentage'),
        discount_value=Decimal(str(discount_val)),
        min_order_amount=Decimal(str(data.get('min_order_amount', 0))),
        max_discount_amount=Decimal(str(data['max_discount_amount'])) if data.get('max_discount_amount') else None,
        valid_from=datetime.utcnow(),
        valid_to=datetime(2028, 12, 31),
        usage_limit=int(data.get('usage_limit', 500)),
        is_active=True
    )
    db.session.add(coupon)
    db.session.commit()

    return jsonify({'message': 'Coupon created successfully!', 'coupon': coupon.to_dict()}), 201


@admin_bp.route('/audit-logs', methods=['GET'])
def get_audit_logs():
    logs = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(50).all()
    return jsonify([l.to_dict() for l in logs]), 200
