# CRMS Backend API Documentation

Base URL: `http://localhost:5000`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

Tokens expire after 7 days.

---

## Auth Endpoints

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "driver@drivego.com",
  "password": "driver123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "James Driver",
    "email": "james@drivego.com",
    "phone": "+254 712 345 678",
    "role": "driver",
    "created_at": "2024-01-01T00:00:00"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "name": "New User",
  "email": "new@example.com",
  "phone": "+254 711 222 333",
  "role": "customer",
  "password": "password123"
}
```

**Response:** Same as login

### POST /auth/logout
Logout (client-side token removal).

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Driver Endpoints

All endpoints require authentication. Driver-specific endpoints use the logged-in user's driver profile.

### GET /api/driver/dashboard
Get driver dashboard stats.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "trips_today": 3,
  "upcoming": 1,
  "completed": 2,
  "total_earnings": 120
}
```

### GET /api/driver/assignments
Get driver assignments with optional status filter.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): all, assigned, upcoming, completed, cancelled

**Response:**
```json
[
  {
    "id": 1,
    "driver_id": 1,
    "vehicle_id": 1,
    "customer_id": 1,
    "pickup_location": "JKIA Terminal 1",
    "dropoff_location": "Westlands Office",
    "date": "2026-08-21",
    "time": "09:30 AM",
    "distance_km": 24,
    "fare": 32,
    "status": "assigned",
    "created_at": "2026-08-20T10:00:00"
  }
]
```

### GET /api/driver/trips
Get all trips for the driver.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of trip objects

### GET /api/driver/trips/:id
Get a specific trip.

**Headers:** `Authorization: Bearer <token>`

**Response:** Trip object

### PATCH /api/driver/trips/:id/status
Update trip status.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "status": "completed"
}
```

**Response:** Updated trip object

### GET /api/driver/earnings
Get driver earnings.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional): week, month, year

**Response:** Array of earning objects

### GET /api/driver/earnings/summary
Get earnings summary.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "total": 420,
  "trips": 15,
  "avg": 28,
  "period": "month"
}
```

### GET /api/driver/bookings
Get bookings for driver's trips.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of booking objects

### GET /api/driver/vehicles
Get all vehicles.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): all, available, rented, maintenance, unavailable

**Response:** Array of vehicle objects

### GET /api/driver/vehicles/:id
Get a specific vehicle.

**Headers:** `Authorization: Bearer <token>`

**Response:** Vehicle object

### GET /api/driver/customers
Get all customers.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of customer objects

### GET /api/driver/maintenance
Get maintenance requests.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `vehicle_id` (optional): Filter by vehicle ID

**Response:** Array of maintenance request objects

### POST /api/driver/maintenance
Create a maintenance request.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "vehicle_id": 1,
  "issue": "Brake pads worn",
  "priority": "High",
  "date": "Aug 18"
}
```

**Response:** Created maintenance request object

### GET /api/driver/reports
Get driver reports.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional): 7d, 30d, 90d

**Response:**
```json
{
  "period": "30d",
  "trips_completed": 56,
  "on_time_rate": 94,
  "avg_rating": 4.8
}
```

### GET /api/driver/notifications
Get notifications for current user.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of notification objects

### PATCH /api/driver/notifications/:id/read
Mark a notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response:** Updated notification object

### PATCH /api/driver/notifications/read-all
Mark all notifications as read.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

### GET /api/driver/payments
Get driver payments.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of payment objects

---

## Bookings Endpoints

### GET /api/bookings
Get all bookings with optional status filter.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): all, pending, confirmed, completed, cancelled

**Response:** Array of booking objects

### GET /api/bookings/:id
Get a specific booking.

**Headers:** `Authorization: Bearer <token>`

**Response:** Booking object

### POST /api/bookings
Create a new booking.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "customer_id": 1,
  "vehicle_id": 1,
  "pickup_location": "Nairobi CBD",
  "date": "2026-08-25",
  "amount": 300
}
```

**Response:** Created booking object

### PATCH /api/bookings/:id/status
Update booking status.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "status": "confirmed"
}
```

**Response:** Updated booking object

---

## Vehicles Endpoints

### GET /api/vehicles
Get all vehicles with optional status filter.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): all, available, rented, maintenance, unavailable

**Response:** Array of vehicle objects

### GET /api/vehicles/:id
Get a specific vehicle.

**Headers:** `Authorization: Bearer <token>`

**Response:** Vehicle object

### POST /api/vehicles
Create a new vehicle.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "plate_number": "KDA 221B",
  "model": "Toyota Prado",
  "mileage": 45210,
  "fuel_level": "Full",
  "status": "available"
}
```

**Response:** Created vehicle object

### PATCH /api/vehicles/:id
Update a vehicle.

**Headers:** `Authorization: Bearer <token>`

**Request:** Any vehicle fields to update

**Response:** Updated vehicle object

---

## Customers Endpoints

### GET /api/customers
Get all customers.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of customer objects

### GET /api/customers/:id
Get a specific customer.

**Headers:** `Authorization: Bearer <token>`

**Response:** Customer object

---

## Maintenance Endpoints

### GET /api/maintenance
Get all maintenance requests with optional vehicle filter.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `vehicle_id` (optional): Filter by vehicle ID

**Response:** Array of maintenance request objects

### POST /api/maintenance
Create a maintenance request.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "vehicle_id": 1,
  "issue": "AC not cooling",
  "priority": "Medium",
  "date": "Aug 17"
}
```

**Response:** Created maintenance request object

### PATCH /api/maintenance/:id
Update a maintenance request.

**Headers:** `Authorization: Bearer <token>`

**Request:** Any maintenance fields to update

**Response:** Updated maintenance request object

---

## Notifications Endpoints

### GET /api/notifications
Get notifications for current user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `user_id` (optional): Defaults to current user

**Response:** Array of notification objects

### PATCH /api/notifications/:id/read
Mark a notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response:** Updated notification object

### PATCH /api/notifications/read-all
Mark all notifications as read.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `user_id` (optional): Defaults to current user

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

---

## Payments Endpoints

### GET /api/payments
Get payments for the driver.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `driver_id` (optional): Defaults to current driver

**Response:** Array of payment objects

### POST /api/payments
Create a payment.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "driver_id": 1,
  "amount": 3000,
  "status": "pending",
  "method": "mpesa",
  "date": "2026-08-21"
}
```

**Response:** Created payment object

---

## Error Responses

All endpoints return standard HTTP status codes:

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "message": "Error description"
}
```

---

## Seed Data

After running the seed script, you can use these credentials:

**Admin:**
- Email: admin@drivego.com
- Password: admin123

**Staff:**
- Email: staff@drivego.com
- Password: staff123

**Drivers:**
- Email: james@drivego.com / sarah@drivego.com / brian@drivego.com
- Password: driver123

**Customers:**
- Email: john@example.com / mary@example.com / peter@example.com / ali@example.com / grace@example.com
- Password: customer123
