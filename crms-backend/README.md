# CRMS Backend

Flask REST API for the DriveGo Car Rental Management System.
# CRMS Backend - Staff Module

Flask backend for the Car Rental Management System staff module.

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Environment

Create a `.env` file or set environment variables:

- `FLASK_APP=run.py`
- `FLASK_ENV=development`
- `SECRET_KEY=change-me-in-production`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crms_db`

## Database

Make sure PostgreSQL is running and the database exists:

```bash
createdb crms_db
```

Initialize migrations:

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

Seed default policies:

```bash
flask shell
>>> from app.models.policy import RentalPolicy
>>> defaults = {
...   'cancellation': {'windowHours': 24, 'feePercent': 10, 'allowCancellation': True},
...   'lateReturn': {'gracePeriodMinutes': 30, 'lateFeePerHour': 500, 'maxLateFee': 5000},
...   'minRentalAge': {'minAge': 21, 'youngDriverSurcharge': 500},
...   'rentalDuration': {'minDurationDays': 1, 'maxDurationDays': 30},
...   'securityDeposit': {'defaultAmount': 10000},
... }
>>> for k, v in defaults.items():
...   if not RentalPolicy.query.filter_by(key=k).first():
...     db.session.add(RentalPolicy(key=k, value=v))
...
>>> db.session.commit()
```

## Run

```bash
flask run
```

The API will be available at `http://localhost:5000/api/admin`.

## Admin Endpoints

- `GET /api/admin/vehicles`
- `GET /api/admin/vehicles/<id>`
- `POST /api/admin/vehicles`
- `PUT /api/admin/vehicles/<id>`
- `DELETE /api/admin/vehicles/<id>`

- `GET /api/admin/staff`
- `POST /api/admin/staff`
- `PUT /api/admin/staff/<id>`

- `GET /api/admin/rental-policies`
- `PUT /api/admin/rental-policies`

- `GET /api/admin/reports/revenue`
- `GET /api/admin/reports/bookings`
- `GET /api/admin/reports/vehicles`
- `GET /api/admin/reports/fleet-utilization`
cd crms-backend
pip install -r requirements.txt
python3 init_db.py
python3 run.py
```

Server runs at `http://localhost:5000`

## Environment

Create a `.env` file or use defaults:
- `SECRET_KEY` - Flask secret key
- `DATABASE_URL` - SQLite database URL
- `JWT_SECRET_KEY` - JWT signing key

## Database

SQLite database is created at `crms-backend/crms.db` on first run. Mock data is seeded via `init_db.py`.

## Staff API Endpoints

- `GET /api/health` - Health check
- `GET /staff/dashboard` - Dashboard stats, schedule, vehicle status, recent bookings
- `GET /staff/bookings` - All bookings (supports `?status=` filter)
- `GET /staff/bookings/pending` - Pending bookings only
- `GET /staff/bookings/<id>` - Single booking
- `PUT /staff/bookings/<id>/approve` - Approve booking
- `PUT /staff/bookings/<id>/reject` - Reject booking
- `POST /staff/bookings/<id>/checkout` - Check-out booking
- `POST /staff/bookings/<id>/checkin` - Check-in booking
- `GET /staff/trips` - All trips
- `PUT /staff/trips/<id>/status` - Update trip status
- `GET /staff/vehicles/inspection` - Vehicles for inspection
- `PUT /staff/vehicles/<id>/inspection` - Update vehicle inspection
- `GET /staff/customers` - All customers
- `GET /staff/driver-assignments` - Pending driver requests
- `POST /staff/driver-assignments` - Assign driver to booking
- `GET /staff/reports` - All reports
- `GET /staff/notifications` - All notifications
- `PUT /staff/notifications/<id>/read` - Mark notification as read

## Frontend Connection

The frontend is configured to call `http://localhost:5000/api`. When the backend is running, staff pages will use real API data. When the backend is down, frontend components fall back to mock data automatically.

## Testing

```bash
# Start backend
python3 run.py

# In another terminal, start frontend
cd crms-fronted
npm run dev
```

## Branch

Work is on `sum-backend-staff`. Do not merge to `develop` until group leader approval.
