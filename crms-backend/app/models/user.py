from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    license_number = db.Column(db.String(50))
    role = db.Column(db.String(20), nullable=False, default='customer')
    is_active = db.Column(db.Boolean, default=True)
    password_hash = db.Column(db.String(255), nullable=True)
    must_change_password = db.Column(db.Boolean, default=True)
    email_notifications = db.Column(db.Boolean, default=True, nullable=False)
    booking_notifications = db.Column(db.Boolean, default=True, nullable=False)
    promotional_notifications = db.Column(db.Boolean, default=False, nullable=False)
    language = db.Column(db.String(10), default='en', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # Customer-specific fields
    drivers_license = db.Column(db.String(50))
    license_expiry = db.Column(db.String(20))
    country = db.Column(db.String(50))
    profile_photo = db.Column(db.String(255))
    reset_password_token = db.Column(db.String(120))
    reset_password_expire = db.Column(db.Integer)

    driver_profile = db.relationship(
    'Driver',
    foreign_keys='Driver.user_id',
    uselist=False,
    cascade='all, delete-orphan'
)

    customer_profile = db.relationship(
    'Customer',
    foreign_keys='Customer.user_id',
    uselist=False,
    cascade='all, delete-orphan'
)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            '_id': str(self.id),
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'license_number': self.license_number,
            'isActive': self.is_active,
            'mustChangePassword': self.must_change_password,
            'emailNotifications': self.email_notifications,
            'bookingNotifications': self.booking_notifications,
            'promotionalNotifications': self.promotional_notifications,
            'language': self.language,
            'driversLicense': self.drivers_license,
            'licenseExpiry': self.license_expiry,
            'country': self.country,
            'profilePhoto': self.profile_photo,
            
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
        }
