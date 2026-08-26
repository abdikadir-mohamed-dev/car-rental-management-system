from app.extensions import db
from datetime import datetime


class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(80), nullable=False)
    model = db.Column(db.String(120), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    vehicle_type = db.Column(db.String(80), nullable=False)
    color = db.Column(db.String(50))
    transmission = db.Column(db.String(50))
    fuel_type = db.Column(db.String(50))
    seating_capacity = db.Column(db.Integer)
    mileage = db.Column(db.Integer, default=0)
    daily_rental_rate = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='available')
    description = db.Column(db.Text)
    images = db.Column(db.JSON, default=list)
    features = db.Column(db.JSON, default=list)
    location = db.Column(db.String(120))
    available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'make': self.make,
            'model': self.model,
            'year': self.year,
            'registrationNumber': self.registration_number,
            'vehicleType': self.vehicle_type,
            'color': self.color,
            'transmission': self.transmission,
            'fuelType': self.fuel_type,
            'seatingCapacity': self.seating_capacity,
            'mileage': self.mileage,
            'dailyRentalRate': self.daily_rental_rate,
            'status': self.status,
            'description': self.description,
            'images': self.images or [],
            'features': self.features or [],
            'location': self.location,
            'available': self.available,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
