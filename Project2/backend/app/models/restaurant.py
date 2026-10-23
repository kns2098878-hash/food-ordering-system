from datetime import datetime
from .base import db

class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    name = db.Column(db.String(150), nullable=False)
    slug = db.Column(db.String(160), unique=True, nullable=False)
    tagline = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    cuisine_type = db.Column(db.String(120), nullable=False, default='Multi-Cuisine', index=True)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False, default='Chennai', index=True)
    phone = db.Column(db.String(25), nullable=False)
    email = db.Column(db.String(150), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    banner_url = db.Column(db.String(500), nullable=True)
    rating = db.Column(db.Numeric(3, 2), nullable=False, default=4.50, index=True)
    rating_count = db.Column(db.Integer, nullable=False, default=0)
    price_tier = db.Column(db.Enum('$', '$$', '$$$', '$$$$'), nullable=False, default='$$')
    delivery_fee = db.Column(db.Numeric(10, 2), nullable=False, default=30.00)
    estimated_delivery_time = db.Column(db.String(30), nullable=False, default='30-45 mins')
    is_pure_veg = db.Column(db.Boolean, nullable=False, default=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    categories = db.relationship('MenuCategory', backref='restaurant', lazy=True, cascade='all, delete-orphan', order_by='MenuCategory.display_order')
    menu_items = db.relationship('MenuItem', backref='restaurant', lazy=True, cascade='all, delete-orphan')
    tables = db.relationship('RestaurantTable', backref='restaurant', lazy=True, cascade='all, delete-orphan')
    operating_hours = db.relationship('RestaurantHours', backref='restaurant', lazy=True, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='restaurant', lazy=True)
    reservations = db.relationship('Reservation', backref='restaurant', lazy=True)
    reviews = db.relationship('Review', backref='restaurant', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_menu=False):
        data = {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'slug': self.slug,
            'tagline': self.tagline,
            'description': self.description,
            'cuisine_type': self.cuisine_type,
            'address': self.address,
            'city': self.city,
            'phone': self.phone,
            'email': self.email,
            'image_url': self.image_url,
            'banner_url': self.banner_url,
            'rating': float(self.rating) if self.rating is not None else 0.0,
            'rating_count': self.rating_count,
            'price_tier': self.price_tier,
            'delivery_fee': float(self.delivery_fee) if self.delivery_fee is not None else 0.0,
            'estimated_delivery_time': self.estimated_delivery_time,
            'is_pure_veg': self.is_pure_veg,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if include_menu:
            data['categories'] = [c.to_dict(include_items=True) for c in self.categories if c.is_active]
        return data


class RestaurantHours(db.Model):
    __tablename__ = 'restaurant_hours'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id', ondelete='CASCADE'), nullable=False)
    day_of_week = db.Column(db.SmallInteger, nullable=False)  # 0=Sunday, 6=Saturday
    opening_time = db.Column(db.Time, nullable=False)
    closing_time = db.Column(db.Time, nullable=False)
    is_closed = db.Column(db.Boolean, default=False, nullable=False)

    __table_args__ = (
        db.UniqueConstraint('restaurant_id', 'day_of_week', name='uq_restaurant_day'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'day_of_week': self.day_of_week,
            'opening_time': str(self.opening_time),
            'closing_time': str(self.closing_time),
            'is_closed': self.is_closed,
        }


class RestaurantTable(db.Model):
    __tablename__ = 'restaurant_tables'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id', ondelete='CASCADE'), nullable=False)
    table_number = db.Column(db.Integer, nullable=False)
    table_name = db.Column(db.String(60), nullable=False)
    capacity = db.Column(db.Integer, nullable=False, default=4)
    section = db.Column(db.Enum('indoor', 'patio', 'rooftop', 'vip'), nullable=False, default='indoor')
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    __table_args__ = (
        db.UniqueConstraint('restaurant_id', 'table_number', name='uq_table_per_restaurant'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'table_id': self.id,
            'restaurant_id': self.restaurant_id,
            'table_number': self.table_number,
            'table_name': self.table_name,
            'capacity': self.capacity,
            'section': self.section,
            'is_active': self.is_active,
        }
