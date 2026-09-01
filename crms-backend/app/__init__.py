from flask import Flask
from flask_cors import CORS
from config import Config
from app.extensions import db, migrate, jwt

# ============================================================
# Import all models so SQLAlchemy knows about them
# ============================================================

from app.models import (
    user,
    vehicle,
    policy,
    report,
    shift,
    booking,
    payment,
    trip,
    driver_assignment,
    inspection,
    notification,
    driver,
    earning,
    maintenance,
    saved_car,
)

# ============================================================
# Import routes
# ============================================================

from app.routes import bp
from app.routes.auth import auth_bp
from app.routes.vehicles import bp as vehicles_bp
from app.routes.bookings import bp as bookings_bp
from app.routes.payments import bp as payments_bp
from app.routes.users import bp as users_bp
from app.routes.staff import bp as staff_bp
from app.routes.driver import bp as driver_bp
from app.routes.reports import bp as reports_bp
from app.routes.inspections import bp as inspections_bp
from app.routes.trips import bp as trips_bp
from app.routes.notifications import bp as notifications_bp
from app.routes.driver_assignments import bp as driver_assignments_bp
from app.routes.saved_cars import bp as saved_cars_bp


def create_app():
    app = Flask(__name__)

    # ========================================================
    # Configuration
    # ========================================================

    app.config.from_object(Config)

    # ========================================================
    # CORS
    #
    # IMPORTANT:
    # Do NOT restrict this to /api/* because the application
    # also has routes such as:
    #
    # /auth/login
    # /auth/profile
    # /staff/dashboard
    #
    # Apply CORS to the entire Flask application.
    # ========================================================

    CORS(
        app,
        origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        methods=[
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allow_headers=[
            "Content-Type",
            "Authorization",
        ],
        supports_credentials=True,
    )

    # ========================================================
    # Initialize extensions
    # ========================================================

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # ========================================================
    # Register blueprints
    # ========================================================

    app.register_blueprint(bp)

    # Authentication
    app.register_blueprint(auth_bp)

    # Vehicles
    app.register_blueprint(vehicles_bp)

    # Bookings
    app.register_blueprint(bookings_bp)

    # Payments
    app.register_blueprint(payments_bp)

    # Users
    app.register_blueprint(users_bp)

    # Staff
    app.register_blueprint(staff_bp)

    # Drivers
    app.register_blueprint(driver_bp)

    # Reports
    app.register_blueprint(reports_bp)

    # Inspections
    app.register_blueprint(inspections_bp)

    # Trips
    app.register_blueprint(trips_bp)

    # Notifications
    app.register_blueprint(notifications_bp)

    # Driver assignments
    app.register_blueprint(driver_assignments_bp)

    # Saved cars
    app.register_blueprint(saved_cars_bp)

    return app