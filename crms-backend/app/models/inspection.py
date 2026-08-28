from app.extensions import db
from datetime import datetime


class Inspection(db.Model):
    __tablename__ = 'inspections'
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    inspector_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    type = db.Column(db.String(20))
    mileage = db.Column(db.Integer)
    fuel_level = db.Column(db.String(20))
    condition = db.Column(db.Text)
    damage_notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    inspector = db.relationship('User', backref='inspections')

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'vehicle_id': self.vehicle_id,
            'inspector_id': self.inspector_id,
            'type': self.type,
            'mileage': self.mileage,
            'fuel_level': self.fuel_level,
            'condition': self.condition,
            'damage_notes': self.damage_notes,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
