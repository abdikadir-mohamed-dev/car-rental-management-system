# CRMS Backend

Flask REST API for the DriveGo Car Rental Management System.

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
