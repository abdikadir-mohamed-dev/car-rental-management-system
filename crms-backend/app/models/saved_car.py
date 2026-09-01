from datetime import datetime

from app.extensions import db


class SavedCar(db.Model):
    __tablename__ = 'saved_cars'

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False
    )

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey('vehicles.id', ondelete='CASCADE'),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    user = db.relationship(
        'User',
        backref=db.backref(
            'saved_cars',
            lazy=True,
            cascade='all, delete-orphan'
        )
    )

    vehicle = db.relationship(
        'Vehicle',
        backref=db.backref(
            'saved_by_users',
            lazy=True
        )
    )

    __table_args__ = (
        db.UniqueConstraint(
            'user_id',
            'vehicle_id',
            name='uq_saved_car_user_vehicle'
        ),
    )

    def to_dict(self):
        return {
            'id': self.id,
            '_id': str(self.id),
            'userId': self.user_id,
            'vehicleId': self.vehicle_id,
            'vehicle': self.vehicle.to_dict() if self.vehicle else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
