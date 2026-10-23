from datetime import datetime
from .base import db

class Reservation(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    reservation_code = db.Column(db.String(32), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='RESTRICT'), nullable=False, index=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id', ondelete='RESTRICT'), nullable=False, index=True)
    table_id = db.Column(db.Integer, db.ForeignKey('restaurant_tables.id', ondelete='SET NULL'), nullable=True)
    reservation_date = db.Column(db.Date, nullable=False)
    reservation_time = db.Column(db.Time, nullable=False)
    party_size = db.Column(db.Integer, nullable=False)
    status = db.Column(
        db.Enum('pending', 'confirmed', 'cancelled', 'completed', 'no_show'),
        nullable=False,
        default='confirmed'
    )
    special_requests = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    table = db.relationship('RestaurantTable', lazy=True)
    status_history = db.relationship('ReservationStatusHistory', backref='reservation', lazy=True, cascade='all, delete-orphan', order_by='ReservationStatusHistory.changed_at.desc()')

    def to_dict(self):
        return {
            'id': self.id,
            'reservation_id': self.id,
            'reservation_code': self.reservation_code,
            'user_id': self.user_id,
            'customer_name': self.user.name if self.user else '',
            'customer_email': self.user.email if self.user else '',
            'customer_phone': self.user.phone if self.user else '',
            'restaurant_id': self.restaurant_id,
            'restaurant_name': self.restaurant.name if self.restaurant else '',
            'restaurant_city': self.restaurant.city if self.restaurant else '',
            'table_id': self.table_id,
            'table_number': self.table.table_number if self.table else None,
            'table_name': self.table.table_name if self.table else None,
            'section': self.table.section if self.table else None,
            'date': self.reservation_date.isoformat() if self.reservation_date else '',
            'reservation_date': self.reservation_date.isoformat() if self.reservation_date else '',
            'time': str(self.reservation_time)[:5] if self.reservation_time else '',
            'reservation_time': str(self.reservation_time)[:5] if self.reservation_time else '',
            'guests': self.party_size,
            'party_size': self.party_size,
            'status': self.status,
            'special_requests': self.special_requests,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class ReservationStatusHistory(db.Model):
    __tablename__ = 'reservation_status_history'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservations.id', ondelete='CASCADE'), nullable=False, index=True)
    previous_status = db.Column(db.String(40), nullable=True)
    new_status = db.Column(db.String(40), nullable=False)
    changed_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    notes = db.Column(db.String(255), nullable=True)
    changed_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'reservation_id': self.reservation_id,
            'previous_status': self.previous_status,
            'new_status': self.new_status,
            'notes': self.notes,
            'changed_at': self.changed_at.isoformat() if self.changed_at else None,
        }
