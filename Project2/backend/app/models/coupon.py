from datetime import datetime
from .base import db

class Coupon(db.Model):
    __tablename__ = 'coupons'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    discount_type = db.Column(db.Enum('percentage', 'fixed'), nullable=False, default='percentage')
    discount_value = db.Column(db.Numeric(10, 2), nullable=False)
    min_order_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    max_discount_amount = db.Column(db.Numeric(10, 2), nullable=True)
    valid_from = db.Column(db.DateTime, nullable=False)
    valid_to = db.Column(db.DateTime, nullable=False)
    usage_limit = db.Column(db.Integer, nullable=False, default=500)
    times_used = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    redemptions = db.relationship('CouponRedemption', backref='coupon', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'title': self.title,
            'description': self.description,
            'discount_type': self.discount_type,
            'discount_value': float(self.discount_value),
            'min_order_amount': float(self.min_order_amount),
            'max_discount_amount': float(self.max_discount_amount) if self.max_discount_amount is not None else None,
            'valid_from': self.valid_from.isoformat() if self.valid_from else None,
            'valid_to': self.valid_to.isoformat() if self.valid_to else None,
            'usage_limit': self.usage_limit,
            'times_used': self.times_used,
            'is_active': self.is_active,
        }


class CouponRedemption(db.Model):
    __tablename__ = 'coupon_redemptions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    coupon_id = db.Column(db.Integer, db.ForeignKey('coupons.id', ondelete='RESTRICT'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    discount_applied = db.Column(db.Numeric(10, 2), nullable=False)
    redeemed_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        db.UniqueConstraint('coupon_id', 'order_id', name='uq_coupon_order'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'coupon_id': self.coupon_id,
            'user_id': self.user_id,
            'order_id': self.order_id,
            'discount_applied': float(self.discount_applied),
            'redeemed_at': self.redeemed_at.isoformat() if self.redeemed_at else None,
        }
