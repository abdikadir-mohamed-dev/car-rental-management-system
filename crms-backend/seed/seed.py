import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import User, Driver, Customer, Vehicle, Trip, Booking, Maintenance, Earning, Notification, Payment
from datetime import datetime, date

app = create_app()

with app.app_context():
    db.create_all()

    # Clear existing data
    db.session.query(Notification).delete()
    db.session.query(Payment).delete()
    db.session.query(Earning).delete()
    db.session.query(Maintenance).delete()
    db.session.query(Booking).delete()
    db.session.query(Trip).delete()
    db.session.query(Vehicle).delete()
    db.session.query(Driver).delete()
    db.session.query(Customer).delete()
    db.session.query(User).delete()
    db.session.commit()

    # Create Admin
    admin = User(name='Admin User', email='admin@drivego.com', phone='+254 700 000 001', role='admin')
    admin.set_password('admin123')
    db.session.add(admin)
    db.session.flush()
    admin_id = admin.id

    # Create Customers
    customer_users = []
    customers = []
    customer_data = [
        {'name': 'John Doe', 'email': 'john@example.com', 'phone': '+254 711 222 333'},
        {'name': 'Mary Wanjiku', 'email': 'mary@example.com', 'phone': '+254 722 333 444'},
        {'name': 'Peter Mwangi', 'email': 'peter@example.com', 'phone': '+254 733 444 555'},
        {'name': 'Ali Hassan', 'email': 'ali@example.com', 'phone': '+254 744 555 666'},
        {'name': 'Grace Achieng', 'email': 'grace@example.com', 'phone': '+254 755 666 777'},
    ]

    for data in customer_data:
        user = User(**data, role='customer')
        user.set_password('customer123')
        db.session.add(user)
        db.session.flush()
        customer_users.append(user)
        customer = Customer(user_id=user.id)
        db.session.add(customer)
        db.session.flush()
        customers.append(customer)

    # Create Drivers
    driver_users = []
    drivers = []
    driver_data = [
        {'name': 'James Driver', 'email': 'james@drivego.com', 'phone': '+254 712 345 678', 'license_number': 'DL-2291-KE'},
        {'name': 'Sarah Kamau', 'email': 'sarah@drivego.com', 'phone': '+254 723 456 789', 'license_number': 'DL-2292-KE'},
        {'name': 'Brian Otieno', 'email': 'brian@drivego.com', 'phone': '+254 734 567 890', 'license_number': 'DL-2293-KE'},
    ]

    for data in driver_data:
        user = User(name=data['name'], email=data['email'], phone=data['phone'], role='driver')
        user.set_password('driver123')
        db.session.add(user)
        db.session.flush()
        driver_users.append(user)
        driver = Driver(user_id=user.id, license_number=data['license_number'], status='available')
        db.session.add(driver)
        db.session.flush()
        drivers.append(driver)

    # Create Vehicles
    vehicles = [
        Vehicle(make='Toyota', model='Prado', year=2022, registration_number='KDA 221B', vehicle_type='SUV', status='available', daily_rental_rate=80, location='Nairobi CBD', available=True, is_available=True),
        Vehicle(make='Subaru', model='Forester', year=2021, registration_number='KDB 774K', vehicle_type='SUV', status='rented', daily_rental_rate=70, location='Westlands', available=False, is_available=False),
        Vehicle(make='Mazda', model='Demio', year=2020, registration_number='KCF 108T', vehicle_type='Hatchback', status='rented', daily_rental_rate=50, location='Kilimani', available=False, is_available=False),
        Vehicle(make='Honda', model='Accord', year=2023, registration_number='KCE 552M', vehicle_type='Sedan', status='available', daily_rental_rate=60, location='Karen', available=True, is_available=True),
        Vehicle(make='Nissan', model='X-Trail', year=2019, registration_number='KDC 340L', vehicle_type='SUV', status='maintenance', daily_rental_rate=65, location='Nairobi CBD', available=False, is_available=False),
        Vehicle(make='Mercedes', model='C-Class', year=2022, registration_number='KDD 901R', vehicle_type='Luxury', status='unavailable', daily_rental_rate=120, location='Kilimani', available=False, is_available=False),
    ]
    for v in vehicles:
        db.session.add(v)
    db.session.flush()

    # Assign vehicles to drivers
    vehicles[0].assigned_driver_id = drivers[0].id
    vehicles[1].assigned_driver_id = drivers[1].id
    vehicles[2].assigned_driver_id = drivers[2].id

    # Create Trips
    trips = [
        Trip(driver_id=drivers[0].id, vehicle_id=vehicles[0].id, customer_id=customers[0].id,
             pickup_location='JKIA Terminal 1', dropoff_location='Westlands Office', date=date(2026, 8, 21),
             time='09:30 AM', distance_km=24, fare=32, status='assigned'),
        Trip(driver_id=drivers[0].id, vehicle_id=vehicles[0].id, customer_id=customers[1].id,
             pickup_location='Nairobi CBD', dropoff_location='Kilimani', date=date(2026, 8, 20),
             time='11:00 AM', distance_km=12, fare=18, status='completed'),
        Trip(driver_id=drivers[1].id, vehicle_id=vehicles[1].id, customer_id=customers[2].id,
             pickup_location='Westlands Office', dropoff_location='Karen Branch', date=date(2026, 8, 19),
             time='02:00 PM', distance_km=18, fare=26, status='completed'),
        Trip(driver_id=drivers[2].id, vehicle_id=vehicles[2].id, customer_id=customers[3].id,
             pickup_location='Karen Branch', dropoff_location='Nairobi CBD', date=date(2026, 8, 18),
             time='06:45 PM', distance_km=22, fare=40, status='cancelled'),
        Trip(driver_id=drivers[0].id, vehicle_id=vehicles[0].id, customer_id=customers[4].id,
             pickup_location='Kilimani', dropoff_location='Two Rivers Mall', date=date(2026, 8, 22),
             time='04:15 PM', distance_km=15, fare=24, status='upcoming'),
    ]
    for t in trips:
        db.session.add(t)
    db.session.flush()

    # Create Bookings
    bookings = [
        Booking(user_id=customers[0].user_id, vehicle_id=vehicles[0].id, trip_id=trips[0].id,
                pickup_location='JKIA Terminal 1', return_location='Westlands Office',
                pickup_date=datetime(2026, 8, 21, 9, 30), return_date=datetime(2026, 8, 21, 11, 0),
                total_amount=32, status='confirmed'),
        Booking(user_id=customers[1].user_id, vehicle_id=vehicles[3].id, trip_id=None,
                pickup_location='Nairobi CBD', return_location='Kilimani',
                pickup_date=datetime(2026, 8, 20, 10, 0), return_date=datetime(2026, 8, 20, 12, 0),
                total_amount=24, status='completed'),
        Booking(user_id=customers[2].user_id, vehicle_id=vehicles[1].id, trip_id=trips[2].id,
                pickup_location='Westlands Office', return_location='Karen Branch',
                pickup_date=datetime(2026, 8, 19, 14, 0), return_date=datetime(2026, 8, 19, 16, 0),
                total_amount=26, status='completed'),
        Booking(user_id=customers[3].user_id, vehicle_id=vehicles[2].id, trip_id=trips[3].id,
                pickup_location='Karen Branch', return_location='Nairobi CBD',
                pickup_date=datetime(2026, 8, 18, 18, 45), return_date=datetime(2026, 8, 18, 20, 0),
                total_amount=40, status='cancelled'),
    ]
    for b in bookings:
        db.session.add(b)
    db.session.flush()

    # Create Earnings
    earnings = [
        Earning(driver_id=drivers[0].id, trip_id=trips[1].id, amount=24, status='paid', date=date(2026, 8, 20)),
        Earning(driver_id=drivers[1].id, trip_id=trips[2].id, amount=26, status='paid', date=date(2026, 8, 19)),
        Earning(driver_id=drivers[0].id, trip_id=None, amount=32, status='pending', date=date(2026, 8, 21)),
    ]
    for e in earnings:
        db.session.add(e)

    # Create Maintenance Requests
    maintenance = [
        Maintenance(vehicle_id=vehicles[4].id, issue='Brake pads worn', priority='High', status='In Progress', date='Aug 18'),
        Maintenance(vehicle_id=vehicles[0].id, issue='AC not cooling', priority='Medium', status='Open', date='Aug 17'),
        Maintenance(vehicle_id=vehicles[1].id, issue='Routine service', priority='Low', status='Resolved', date='Aug 12'),
    ]
    for m in maintenance:
        db.session.add(m)

    # Create Notifications
    notifications = [
        Notification(user_id=drivers[0].user_id, title='New assignment received',
                     message='Pickup at JKIA Terminal 1, 09:30 AM.', read=False),
        Notification(user_id=drivers[0].user_id, title='Payout processed',
                     message='KES 3,900 has been sent to your wallet.', read=False),
        Notification(user_id=drivers[1].user_id, title='Maintenance reminder',
                     message='Toyota Prado (KDA 221B) is due for service in 500 km.', read=False),
        Notification(user_id=drivers[0].user_id, title='Booking cancelled',
                     message='Kevin Njoroge cancelled booking BK-1029.', read=True),
    ]
    for n in notifications:
        db.session.add(n)

    # Create Payments
    payments = [
        Payment(booking_id=bookings[0].id, customer_id=customers[0].user_id, amount=3200, status='completed', method='mpesa', date=date(2026, 8, 20)),
        Payment(booking_id=bookings[1].id, customer_id=customers[1].user_id, amount=2400, status='pending', method='mpesa', date=date(2026, 8, 19)),
    ]
    for p in payments:
        db.session.add(p)

    db.session.commit()

    print('Database seeded successfully!')
    print(f'Created {User.query.count()} users')
    print(f'Created {Driver.query.count()} drivers')
    print(f'Created {Customer.query.count()} customers')
    print(f'Created {Vehicle.query.count()} vehicles')
    print(f'Created {Trip.query.count()} trips')
    print(f'Created {Booking.query.count()} bookings')
    print(f'Created {Maintenance.query.count()} maintenance requests')
    print(f'Created {Earning.query.count()} earnings')
    print(f'Created {Notification.query.count()} notifications')
    print(f'Created {Payment.query.count()} payments')
