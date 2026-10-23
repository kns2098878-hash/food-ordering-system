from datetime import datetime
from .base import db

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    customization_notes = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    menu_item = db.relationship('MenuItem', lazy=True)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'menu_item_id', name='uq_user_item'),
    )

    def to_dict(self):
        item_dict = self.menu_item.to_dict(include_options=False) if self.menu_item else {}
        return {
            'id': self.id,
            'user_id': self.user_id,
            'menu_item_id': self.menu_item_id,
            'quantity': self.quantity,
            'customization_notes': self.customization_notes,
            'item': item_dict,
            'subtotal': float(item_dict.get('effective_price', 0)) * self.quantity,
        }


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_number = db.Column(db.String(32), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='RESTRICT'), nullable=False, index=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id', ondelete='RESTRICT'), nullable=False, index=True)
    address_id = db.Column(db.Integer, db.ForeignKey('addresses.id', ondelete='SET NULL'), nullable=True)
    delivery_address_text = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(25), nullable=False)
    status = db.Column(
        db.Enum('placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
        nullable=False,
        default='placed',
        index=True
    )
    subtotal = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    tax_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    delivery_fee = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    discount_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    coupon_code = db.Column(db.String(50), nullable=True)
    payment_method = db.Column(
        db.Enum('demo_card', 'demo_upi', 'cash_on_delivery'),
        nullable=False,
        default='demo_upi'
    )
    payment_status = db.Column(
        db.Enum('pending', 'paid', 'failed', 'refunded'),
        nullable=False,
        default='pending'
    )
    customer_notes = db.Column(db.String(255), nullable=True)
    cancellation_reason = db.Column(db.String(255), nullable=True)
    estimated_delivery_at = db.Column(db.DateTime, nullable=True)
    delivered_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    status_history = db.relationship('OrderStatusHistory', backref='order', lazy=True, cascade='all, delete-orphan', order_by='OrderStatusHistory.changed_at.desc()')
    delivery_assignment = db.relationship('DeliveryAssignment', backref='order', uselist=False, lazy=True, cascade='all, delete-orphan')
    payment_record = db.relationship('Payment', backref='order', uselist=False, lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_items=True):
        data = {
            'id': self.id,
            'order_id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'customer_name': self.user.name if self.user else '',
            'customer_email': self.user.email if self.user else '',
            'restaurant_id': self.restaurant_id,
            'restaurant_name': self.restaurant.name if self.restaurant else '',
            'delivery_address_text': self.delivery_address_text,
            'address': self.delivery_address_text,
            'phone': self.phone,
            'status': self.status,
            'subtotal': float(self.subtotal),
            'tax_amount': float(self.tax_amount),
            'delivery_fee': float(self.delivery_fee),
            'discount_amount': float(self.discount_amount),
            'total_amount': float(self.total_amount),
            'coupon_code': self.coupon_code,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'customer_notes': self.customer_notes,
            'cancellation_reason': self.cancellation_reason,
            'order_date': self.created_at.isoformat() if self.created_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if include_items:
            data['items'] = [item.to_dict() for item in self.items]
            data['status_history'] = [h.to_dict() for h in self.status_history]
            if self.delivery_assignment:
                data['delivery'] = self.delivery_assignment.to_dict()
        return data


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id', ondelete='SET NULL'), nullable=True)
    item_name = db.Column(db.String(150), nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    customization_notes = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'menu_item_id': self.menu_item_id,
            'name': self.item_name,
            'item_name': self.item_name,
            'price': float(self.unit_price),
            'unit_price': float(self.unit_price),
            'quantity': self.quantity,
            'subtotal': float(self.subtotal),
            'customization_notes': self.customization_notes,
        }


class OrderStatusHistory(db.Model):
    __tablename__ = 'order_status_history'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
    previous_status = db.Column(db.String(40), nullable=True)
    new_status = db.Column(db.String(40), nullable=False)
    changed_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    notes = db.Column(db.String(255), nullable=True)
    changed_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'previous_status': self.previous_status,
            'new_status': self.new_status,
            'notes': self.notes,
            'changed_at': self.changed_at.isoformat() if self.changed_at else None,
        }


class DeliveryAssignment(db.Model):
    __tablename__ = 'delivery_assignments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
    driver_name = db.Column(db.String(100), nullable=False)
    driver_phone = db.Column(db.String(25), nullable=False)
    vehicle_number = db.Column(db.String(30), nullable=True)
    status = db.Column(db.Enum('assigned', 'picked_up', 'delivered'), nullable=False, default='assigned')
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    picked_up_at = db.Column(db.DateTime, nullable=True)
    delivered_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'driver_name': self.driver_name,
            'driver_phone': self.driver_phone,
            'vehicle_number': self.vehicle_number,
            'status': self.status,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None,
        }
