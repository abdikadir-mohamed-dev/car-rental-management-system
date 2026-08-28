from flask import Flask
from flask_cors import CORS
from config import Config
from app.extensions import db, migrate, jwt
from app.models import user, vehicle, policy, report, shift, booking, payment
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


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    app.register_blueprint(bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(vehicles_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(staff_bp)
    app.register_blueprint(driver_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(inspections_bp)
    app.register_blueprint(trips_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(driver_assignments_bp)

    return app
