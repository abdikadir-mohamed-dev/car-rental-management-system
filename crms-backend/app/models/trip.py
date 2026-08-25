from app import db
from datetime import datetime

class Trip(db.Model):
    __tablename__ = 'trips'
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    pickup_location = db.Column(db.String(100))
    dropoff_location = db.Column(db.String(100))
    pickup_time = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='assigned')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    booking = db.relationship('Booking', backref='trips')
