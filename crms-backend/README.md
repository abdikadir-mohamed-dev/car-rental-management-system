# CRMS Backend - Staff Module

Flask backend for the Car Rental Management System staff module.

## Setup

```bash
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
