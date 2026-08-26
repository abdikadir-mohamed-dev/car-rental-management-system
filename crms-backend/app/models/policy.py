from app.extensions import db
from datetime import datetime


class RentalPolicy(db.Model):
    __tablename__ = 'rental_policies'

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(80), unique=True, nullable=False)
    value = db.Column(db.JSON, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            '_id': str(self.id),
            'key': self.key,
            'value': self.value,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
