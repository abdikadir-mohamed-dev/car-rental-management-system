from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from app.config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    
    with app.app_context():
        from app.routes import auth, driver, bookings, vehicles, customers, maintenance, notifications, payments
        app.register_blueprint(auth.bp)
        app.register_blueprint(driver.bp)
        app.register_blueprint(bookings.bp)
        app.register_blueprint(vehicles.bp)
        app.register_blueprint(customers.bp)
        app.register_blueprint(maintenance.bp)
        app.register_blueprint(notifications.bp)
        app.register_blueprint(payments.bp)
    
    return app
