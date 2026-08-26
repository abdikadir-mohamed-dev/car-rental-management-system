from app import db
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.booking import Booking
from app.models.trip import Trip
from app.models.driver_assignment import DriverAssignment
from app.models.inspection import Inspection
from app.models.report import Report
from app.models.notification import Notification
from datetime import datetime, date

def seed_data():
    if User.query.first():
        return

    staff = User(name='Staff Member', email='staff@drivego.com', phone='+254 712 345 678', password_hash='password', role='staff')
    customer1 = User(name='Alice Mwangi', email='alice@example.com', phone='+254 712 345 678', password_hash='password', role='customer', license_number='DL-88231')
    customer2 = User(name='Brian Otieno', email='brian@example.com', phone='+254 723 456 789', password_hash='password', role='customer', license_number='DL-99102')
    driver1 = User(name='James Kariuki', email='james@example.com', phone='+254 711 111 111', password_hash='password', role='driver', license_number='DL-D-001', experience='5 years', rating=4.8, status='available')
    driver2 = User(name='Peter Njoroge', email='peter@example.com', phone='+254 722 222 222', password_hash='password', role='driver', license_number='DL-D-002', experience='3 years', rating=4.5, status='available')
    driver3 = User(name='Samuel Mwangi', email='samuel@example.com', phone='+254 733 333 333', password_hash='password', role='driver', license_number='DL-D-003', experience='7 years', rating=4.9, status='busy')

    db.session.add_all([staff, customer1, customer2, driver1, driver2, driver3])
    db.session.commit()

    v1 = Vehicle(name='Toyota Camry', plate_number='ABC 123', category='sedan', status='available', price_per_day=50.0)
    v2 = Vehicle(name='Honda CR-V', plate_number='XYZ 789', category='suv', status='rented', price_per_day=70.0)
    v3 = Vehicle(name='Toyota RAV4', plate_number='DEF 456', category='suv', status='available', price_per_day=65.0)
    v4 = Vehicle(name='Mazda CX-5', plate_number='GHI 789', category='suv', status='maintenance', price_per_day=60.0)
    db.session.add_all([v1, v2, v3, v4])
    db.session.commit()

    b1 = Booking(user_id=customer1.id, vehicle_id=v3.id, pickup_date=date(2026, 8, 20), dropoff_date=date(2026, 8, 25), pickup_location='Nairobi CBD', dropoff_location='JKIA', total_amount=325.0, status='confirmed', needs_driver=True)
    b2 = Booking(user_id=customer2.id, vehicle_id=v1.id, pickup_date=date(2026, 8, 21), dropoff_date=date(2026, 8, 28), pickup_location='Westlands', dropoff_location='Nairobi CBD', total_amount=350.0, status='pending', needs_driver=True)
    b3 = Booking(user_id=customer1.id, vehicle_id=v2.id, pickup_date=date(2026, 8, 19), dropoff_date=date(2026, 8, 22), pickup_location='Kilimani', dropoff_location='Kilimani', total_amount=210.0, status='active', needs_driver=False)
    db.session.add_all([b1, b2, b3])
    db.session.commit()

    t1 = Trip(booking_id=b1.id, driver_id=driver1.id, pickup_location='Nairobi CBD', dropoff_location='JKIA', pickup_time=datetime(2026, 8, 20, 8, 0), status='assigned')
    t2 = Trip(booking_id=b3.id, driver_id=driver2.id, pickup_location='Kilimani', dropoff_location='JKIA', pickup_time=datetime(2026, 8, 19, 9, 0), status='in_progress')
    db.session.add_all([t1, t2])
    db.session.commit()

    a1 = DriverAssignment(booking_id=b1.id, driver_id=driver1.id, status='pending')
    a2 = DriverAssignment(booking_id=b2.id, driver_id=driver2.id, status='pending')
    db.session.add_all([a1, a2])
    db.session.commit()

    i1 = Inspection(booking_id=b3.id, vehicle_id=v2.id, inspector_id=staff.id, type='check-out', mileage=45000, fuel_level='Full', condition='Good', status='passed')
    i2 = Inspection(booking_id=None, vehicle_id=v1.id, inspector_id=staff.id, type='check-in', mileage=45200, fuel_level='3/4', condition='Good', damage_notes='Minor scratch', status='passed')
    db.session.add_all([i1, i2])
    db.session.commit()

    r1 = Report(title='Monthly Revenue', type='Revenue', generated_by=staff.id, status='ready')
    r2 = Report(title='Booking Summary', type='Bookings', generated_by=staff.id, status='ready')
    r3 = Report(title='Fleet Utilization', type='Fleet', generated_by=staff.id, status='ready')
    db.session.add_all([r1, r2, r3])
    db.session.commit()

    n1 = Notification(user_id=staff.id, title='New Booking', message='Alice Mwangi booked Toyota RAV4 for Aug 20 - Aug 25', read=False)
    n2 = Notification(user_id=staff.id, title='Upcoming Pickup', message='John Doe pickup scheduled for 09:00 AM', read=False)
    n3 = Notification(user_id=staff.id, title='Check-in Completed', message='Jane Smith returned Honda CR-V successfully', read=True)
    db.session.add_all([n1, n2, n3])
    db.session.commit()

    print('Mock data seeded successfully.')
