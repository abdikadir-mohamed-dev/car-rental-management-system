from app.extensions import db
from datetime import datetime


class Maintenance(db.Model):
    __tablename__ = 'maintenance'

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    issue = db.Column(db.String(200), nullable=False)
    priority = db.Column(db.String(20), default='Medium')  # Low, Medium, High
    status = db.Column(db.String(20), default='Open')  # Open, In Progress, Resolved
    date = db.Column(db.String(20), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'vehicle_id': self.vehicle_id,
            'issue': self.issue,
            'priority': self.priority,
            'status': self.status,
            'date': self.date,
            'created_at': self.created_at.isoformat()
        }
