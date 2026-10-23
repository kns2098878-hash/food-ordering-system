from flask import Blueprint, request, jsonify
from datetime import datetime
from ..models import db, Review, Favorite, Restaurant, Order
from ..utils.security import get_current_user_from_request

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/restaurants/<int:restaurant_id>/reviews', methods=['GET'])
def get_restaurant_reviews(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({'message': 'Restaurant not found.'}), 404

    reviews = Review.query.filter_by(restaurant_id=restaurant_id).order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews]), 200


@reviews_bp.route('/restaurants/<int:restaurant_id>/reviews', methods=['POST'])
def add_restaurant_review(restaurant_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Please login to leave a review.'}), 401

    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({'message': 'Restaurant not found.'}), 404

    data = request.get_json() or {}
    rating = data.get('rating')
    comment = data.get('comment', '').strip()
    order_id = data.get('order_id')

    if not rating or not (1 <= int(rating) <= 5):
        return jsonify({'message': 'Rating must be an integer between 1 and 5.'}), 400

    review = Review(
        user_id=user.id,
        restaurant_id=restaurant_id,
        order_id=int(order_id) if order_id else None,
        rating=int(rating),
        comment=comment,
        created_at=datetime.utcnow()
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({'message': 'Review submitted successfully!', 'review': review.to_dict()}), 201


@reviews_bp.route('/favorites', methods=['GET'])
def get_user_favorites():
    user = get_current_user_from_request()
    if not user:
        return jsonify([]), 200

    favs = Favorite.query.filter_by(user_id=user.id).all()
    return jsonify([f.to_dict() for f in favs]), 200


@reviews_bp.route('/favorites', methods=['POST'])
def add_favorite():
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Please login to add favorites.'}), 401

    data = request.get_json() or {}
    restaurant_id = data.get('restaurant_id')
    if not restaurant_id:
        return jsonify({'message': 'restaurant_id is required.'}), 400

    existing = Favorite.query.filter_by(user_id=user.id, restaurant_id=restaurant_id).first()
    if not existing:
        fav = Favorite(user_id=user.id, restaurant_id=restaurant_id)
        db.session.add(fav)
        db.session.commit()
        return jsonify({'message': 'Added to favorites.', 'favorite': fav.to_dict()}), 201

    return jsonify({'message': 'Already in favorites.', 'favorite': existing.to_dict()}), 200


@reviews_bp.route('/favorites/<int:restaurant_id>', methods=['DELETE'])
def remove_favorite(restaurant_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({'message': 'Please login.'}), 401

    fav = Favorite.query.filter_by(user_id=user.id, restaurant_id=restaurant_id).first()
    if fav:
        db.session.delete(fav)
        db.session.commit()
        return jsonify({'message': 'Removed from favorites.'}), 200

    return jsonify({'message': 'Favorite record not found.'}), 404
