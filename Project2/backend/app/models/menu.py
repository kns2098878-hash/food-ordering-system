from datetime import datetime
from .base import db

class MenuCategory(db.Model):
    __tablename__ = 'menu_categories'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    display_order = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    items = db.relationship('MenuItem', backref='category', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_items=False):
        data = {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'name': self.name,
            'description': self.description,
            'display_order': self.display_order,
            'is_active': self.is_active,
        }
        if include_items:
            data['items'] = [item.to_dict() for item in self.items if item.is_available]
        return data


class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id', ondelete='CASCADE'), nullable=False, index=True)
    category_id = db.Column(db.Integer, db.ForeignKey('menu_categories.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    discount_price = db.Column(db.Numeric(10, 2), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    is_vegetarian = db.Column(db.Boolean, nullable=False, default=False)
    is_spicy = db.Column(db.Boolean, nullable=False, default=False)
    is_popular = db.Column(db.Boolean, nullable=False, default=False)
    is_available = db.Column(db.Boolean, nullable=False, default=True, index=True)
    preparation_time = db.Column(db.Integer, nullable=False, default=20)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    options = db.relationship('MenuItemOption', backref='menu_item', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_options=True):
        data = {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else '',
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'discount_price': float(self.discount_price) if self.discount_price is not None else None,
            'effective_price': float(self.discount_price if self.discount_price is not None else self.price),
            'image_url': self.image_url,
            'is_vegetarian': self.is_vegetarian,
            'is_spicy': self.is_spicy,
            'is_popular': self.is_popular,
            'is_available': self.is_available,
            'preparation_time': self.preparation_time,
        }
        if include_options:
            data['options'] = [opt.to_dict() for opt in self.options]
        return data


class MenuItemOption(db.Model):
    __tablename__ = 'menu_item_options'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id', ondelete='CASCADE'), nullable=False, index=True)
    group_name = db.Column(db.String(80), nullable=False, default='Add-ons')
    name = db.Column(db.String(100), nullable=False)
    price_adjustment = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    is_default = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'menu_item_id': self.menu_item_id,
            'group_name': self.group_name,
            'name': self.name,
            'price_adjustment': float(self.price_adjustment),
            'is_default': self.is_default,
        }
