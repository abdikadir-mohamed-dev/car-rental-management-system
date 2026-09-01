from app.extensions import db
from datetime import datetime


class Trip(db.Model):
    __tablename__ = 'trips'

    id = db.Column(db.Integer, primary_key=True)

    driver_id = db.Column(
        db.Integer,
        db.ForeignKey('drivers.id'),
        nullable=False
    )

    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey('vehicles.id'),
        nullable=False
    )

    customer_id = db.Column(
        db.Integer,
        db.ForeignKey('customers.id'),
        nullable=True
    )

    pickup_location = db.Column(
        db.String(200),
        nullable=False
    )

    dropoff_location = db.Column(
        db.String(200),
        nullable=False
    )

    date = db.Column(
        db.Date,
        nullable=False
    )

    time = db.Column(
        db.String(20),
        nullable=False
    )

    distance_km = db.Column(
        db.Integer
    )

    fare = db.Column(
        db.Float,
        nullable=False
    )

    status = db.Column(
        db.String(20),
        default='upcoming'
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # ============================================================
    # RELATIONSHIPS
    # ============================================================

    driver = db.relationship(
        'Driver',
        backref='trips'
    )

    vehicle = db.relationship(
        'Vehicle',
        backref='trips'
    )

    customer = db.relationship(
        'Customer',
        backref='trips'
    )

    # ============================================================
    # SERIALIZE
    # ============================================================

    def to_dict(self):
        return {
            'id': self.id,

            'driver_id': self.driver_id,

            'vehicle_id': self.vehicle_id,

            'customer_id': self.customer_id,

            'pickup_location': self.pickup_location,

            'dropoff_location': self.dropoff_location,

            'date': (
                self.date.isoformat()
                if self.date
                else None
            ),

            'time': self.time,

            'distance_km': self.distance_km,

            'fare': self.fare,

            'status': self.status,

            'created_at': (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),

            # ====================================================
            # CUSTOMER
            # ====================================================

            'customer': {
                'id': self.customer.id,
                'name': self.customer.user.name
                if getattr(self.customer, 'user', None)
                else getattr(
                    self.customer,
                    'name',
                    'Customer'
                ),
                'phone': self.customer.user.phone
                if getattr(self.customer, 'user', None)
                else getattr(
                    self.customer,
                    'phone',
                    None
                ),
                'email': self.customer.user.email
                if getattr(self.customer, 'user', None)
                else getattr(
                    self.customer,
                    'email',
                    None
                )
            } if self.customer else None,

            # ====================================================
            # VEHICLE
            # ====================================================

            'vehicle': {
                'id': self.vehicle.id,

                'name': (
                    f'{self.vehicle.make} '
                    f'{self.vehicle.model}'
                ),

                'registrationNumber': (
                    self.vehicle.registration_number
                )
            } if self.vehicle else None
        }