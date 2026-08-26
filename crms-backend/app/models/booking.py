from app.extensions import db
from datetime import datetime


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    pickup_location = db.Column(db.String(255), nullable=False)
    return_location = db.Column(db.String(255), nullable=False)
    pickup_date = db.Column(db.DateTime, nullable=False)
    return_date = db.Column(db.DateTime, nullable=False)
    driver_option = db.Column(db.Boolean, default=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    special_requests = db.Column(db.Text)
    total_amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', foreign_keys=[user_id], backref='customer_bookings')
    vehicle = db.relationship('Vehicle', backref='bookings')
    driver = db.relationship('User', foreign_keys=[driver_id])

    def to_dict(self):
        return {
            'id': self.id,
            '_id': str(self.id),
            'userId': self.user_id,
            'vehicleId': self.vehicle_id,
            'pickupLocation': self.pickup_location,
            'returnLocation': self.return_location,
            'pickupDate': self.pickup_date.isoformat() if self.pickup_date else None,
            'returnDate': self.return_date.isoformat() if self.return_date else None,
            'driverOption': self.driver_option,
            'driverId': self.driver_id,
            'specialRequests': self.special_requests,
            'totalAmount': self.total_amount,
            'status': self.status,
            'customer': {'name': self.user.name} if self.user else None,
            'vehicle': {'name': f"{self.vehicle.make} {self.vehicle.model}"} if self.vehicle else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
