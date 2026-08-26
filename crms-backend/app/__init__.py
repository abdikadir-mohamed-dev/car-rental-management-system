from flask import Flask
from flask_cors import CORS
from config import Config
from app.extensions import db, migrate, jwt
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
    jwt.init_app(app)

    app.register_blueprint(bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(vehicles_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(payments_bp)

    return app
