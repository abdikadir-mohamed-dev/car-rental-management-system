from app.extensions import db
from datetime import datetime
import json


class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True)

    # Driver-facing fields
    make = db.Column(db.String(80))
    model = db.Column(db.String(120))
    year = db.Column(db.Integer)
    registration_number = db.Column(db.String(50), unique=True)
    vehicle_type = db.Column(db.String(80))
    color = db.Column(db.String(50))
    transmission = db.Column(db.String(50))
    fuel_type = db.Column(db.String(50))
    seating_capacity = db.Column(db.Integer)
    mileage = db.Column(db.Integer, default=0)
    daily_rental_rate = db.Column(db.Integer)
    status = db.Column(db.String(50), default='available')
    description = db.Column(db.Text)
    images = db.Column(db.JSON, default=list)
    features = db.Column(db.JSON, default=list)
    location = db.Column(db.String(120))
    available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Customer-facing fields
    name = db.Column(db.String(100))
    brand = db.Column(db.String(50))
    price_per_day = db.Column(db.Float)
    image = db.Column(db.String(255))
    rating = db.Column(db.Float, default=4.5)
    is_available = db.Column(db.Boolean, default=True)
    unavailable_dates = db.Column(db.Text, default='[]')
    doors = db.Column(db.Integer, default=4)
    luggage = db.Column(db.Integer, default=2)
    seats = db.Column(db.Integer, default=5)
    fuel_type_customer = db.Column(db.String(20), default='petrol')
    assigned_driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            '_id': str(self.id),
            'name': self.name or f"{self.make} {self.model}",
            'brand': self.brand or self.make,
            'model': self.model,
            'type': self.vehicle_type,
            'category': self.vehicle_type,
            'transmission': self.transmission,
            'fuelType': self.fuel_type_customer or self.fuel_type,
            'seats': self.seats or self.seating_capacity,
            'pricePerDay': self.price_per_day or self.daily_rental_rate,
            'registrationNumber': self.registration_number,
            'image': self.image,
            'images': [self.image] if self.image else (self.images or []),
            'features': json.loads(self.features) if isinstance(self.features, str) else (self.features or []),
            'description': self.description,
            'rating': self.rating,
            'isAvailable': self.is_available,
            'available': self.available,
            'unavailableDates': json.loads(self.unavailable_dates) if isinstance(self.unavailable_dates, str) else (self.unavailable_dates or []),
            'doors': self.doors,
            'luggage': self.luggage,
            'location': self.location,
            'make': self.make,
            'year': self.year,
            'color': self.color,
            'mileage': self.mileage,
            'dailyRentalRate': self.daily_rental_rate,
            'status': self.status,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
