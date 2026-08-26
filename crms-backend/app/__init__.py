from flask import Flask
from flask_cors import CORS
from config import Config
from app.extensions import db, migrate
from app.models import user, vehicle, policy, report, shift
from app.routes import bp
from app.routes.auth import auth_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(bp)
    app.register_blueprint(auth_bp)

    return app
