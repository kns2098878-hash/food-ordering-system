from datetime import datetime
from .base import db

class UserWallet(db.Model):
    __tablename__ = 'user_wallets'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    balance = db.Column(db.Numeric(10, 2), default=500.00, nullable=False)
    currency = db.Column(db.String(5), default='INR', nullable=False)
    is_locked = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('wallet', uselist=False))
    transactions = db.relationship('WalletTransaction', backref='wallet', lazy=True, order_by='desc(WalletTransaction.created_at)')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'balance': float(self.balance),
            'currency': self.currency,
            'is_locked': self.is_locked,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class WalletTransaction(db.Model):
    __tablename__ = 'wallet_transactions'

    id = db.Column(db.Integer, primary_key=True)
    wallet_id = db.Column(db.Integer, db.ForeignKey('user_wallets.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    transaction_type = db.Column(db.Enum('credit', 'debit', 'cashback', 'refund'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    balance_after = db.Column(db.Numeric(10, 2), nullable=False)
    reference_type = db.Column(db.String(50), default='order_payment')
    reference_id = db.Column(db.Integer, nullable=True)
    description = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'transaction_type': self.transaction_type,
            'amount': float(self.amount),
            'balance_after': float(self.balance_after),
            'reference_type': self.reference_type,
            'reference_id': self.reference_id,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class LoyaltyTier(db.Model):
    __tablename__ = 'loyalty_tiers'

    id = db.Column(db.Integer, primary_key=True)
    tier_name = db.Column(db.String(50), unique=True, nullable=False)
    min_spend = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    points_multiplier = db.Column(db.Numeric(3, 2), default=1.00, nullable=False)
    badge_color = db.Column(db.String(20), default='#CD7F32', nullable=False)
    perks_description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'tier_name': self.tier_name,
            'min_spend': float(self.min_spend),
            'points_multiplier': float(self.points_multiplier),
            'badge_color': self.badge_color,
            'perks_description': self.perks_description
        }

class LoyaltyAccount(db.Model):
    __tablename__ = 'loyalty_accounts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    tier_id = db.Column(db.Integer, db.ForeignKey('loyalty_tiers.id'), default=1, nullable=False)
    current_points = db.Column(db.Integer, default=100, nullable=False)
    lifetime_points = db.Column(db.Integer, default=100, nullable=False)
    lifetime_spent = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tier = db.relationship('LoyaltyTier')
    user = db.relationship('User', backref=db.backref('loyalty_account', uselist=False))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'current_points': self.current_points,
            'lifetime_points': self.lifetime_points,
            'lifetime_spent': float(self.lifetime_spent),
            'tier': self.tier.to_dict() if self.tier else None
        }

class DietaryTag(db.Model):
    __tablename__ = 'dietary_tags'

    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(50), unique=True, nullable=False)
    icon_name = db.Column(db.String(50), default='Leaf')
    badge_color = db.Column(db.String(20), default='#16A34A')
    description = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'tag_name': self.tag_name,
            'icon_name': self.icon_name,
            'badge_color': self.badge_color,
            'description': self.description
        }
