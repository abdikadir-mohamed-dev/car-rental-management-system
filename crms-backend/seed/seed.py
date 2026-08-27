import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import User, Driver, Customer, Vehicle, Trip, Booking, Maintenance, Earning, Notification, Payment
from datetime import datetime, date
import random

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
    admin = User(
        name='Admin User',
        email='admin@drivego.com',
        phone='+254 700 000 001',
        role='admin'
    )
    admin.set_password('admin123')
    db.session.add(admin)
    
    # Create Customers
    customers = []
    customer_data = [
        {'name': 'John Doe', 'email': 'john@example.com', 'phone': '+254 711 222 333'},
        {'name': 'Mary Wanjiku', 'email': 'mary@example.com', 'phone': '+254 722 333 444'},
        {'name': 'Peter Mwangi', 'email': 'peter@example.com', 'phone': '+254 733 444 555'},
        {'name': 'Ali Hassan', 'email': 'ali@example.com', 'phone': '+254 744 555 666'},
        {'name': 'Grace Achieng', 'email': 'grace@example.com', 'phone': '+254 755 666 777'},
    ]
    
    for i, data in enumerate(customer_data, 1):
        user = User(**data, role='customer')
        user.set_password('customer123')
        db.session.add(user)
        db.session.flush()
        customer = Customer(user_id=user.id)
        db.session.add(customer)
        customers.append(customer)
    
    # Create Drivers
    drivers = []
    driver_data = [
        {'name': 'James Driver', 'email': 'james@drivego.com', 'phone': '+254 712 345 678', 'license_number': 'DL-2291-KE'},
        {'name': 'Sarah Kamau', 'email': 'sarah@drivego.com', 'phone': '+254 723 456 789', 'license_number': 'DL-2292-KE'},
        {'name': 'Brian Otieno', 'email': 'brian@drivego.com', 'phone': '+254 734 567 890', 'license_number': 'DL-2293-KE'},
    ]
    
    for i, data in enumerate(driver_data, 1):
        user = User(name=data['name'], email=data['email'], phone=data['phone'], role='driver')
        user.set_password('driver123')
        db.session.add(user)
        db.session.flush()
        driver = Driver(user_id=user.id, license_number=data['license_number'], status='available')
        db.session.add(driver)
        drivers.append(driver)
    
    # Create Vehicles
    vehicles = [
        {'plate_number': 'KDA 221B', 'model': 'Toyota Prado', 'mileage': 45210, 'fuel_level': 'Full', 'status': 'available'},
        {'plate_number': 'KDB 774K', 'model': 'Subaru Forester', 'mileage': 38900, 'fuel_level': '3/4', 'status': 'rented'},
        {'plate_number': 'KCF 108T', 'model': 'Mazda Demio', 'mileage': 30880, 'fuel_level': 'Half', 'status': 'rented'},
        {'plate_number': 'KCE 552M', 'model': 'Honda Accord', 'mileage': 52140, 'fuel_level': 'Full', 'status': 'available'},
        {'plate_number': 'KDC 340L', 'model': 'Nissan X-Trail', 'mileage': 18200, 'fuel_level': 'Low', 'status': 'maintenance'},
        {'plate_number': 'KDD 901R', 'model': 'Mercedes C-Class', 'mileage': 27650, 'fuel_level': '3/4', 'status': 'unavailable'},
    ]
    
    created_vehicles = []
    for v in vehicles:
        vehicle = Vehicle(**v)
        db.session.add(vehicle)
        created_vehicles.append(vehicle)
    
    db.session.commit()
    
    # Assign vehicles to drivers
    created_vehicles[0].assigned_driver_id = drivers[0].id
    created_vehicles[1].assigned_driver_id = drivers[1].id
    created_vehicles[2].assigned_driver_id = drivers[2].id
    
    # Create Trips
    trips_data = [
        {'driver_id': drivers[0].id, 'vehicle_id': created_vehicles[0].id, 'customer_id': customers[0].id,
         'pickup_location': 'JKIA Terminal 1', 'dropoff_location': 'Westlands Office', 'date': date(2026, 8, 21),
         'time': '09:30 AM', 'distance_km': 24, 'fare': 32, 'status': 'assigned'},
        {'driver_id': drivers[0].id, 'vehicle_id': created_vehicles[0].id, 'customer_id': customers[1].id,
         'pickup_location': 'Nairobi CBD', 'dropoff_location': 'Kilimani', 'date': date(2026, 8, 20),
         'time': '11:00 AM', 'distance_km': 12, 'fare': 18, 'status': 'completed'},
        {'driver_id': drivers[1].id, 'vehicle_id': created_vehicles[1].id, 'customer_id': customers[2].id,
         'pickup_location': 'Westlands Office', 'dropoff_location': 'Karen Branch', 'date': date(2026, 8, 19),
         'time': '02:00 PM', 'distance_km': 18, 'fare': 26, 'status': 'completed'},
        {'driver_id': drivers[2].id, 'vehicle_id': created_vehicles[2].id, 'customer_id': customers[3].id,
         'pickup_location': 'Karen Branch', 'dropoff_location': 'Nairobi CBD', 'date': date(2026, 8, 18),
         'time': '06:45 PM', 'distance_km': 22, 'fare': 40, 'status': 'cancelled'},
        {'driver_id': drivers[0].id, 'vehicle_id': created_vehicles[0].id, 'customer_id': customers[4].id,
         'pickup_location': 'Kilimani', 'dropoff_location': 'Two Rivers Mall', 'date': date(2026, 8, 22),
         'time': '04:15 PM', 'distance_km': 15, 'fare': 24, 'status': 'upcoming'},
    ]
    
    created_trips = []
    for t in trips_data:
        trip = Trip(**t)
        db.session.add(trip)
        created_trips.append(trip)
    
    db.session.commit()
    
    # Create Bookings
    bookings_data = [
        {'customer_id': customers[0].id, 'vehicle_id': created_vehicles[0].id, 'trip_id': created_trips[0].id,
         'pickup_location': 'JKIA Terminal 1', 'date': date(2026, 8, 21), 'amount': 32, 'status': 'confirmed'},
        {'customer_id': customers[1].id, 'vehicle_id': created_vehicles[3].id, 'trip_id': None,
         'pickup_location': 'Nairobi CBD', 'date': date(2026, 8, 20), 'amount': 24, 'status': 'completed'},
        {'customer_id': customers[2].id, 'vehicle_id': created_vehicles[1].id, 'trip_id': created_trips[2].id,
         'pickup_location': 'Westlands Office', 'date': date(2026, 8, 19), 'amount': 26, 'status': 'completed'},
        {'customer_id': customers[3].id, 'vehicle_id': created_vehicles[2].id, 'trip_id': created_trips[3].id,
         'pickup_location': 'Karen Branch', 'date': date(2026, 8, 18), 'amount': 40, 'status': 'cancelled'},
    ]
    
    for b in bookings_data:
        booking = Booking(**b)
        db.session.add(booking)
    
    # Create Earnings
    earnings_data = [
        {'driver_id': drivers[0].id, 'trip_id': created_trips[1].id, 'amount': 24, 'status': 'paid', 'date': date(2026, 8, 20)},
        {'driver_id': drivers[1].id, 'trip_id': created_trips[2].id, 'amount': 26, 'status': 'paid', 'date': date(2026, 8, 19)},
        {'driver_id': drivers[0].id, 'trip_id': None, 'amount': 32, 'status': 'pending', 'date': date(2026, 8, 21)},
    ]
    
    for e in earnings_data:
        earning = Earning(**e)
        db.session.add(earning)
    
    # Create Maintenance Requests
    maintenance_data = [
        {'vehicle_id': created_vehicles[4].id, 'issue': 'Brake pads worn', 'priority': 'High', 'status': 'In Progress', 'date': 'Aug 18'},
        {'vehicle_id': created_vehicles[0].id, 'issue': 'AC not cooling', 'priority': 'Medium', 'status': 'Open', 'date': 'Aug 17'},
        {'vehicle_id': created_vehicles[1].id, 'issue': 'Routine service', 'priority': 'Low', 'status': 'Resolved', 'date': 'Aug 12'},
    ]
    
    for m in maintenance_data:
        maintenance = Maintenance(**m)
        db.session.add(maintenance)
    
    # Create Notifications
    notifications_data = [
        {'user_id': drivers[0].id, 'type': 'assignment', 'title': 'New assignment received',
         'body': 'Pickup at JKIA Terminal 1, 09:30 AM.', 'time': '10 min ago', 'read': False},
        {'user_id': drivers[0].id, 'type': 'payment', 'title': 'Payout processed',
         'body': 'KES 3,900 has been sent to your wallet.', 'time': '2 hours ago', 'read': False},
        {'user_id': drivers[1].id, 'type': 'maintenance', 'title': 'Maintenance reminder',
         'body': 'Toyota Prado (KDA 221B) is due for service in 500 km.', 'time': '5 hours ago', 'read': False},
        {'user_id': drivers[0].id, 'type': 'alert', 'title': 'Booking cancelled',
         'body': 'Kevin Njoroge cancelled booking BK-1029.', 'time': 'Yesterday', 'read': True},
    ]
    
    for n in notifications_data:
        notification = Notification(**n)
        db.session.add(notification)
    
    # Create Payments
    payments_data = [
        {'driver_id': drivers[0].id, 'amount': 3900, 'status': 'completed', 'method': 'mpesa', 'date': date(2026, 8, 20)},
        {'driver_id': drivers[1].id, 'amount': 2600, 'status': 'pending', 'method': 'mpesa', 'date': date(2026, 8, 19)},
    ]
    
    for p in payments_data:
        payment = Payment(**p)
        db.session.add(payment)
    
    db.session.commit()
    
    print('Database seeded successfully!')
    print(f'Created {User.query.count()} users')
    print(f'Created {Driver.query.count()} drivers')
    print(f'Created {Customer.query.count()} customers')
    print(f'Created {Driver.query.count()} drivers')
    print(f'Created {Vehicle.query.count()} vehicles')
    print(f'Created {Trip.query.count()} trips')
    print(f'Created {Booking.query.count()} bookings')
    print(f'Created {Maintenance.query.count()} maintenance requests')
    print(f'Created {Earning.query.count()} earnings')
    print(f'Created {Notification.query.count()} notifications')
    print(f'Created {Payment.query.count()} payments')
