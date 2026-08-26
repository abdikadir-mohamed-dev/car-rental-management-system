from flask import Flask
from flask_cors import CORS
from config import Config
from app.extensions import db, migrate
from app.models import user, vehicle, policy, report, shift, booking, payment
from app.routes import bp
from app.routes.auth import auth_bp
from app.routes.vehicles import vehicles_bp
from app.routes.bookings import bookings_bp
from app.routes.payments import payments_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(vehicles_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(payments_bp)
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from app.routes import auth, staff, bookings, vehicles, trips, inspections, driver_assignments, reports, notifications

    app.register_blueprint(auth.bp)
    app.register_blueprint(staff.bp)
    app.register_blueprint(bookings.bp)
    app.register_blueprint(vehicles.bp)
    app.register_blueprint(trips.bp)
    app.register_blueprint(inspections.bp)
    app.register_blueprint(driver_assignments.bp)
    app.register_blueprint(reports.bp)
    app.register_blueprint(notifications.bp)

    @app.route('/api/health')
    def health():
        return {'status': 'ok'}, 200

    return app
