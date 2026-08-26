from app.extensions import db
from datetime import datetime


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    method = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default='pending')
    transaction_id = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    booking = db.relationship('Booking', backref='payments')

    def to_dict(self):
        return {
            'id': self.id,
            '_id': str(self.id),
            'bookingId': self.booking_id,
            'amount': self.amount,
            'method': self.method,
            'status': self.status,
            'transactionId': self.transaction_id,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
