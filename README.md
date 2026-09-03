# DriveGo — Car Rental Management System

## Table of Contents

- [Project Overview](#project-overview)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [User Roles](#user-roles)
- [Complete System Workflow](#complete-system-workflow)
- [Guest Workflow](#guest-workflow)
- [Customer Workflow](#customer-workflow)
- [Staff Workflow](#staff-workflow)
- [Driver Workflow](#driver-workflow)
- [Admin Workflow](#admin-workflow)
- [Authentication and Authorization](#authentication-and-authorization)
- [Booking System](#booking-system)
- [Payment System](#payment-system)
- [M-Pesa Payment Flow](#m-pesa-payment-flow)
- [Cash Payment Flow](#cash-payment-flow)
- [Driver Assignment](#driver-assignment)
- [Vehicle Management](#vehicle-management)
- [Vehicle Checkout](#vehicle-checkout)
- [Vehicle Check-in](#vehicle-check-in)
- [Maintenance Management](#maintenance-management)
- [Notifications](#notifications)
- [Cancellation Policy](#cancellation-policy)
- [Database](#database)
- [API Structure](#api-structure)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [Demo Accounts](#demo-accounts)
- [Team Members and Responsibilities](#team-members-and-responsibilities)
- [Collaboration Structure](#collaboration-structure)
- [Git and GitHub Workflow](#git-and-github-workflow)
- [Security](#security)
- [System Business Rules](#system-business-rules)
- [Project Status](#project-status)
- [Conclusion](#conclusion)

---

# Project Overview

DriveGo is a full-stack web-based Car Rental Management System designed to simplify and manage the complete vehicle rental process.

The system connects guests, customers, staff, drivers, and administrators through role-based interfaces and workflows.

Customers can browse vehicles, create accounts, make bookings, select payment methods, and manage their rentals.

Staff members manage day-to-day rental operations, including bookings, vehicle checkout, vehicle check-in, inspections, and driver assignments.

Drivers receive and manage assignments made by staff.

Administrators manage the overall system, including users, vehicles, drivers, staff, pricing, rental policies, maintenance, reports, and other administrative functions.

The system is designed for small and medium-sized car rental businesses that need a centralized platform for managing their rental operations.

---

# Objectives

The main objectives of DriveGo are to:

1. Digitize the car rental process.
2. Provide customers with an easy way to browse and rent vehicles.
3. Provide secure authentication for different types of users.
4. Implement role-based access control.
5. Prevent unauthorized users from accessing protected functionality.
6. Allow staff to manage rental operations.
7. Allow staff to assign drivers to customers who request a driver.
8. Allow drivers to receive and accept assigned bookings.
9. Support M-Pesa and cash payments.
10. Track vehicle availability and rental status.
11. Record vehicle inspections during checkout and check-in.
12. Manage vehicle maintenance.
13. Provide notifications throughout the rental lifecycle.
14. Allow administrators to manage the overall system.
15. Provide reports and analytics for system management.

---

# Key Features

## Guest Features

Guests can:

- Access the DriveGo landing page.
- Browse available vehicles.
- View vehicle information.
- View public pages.
- Learn about the rental service.
- Navigate to customer registration.
- Navigate to login.

Guests do not have access to protected customer, staff, driver, or admin functionality.

---

## Customer Features

Customers can:

- Register for an account.
- Log in securely.
- Access the customer dashboard.
- Browse available vehicles.
- View vehicle information.
- Select rental dates.
- Select pickup and return locations.
- Choose self-drive.
- Request to hire a driver.
- Create bookings.
- Make payments.
- Pay using M-Pesa.
- Pay using cash.
- View booking information.
- View booking status.
- View payment status.
- View booking history.
- Receive notifications.
- Cancel eligible bookings.
- View cancellation information.
- Rate completed rentals.

---

## Staff Features

Staff members can:

- Access the staff dashboard.
- View customer bookings.
- Manage rental operations.
- View vehicle information.
- Process vehicle checkout.
- Record starting mileage.
- Record starting fuel level.
- Record vehicle condition.
- Confirm cash received during checkout.
- Assign drivers.
- View available drivers.
- Receive driver assignment acceptance notifications.
- Process vehicle check-in.
- Record ending mileage.
- Record ending fuel level.
- Record vehicle condition.
- Record damage.
- Create maintenance records when required.
- Complete rental bookings.
- Monitor operational activities.

---

## Driver Features

Drivers are company-hired drivers who handle customer rentals assigned to them by staff.

Drivers can:

- Log in to their account.
- Access the driver dashboard.
- View assignments.
- Review booking information.
- Accept assignments.
- View trips.
- Manage trip status.
- View notifications.
- View their profile.

Customers do not select individual drivers.

Drivers are assigned by staff based on availability and rental requirements.

---

## Admin Features

Administrators can:

- Access the admin dashboard.
- Manage users.
- Manage customers.
- Manage staff.
- Manage drivers.
- Manage vehicles.
- Manage pricing.
- Configure rental policies.
- View bookings.
- View payments.
- Manage maintenance.
- View reports.
- View analytics.
- Monitor system activity.
- Manage relevant system information.

---

# Technology Stack

## Frontend

- React.js
- JavaScript
- Vite
- React Router
- Tailwind CSS
- Axios
- Context API and application state management

## Backend

- Python
- Flask
- Flask REST API
- Flask-JWT-Extended
- SQLAlchemy
- Flask-Migrate

## Database

- PostgreSQL

## Payment Integration

- Safaricom M-Pesa Daraja API
- Cash payment processing

## Development Tools

- Git
- GitHub
- Visual Studio Code
- Postman
- ngrok
- npm
- Python virtual environments

---

# System Architecture

DriveGo follows a client-server architecture.

```text
                         DRIVEGO SYSTEM
                              |
        +---------------------+---------------------+
        |                     |                     |
        v                     v                     v
      Guest               Customer              Staff
        |                     |                     |
        +---------------------+---------------------+
                              |
                              v
                       React Frontend
                              |
                         REST API / HTTP
                              |
                              v
                       Flask Backend
                              |
                    +---------+---------+
                    |         |         |
                    v         v         v
             Authentication Bookings Payments
                    |         |         |
                    +---------+---------+
                              |
                         SQLAlchemy ORM
                              |
                              v
                         PostgreSQL
                              |
               +--------------+--------------+
               |                             |
               v                             v
          Application                   M-Pesa Daraja
           Services                         API