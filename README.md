# Car Rental Management System

A full-stack car rental management system with customer portal, admin dashboard, and booking management.

## Project Structure

- `crms-fronted/` - React frontend (Vite + React Router + Tailwind CSS)
- `crms-backend/` - Node.js/Express backend with MongoDB

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB

### Frontend Setup
```bash
cd crms-fronted
npm install
npm run dev
```

### Backend Setup
```bash
cd crms-backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

## Features

### Customer Portal
- Register/Login/Logout
- Reset password
- Search/filter vehicles by pickup/return date, location, category, and price
- View vehicle details with availability
- Create bookings
- View booking history (upcoming, active, past)
- Cancel or modify bookings
- View rental agreement/confirmation
- Make payments and print receipts
- Manage profile (contact info, driver's license)
- Leave reviews for completed rentals

### API Endpoints

#### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Vehicles
- `GET /api/vehicles` - Get all vehicles (with filters)
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create vehicle (admin)
- `PUT /api/vehicles/:id` - Update vehicle (admin)
- `DELETE /api/vehicles/:id` - Delete vehicle (admin)

#### Bookings
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

#### Payments
- `GET /api/payments` - Get payment history
- `POST /api/payments` - Create payment
- `POST /api/payments/:id/refund` - Refund payment

#### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)
