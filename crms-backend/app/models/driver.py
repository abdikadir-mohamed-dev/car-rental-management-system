from app.extensions import db
from datetime import datetime


class Driver(db.Model):
    __tablename__ = 'drivers'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=False,
        unique=True
    )

    license_number = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    status = db.Column(
        db.String(20),
        default='available'
    )

    rating = db.Column(
        db.Float,
        default=0.0
    )

    total_trips = db.Column(
        db.Integer,
        default=0
    )

    joined_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user = db.relationship(
        'User',
        backref=db.backref(
            'driver',
            uselist=False
        )
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.user.name if self.user else None,
            'email': self.user.email if self.user else None,
            'phone': self.user.phone if self.user else None,
            'license_number': self.license_number,
            'status': self.status,
            'rating': self.rating,
            'total_trips': self.total_trips,
            'joined_at': (
                self.joined_at.isoformat()
                if self.joined_at
                else None
            )
        }


class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=False,
        unique=True
    )

    total_bookings = db.Column(
        db.Integer,
        default=0
    )

    joined_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user = db.relationship(
        'User',
        backref=db.backref(
            'customer',
            uselist=False
        )
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.user.name if self.user else None,
            'email': self.user.email if self.user else None,
            'phone': self.user.phone if self.user else None,
            'total_bookings': self.total_bookings,
            'joined_at': (
                self.joined_at.isoformat()
                if self.joined_at
                else None
            )
        }