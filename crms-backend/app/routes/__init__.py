from flask import Blueprint

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

from app.routes import admin  # noqa: E402,F401
bp = Blueprint('auth', __name__)

from app.routes import auth
