from datetime import datetime
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), nullable=False)  # admin, staff, driver, customer
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    driver_profile = db.relationship('Driver', backref='user', uselist=False, cascade='all, delete-orphan')
    customer_profile = db.relationship('Customer', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Driver(db.Model):
    __tablename__ = 'drivers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    license_number = db.Column(db.String(50), unique=True, nullable=False)
    status = db.Column(db.String(20), default='available')  # available, on_trip, offline
    rating = db.Column(db.Float, default=0.0)
    total_trips = db.Column(db.Integer, default=0)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    trips = db.relationship('Trip', backref='driver', lazy=True)
    vehicles = db.relationship('Vehicle', backref='assigned_driver', lazy=True)
    earnings = db.relationship('Earning', backref='driver', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.user.name,
            'email': self.user.email,
            'phone': self.user.phone,
            'license_number': self.license_number,
            'status': self.status,
            'rating': self.rating,
            'total_trips': self.total_trips,
            'joined_at': self.joined_at.isoformat()
        }

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_bookings = db.Column(db.Integer, default=0)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    bookings = db.relationship('Booking', backref='customer', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.user.name,
            'email': self.user.email,
            'phone': self.user.phone,
            'total_bookings': self.total_bookings,
            'joined_at': self.joined_at.isoformat()
        }

class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    
    id = db.Column(db.Integer, primary_key=True)
    plate_number = db.Column(db.String(20), unique=True, nullable=False)
    model = db.Column(db.String(50), nullable=False)
    mileage = db.Column(db.Integer, default=0)
    fuel_level = db.Column(db.String(20), default='Full')  # Full, 3/4, Half, Low
    status = db.Column(db.String(20), default='available')  # available, rented, maintenance, unavailable
    assigned_driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    trips = db.relationship('Trip', backref='vehicle', lazy=True)
    maintenance_requests = db.relationship('Maintenance', backref='vehicle', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'plate_number': self.plate_number,
            'model': self.model,
            'mileage': self.mileage,
            'fuel_level': self.fuel_level,
            'status': self.status,
            'assigned_driver_id': self.assigned_driver_id,
            'created_at': self.created_at.isoformat()
        }

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
    
    booking = db.relationship('Booking', backref='trip', uselist=False)
    earning = db.relationship('Earning', backref='trip', uselist=False)
    
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

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=True)
    pickup_location = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, completed, cancelled
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'vehicle_id': self.vehicle_id,
            'trip_id': self.trip_id,
            'pickup_location': self.pickup_location,
            'date': self.date.isoformat() if self.date else None,
            'amount': self.amount,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

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

class Earning(db.Model):
    __tablename__ = 'earnings'
    
    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, paid
    date = db.Column(db.Date, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'driver_id': self.driver_id,
            'trip_id': self.trip_id,
            'amount': self.amount,
            'status': self.status,
            'date': self.date.isoformat() if self.date else None,
            'created_at': self.created_at.isoformat()
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(30), nullable=False)  # assignment, payment, maintenance, alert
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    time = db.Column(db.String(50), nullable=False)
    read = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'title': self.title,
            'body': self.body,
            'time': self.time,
            'read': self.read,
            'created_at': self.created_at.isoformat()
        }

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    method = db.Column(db.String(50))  # mpesa, cash, bank
    date = db.Column(db.Date, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'driver_id': self.driver_id,
            'amount': self.amount,
            'status': self.status,
            'method': self.method,
            'date': self.date.isoformat() if self.date else None,
            'created_at': self.created_at.isoformat()
        }
