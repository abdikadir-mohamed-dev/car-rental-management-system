from flask import Blueprint

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

from app.routes import admin  # noqa: E402,F401

from app.routes import auth, vehicles, bookings, payments, users, staff, driver, reports, inspections, trips, notifications, driver_assignments  # noqa: E402,F401
