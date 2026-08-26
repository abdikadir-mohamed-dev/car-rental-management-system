from app import db
from datetime import datetime

class DriverAssignment(db.Model):
    __tablename__ = 'driver_assignments'
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)

    driver = db.relationship('User', backref='driver_assignments')
