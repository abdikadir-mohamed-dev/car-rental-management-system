from app.extensions import db
from datetime import datetime


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    pickup_location = db.Column(db.String(255), nullable=False)
    return_location = db.Column(db.String(255))
    pickup_date = db.Column(db.DateTime, nullable=False)
    return_date = db.Column(db.DateTime)
    driver_option = db.Column(db.Boolean, default=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    special_requests = db.Column(db.Text)
    total_amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Customer-facing fields
    dropoff_location = db.Column(db.String(255))
    dropoff_date = db.Column(db.DateTime)
    total_amount_customer = db.Column(db.Float)
    cancellation_reason = db.Column(db.String(255))
    cancellation_fee = db.Column(db.Float, default=0)
    refund_amount = db.Column(db.Float, default=0)
    driving_option = db.Column(db.String(20), default='self')
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=True)

    user = db.relationship('User', foreign_keys=[user_id], backref='customer_bookings')
    vehicle = db.relationship('Vehicle', backref='bookings')
    driver = db.relationship('User', foreign_keys=[driver_id])
    trip = db.relationship('Trip', backref='booking', uselist=False)

    def to_dict(self):
        pickup = self.pickup_date.isoformat() if self.pickup_date else None
        dropoff = self.dropoff_date.isoformat() if self.dropoff_date else (self.return_date.isoformat() if self.return_date else None)
        total = self.total_amount_customer if self.total_amount_customer is not None else self.total_amount
        duration = 1
        if self.pickup_date and (self.dropoff_date or self.return_date):
            end = self.dropoff_date or self.return_date
            duration = max(1, ((end - self.pickup_date).total_seconds() / 86400))
        return {
            'id': self.id,
            '_id': str(self.id),
            'customerId': self.user_id,
            'vehicleId': self.vehicle_id,
            'pickupLocation': self.pickup_location,
            'returnLocation': self.return_location or self.dropoff_location,
            'pickupDate': pickup,
            'returnDate': dropoff,
            'duration': duration,
            'drivingOption': self.driving_option or ('with_driver' if self.driver_option else 'self'),
            'driverId': self.driver_id,
            'vehiclePrice': round(total / duration) if duration > 0 else total,
            'driverPrice': 0,
            'totalPrice': total,
            'totalAmount': total,
            'status': self.status,
            'paymentStatus': 'pending',
            'bookingDate': self.created_at.isoformat() if self.created_at else None,
            'specialRequests': self.special_requests,
            'cancellationReason': self.cancellation_reason,
            'cancellationFee': self.cancellation_fee,
            'refundAmount': self.refund_amount,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
