from datetime import datetime
from .base import db

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False, index=True)
    transaction_ref = db.Column(db.String(64), unique=True, nullable=False, index=True)
    payment_method = db.Column(db.Enum('demo_card', 'demo_upi', 'cash_on_delivery'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(10), nullable=False, default='INR')
    status = db.Column(db.Enum('initiated', 'completed', 'failed', 'refunded'), nullable=False, default='completed')
    payment_gateway_response = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'transaction_ref': self.transaction_ref,
            'payment_method': self.payment_method,
            'amount': float(self.amount),
            'currency': self.currency,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
