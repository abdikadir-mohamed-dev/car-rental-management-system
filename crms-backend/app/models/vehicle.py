from app import db
from datetime import datetime

class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    plate_number = db.Column(db.String(20), unique=True, nullable=False)
    category = db.Column(db.String(50))
    status = db.Column(db.String(20), default='available')
    price_per_day = db.Column(db.Float, default=0.0)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookings = db.relationship('Booking', backref='vehicle', lazy=True)
    inspections = db.relationship('Inspection', backref='vehicle', lazy=True)
