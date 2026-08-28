from app.extensions import db
from datetime import datetime


class Trip(db.Model):
    __tablename__ = 'trips'

    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    pickup_location = db.Column(db.String(200), nullable=False)
    dropoff_location = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(20), nullable=False)
    distance_km = db.Column(db.Integer)
    fare = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='upcoming')  # upcoming, in_progress, completed, cancelled

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'driver_id': self.driver_id,
            'vehicle_id': self.vehicle_id,
            'customer_id': self.customer_id,
            'pickup_location': self.pickup_location,
            'dropoff_location': self.dropoff_location,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time,
            'distance_km': self.distance_km,
            'fare': self.fare,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
