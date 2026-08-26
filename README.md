# Car Rental Management System (CRMS)

A full-stack car rental management system. The frontend is driver-focused, while the backend manages relationships across **drivers, customers, staff, admins, vehicles, bookings, trips, earnings, maintenance, notifications,** and **payments**.

---

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Redux Toolkit + Tailwind CSS + React Router |
| Backend | Flask + Flask-SQLAlchemy + Flask-CORS |
| Auth | JWT (JSON Web Tokens) via PyJWT |
| Database | SQLite (development) / PostgreSQL (production) |
| API Style | RESTful JSON |

---

## Project Structure

```
car-rental-management-system/
├── crms-fronted/                 # React frontend (driver portal)
│   ├── src/
│   │   ├── pages/driver/         # 11 driver pages
│   │   ├── layouts/DriverLayout.jsx
│   │   ├── routes/AppRoutes.jsx
│   │   ├── services/             # Axios API clients
│   │   ├── redux/                # Store + slices
│   │   ├── utils/constants.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── crms-backend/                 # Flask backend API
│   ├── app/
│   │   ├── __init__.py           # App factory + blueprints
│   │   ├── config.py             # Environment config
│   │   ├── models.py             # SQLAlchemy models
│   │   ├── utils/
│   │   │   └── jwt.py            # JWT generate/verify/decorators
│   │   └── routes/
│   │       ├── auth.py           # /auth/*
│   │       ├── driver.py         # /api/driver/*
│   │       ├── bookings.py       # /api/bookings/*
│   │       ├── vehicles.py       # /api/vehicles/*
│   │       ├── customers.py      # /api/customers/*
│   │       ├── maintenance.py    # /api/maintenance/*
│   │       ├── notifications.py  # /api/notifications/*
│   │       └── payments.py       # /api/payments/*
│   ├── seed/
│   │   └── seed.py               # Database seed script
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py                    # Flask entry point
├── README.md
└── API_DOCUMENTATION.md          # Full endpoint reference
```

---

## Database Schema (Driver-Centric)

The backend is built around the **driver** workflow, but still connects to every other entity:

```
User (admin / staff / driver / customer)
  ├── Driver → trips, earnings, payments, assigned vehicles
  ├── Customer → bookings, trips
  ├── Staff → operations / maintenance / support
  └── Admin → platform oversight

Vehicle → trips, maintenance requests
Trip → booking, earning, driver, vehicle, customer
Booking → customer, vehicle, trip
Earning → driver, trip
Maintenance → vehicle
Notification → user
Payment → driver
```

---

## Prerequisites

- **Python** 3.10 or higher
- **Node.js** 16+ and **npm**
- **Git**
- A terminal that supports standard shell commands (PowerShell, CMD, Git Bash, or WSL)

---

## Step-by-Step: Run From Scratch

### Step 1 — Open the project folder

```bash
cd C:\Users\WANYEKI\Desktop\car-rental-management-system
```

You should see two folders: `crms-fronted` and `crms-backend`.

---

### Step 2 — Backend setup (Terminal 1)

Open a new terminal window and run:

```bash
cd crms-backend
```

#### 2a. Create a Python virtual environment

**Windows (PowerShell / CMD):**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**Mac / Linux / WSL:**
```bash
python3 -m venv venv
source venv/bin/activate
```

When activated, your terminal prompt will show `(venv)`.

#### 2b. Install dependencies

```bash
pip install -r requirements.txt
```

This installs Flask, SQLAlchemy, Flask-CORS, PyJWT, python-dotenv, etc.

#### 2c. Configure environment variables

Copy the example env file:
```bash
copy .env.example .env
```

On Mac/Linux/WSL:
```bash
cp .env.example .env
```

Default `.env` contents (SQLite for local development):
```
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-key-change-in-production
DATABASE_URL=sqlite:///crms_db.sqlite3
FLASK_APP=run.py
FLASK_ENV=development
```

> **To switch to PostgreSQL later:** install PostgreSQL, create a database, then change `DATABASE_URL` to:
> `postgresql://username:password@localhost:5432/crms_db`

#### 2d. Seed the database

```bash
python seed/seed.py
```

Expected output:
```
Database seeded successfully!
Created 10 users
Created 3 drivers
Created 5 customers
Created 1 staff
Created 6 vehicles
Created 5 trips
Created 4 bookings
Created 3 maintenance requests
Created 3 earnings
Created 4 notifications
Created 2 payments
```

This creates `crms_db.sqlite3` in the `crms-backend/` folder and populates it with sample data.

#### 2e. Run the backend server

```bash
python run.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
```

**Keep this terminal open.** The backend is now running on **port 5000**.

---

### Step 3 — Frontend setup (Terminal 2)

Open a **second** terminal window:

```bash
cd C:\Users\WANYEKI\Desktop\car-rental-management-system\crms-fronted
```

#### 3a. Install dependencies

```bash
npm install
```

This installs React, Redux Toolkit, React Router, Axios, Tailwind CSS, Recharts, react-hot-toast, etc.

#### 3b. Run the frontend dev server

```bash
npm run dev
```

You should see:
```
VITE v8.2.1  ready in 500 ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Keep this terminal open.** The frontend is now running on **port 5173**.

---

### Step 4 — Use the app

Open your browser and go to:

**http://localhost:5173/driver**

The app will redirect to `/driver/dashboard` and start fetching data from the Flask backend.

---

## Two-Terminal Setup Summary

| Terminal | Working Directory | Command | Port |
|----------|-------------------|---------|------|
| 1 | `crms-backend` | `.\venv\Scripts\activate` then `python run.py` | 5000 |
| 2 | `crms-fronted` | `npm run dev` | 5173 |

If ports 5000 or 5173 are already in use:
- Backend: change the port in `run.py` or kill the process using that port
- Frontend: Vite automatically tries 5174, 5175, etc.

---

## Seed Credentials

Use these to log in and test the app:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@drivego.com | admin123 |
| **Staff** | staff@drivego.com | staff123 |
| **Driver** | james@drivego.com | driver123 |
| **Driver** | sarah@drivego.com | driver123 |
| **Driver** | brian@drivego.com | driver123 |
| **Customer** | john@example.com | customer123 |
| **Customer** | mary@example.com | customer123 |
| **Customer** | peter@example.com | customer123 |
| **Customer** | ali@example.com | customer123 |
| **Customer** | grace@example.com | customer123 |

> The driver frontend currently runs without auth for easy preview. To enforce login, wrap `/driver/*` with `ProtectedRoute` in `AppRoutes.jsx`.

---

## API Documentation

Full endpoint reference: **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

### Quick Reference

**Authentication**
- `POST /auth/login` — Returns JWT token + user info
- `POST /auth/register` — Create new user
- `POST /auth/logout` — Client-side logout

**Driver Endpoints** (all require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/driver/dashboard` | Dashboard stats (trips today, upcoming, completed, earnings) |
| GET | `/api/driver/assignments` | Driver assignments/trips |
| GET | `/api/driver/trips` | All driver trips |
| PATCH | `/api/driver/trips/<id>/status` | Update trip status |
| GET | `/api/driver/earnings` | Driver earnings list |
| GET | `/api/driver/earnings/summary` | Earnings totals + averages |
| GET | `/api/driver/bookings` | Bookings linked to driver's trips |
| GET | `/api/driver/vehicles` | Fleet vehicles |
| GET | `/api/driver/customers` | All customers |
| GET | `/api/driver/maintenance` | Maintenance requests |
| POST | `/api/driver/maintenance` | Create maintenance request |
| GET | `/api/driver/reports` | Driver performance reports |
| GET | `/api/driver/notifications` | User notifications |
| PATCH | `/api/driver/notifications/<id>/read` | Mark notification read |
| PATCH | `/api/driver/notifications/read-all` | Mark all notifications read |
| GET | `/api/driver/payments` | Driver payment history |

**Other Entity Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | All bookings (admin/staff view) |
| POST | `/api/bookings` | Create booking |
| PATCH | `/api/bookings/<id>/status` | Update booking status |
| GET | `/api/vehicles` | All vehicles |
| POST | `/api/vehicles` | Create vehicle |
| PATCH | `/api/vehicles/<id>` | Update vehicle |
| GET | `/api/customers` | All customers |
| GET | `/api/customers/<id>` | Single customer |
| GET | `/api/maintenance` | All maintenance requests |
| PATCH | `/api/maintenance/<id>` | Update maintenance request |
| GET | `/api/notifications` | All notifications |
| GET | `/api/payments` | All payments |
| POST | `/api/payments` | Create payment |

**Example: Login and call a protected endpoint**

```bash
# 1. Login and save token
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"james@drivego.com\",\"password\":\"driver123\"}"

# Response includes: { "token": "eyJ...", "user": {...} }

# 2. Use token to access driver dashboard
curl http://localhost:5000/api/driver/dashboard \
  -H "Authorization: Bearer eyJ..."
```

---

## Frontend Routes

| Route | Page |
|-------|------|
| `/driver` | Redirects to dashboard |
| `/driver/dashboard` | Driver dashboard |
| `/driver/assignments` | My assignments |
| `/driver/trips` | Trip history |
| `/driver/earnings` | Earnings overview |
| `/driver/bookings` | Bookings list |
| `/driver/vehicles` | Fleet vehicles |
| `/driver/customers` | Customer list |
| `/driver/maintenance` | Maintenance requests |
| `/driver/reports` | Performance reports |
| `/driver/notifications` | Notifications |
| `/driver/profile` | Driver profile |

---

## How Data Flows

```
Frontend (React + Redux)
    │
    │  axios + JWT Bearer token
    ▼
Backend (Flask)
    │
    │  SQLAlchemy ORM
    ▼
SQLite Database (crms_db.sqlite3)
```

1. Frontend stores JWT token in `localStorage`
2. Axios interceptors attach `Authorization: Bearer <token>` to every request
3. Flask `@token_required` decorator validates JWT on protected routes
4. SQLAlchemy models query the SQLite database
5. JSON responses flow back to Redux slices → React components

---

## Build for Production

### Backend
```bash
cd crms-backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Frontend
```bash
cd crms-fronted
npm run build
```

Output goes to `crms-fronted/dist/`.

---

## Troubleshooting

**"No module named 'flask'"**
- Make sure you activated the virtual environment: `.\venv\Scripts\activate`
- Then run `pip install -r requirements.txt` again

**"no such table: users"**
- The database file hasn't been created yet. Run `python seed/seed.py`

**Port 5000 already in use**
- Backend: change the port in `run.py` or close the app using port 5000
- Frontend: Vite will automatically try 5174, 5175, etc.

**CORS errors in browser console**
- Backend must be running on port 5000
- Frontend on port 5173
- Ensure `flask-cors` is installed

**"Failed to decode JSON object" when using curl**
- Use double quotes inside the JSON body, or wrap the whole body in single quotes

**npm install fails**
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

## Tech Stack Details

### Backend
- **Flask** — lightweight Python web framework
- **Flask-SQLAlchemy** — ORM for database models
- **Flask-CORS** — cross-origin resource sharing
- **PyJWT** — JSON Web Token encoding/decoding
- **python-dotenv** — environment variable management

### Frontend
- **React** — UI library
- **Redux Toolkit** — state management with async thunks
- **React Router** — client-side routing
- **Tailwind CSS** — utility-first styling
- **Axios** — HTTP client
- **Recharts** — data visualization
- **react-hot-toast** — toast notifications
- **Lucide React** — icon library

---

## License

MIT
