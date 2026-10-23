from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from ..models import db, Restaurant, MenuItem, MenuCategory

restaurants_bp = Blueprint('restaurants', __name__)

@restaurants_bp.route('', methods=['GET'])
@restaurants_bp.route('/', methods=['GET'])
def list_restaurants():
    q = request.args.get('q', '').strip()
    cuisine = request.args.get('cuisine', '').strip()
    city = request.args.get('city', '').strip()
    pure_veg = request.args.get('pure_veg')
    sort_by = request.args.get('sort_by', 'rating_desc')

    query = Restaurant.query.filter_by(is_active=True)

    if q:
        query = query.filter(
            or_(
                Restaurant.name.ilike(f'%{q}%'),
                Restaurant.cuisine_type.ilike(f'%{q}%'),
                Restaurant.description.ilike(f'%{q}%')
            )
        )

    if cuisine:
        query = query.filter(Restaurant.cuisine_type.ilike(f'%{cuisine}%'))

    if city:
        query = query.filter(Restaurant.city.ilike(f'%{city}%'))

    if pure_veg is not None and pure_veg.lower() in ('1', 'true', 'yes'):
        query = query.filter_by(is_pure_veg=True)

    if sort_by == 'rating_desc':
        query = query.order_by(Restaurant.rating.desc())
    elif sort_by == 'name_asc':
        query = query.order_by(Restaurant.name.asc())
    elif sort_by == 'delivery_fee':
        query = query.order_by(Restaurant.delivery_fee.asc())
    else:
        query = query.order_by(Restaurant.id.asc())

    restaurants = query.all()
    return jsonify([r.to_dict() for r in restaurants]), 200


@restaurants_bp.route('/<int:restaurant_id>', methods=['GET'])
def get_restaurant_detail(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant or not restaurant.is_active:
        return jsonify({'message': 'Restaurant not found.'}), 404
    return jsonify(restaurant.to_dict(include_menu=True)), 200


@restaurants_bp.route('/<int:restaurant_id>/menu', methods=['GET'])
def get_restaurant_menu(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant or not restaurant.is_active:
        return jsonify({'message': 'Restaurant not found.'}), 404

    # Flat list of items for backward compatibility and category-grouped list
    items = MenuItem.query.filter_by(restaurant_id=restaurant_id, is_available=True).all()
    categories = MenuCategory.query.filter_by(restaurant_id=restaurant_id, is_active=True).order_by(MenuCategory.display_order.asc()).all()

    response_data = [item.to_dict() for item in items]

    # If client requests grouped structure, can supply via ?grouped=true
    if request.args.get('grouped') == 'true':
        grouped = []
        for cat in categories:
            cat_dict = cat.to_dict()
            cat_dict['items'] = [it.to_dict() for it in items if it.category_id == cat.id]
            grouped.append(cat_dict)
        return jsonify(grouped), 200

    return jsonify(response_data), 200


@restaurants_bp.route('/menu-items/<int:item_id>', methods=['GET'])
def get_menu_item_detail(item_id):
    item = MenuItem.query.get(item_id)
    if not item or not item.is_available:
        return jsonify({'message': 'Menu item not found.'}), 404
    return jsonify(item.to_dict(include_options=True)), 200


@restaurants_bp.route('/categories', methods=['GET'])
def get_all_categories():
    categories = MenuCategory.query.filter_by(is_active=True).all()
    # Unique category names
    unique_names = list(set([c.name for c in categories]))
    return jsonify([{'name': name} for name in sorted(unique_names)]), 200
