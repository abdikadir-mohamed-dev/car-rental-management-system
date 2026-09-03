from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime, timezone
import os
from app.models.user import User
from app.models.driver import Customer
from app.models.notification import Notification
from app import db

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


def create_notification(user_id, title, message):
    try:
        notification = Notification(user_id=user_id, title=title, message=message)
        db.session.add(notification)
    except Exception:
        pass


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    name = data.get("name", "").strip() if data.get("name") else None
    email = data.get("email", "").strip().lower() if data.get("email") else None
    password = data.get("password")
    phone = data.get("phone", "").strip() if data.get("phone") else None
    drivers_license = (
        data.get("driversLicense", "").strip() if data.get("driversLicense") else None
    )
    license_expiry = (
        data.get("licenseExpiry", "").strip() if data.get("licenseExpiry") else None
    )
    country = data.get("country", "").strip() if data.get("country") else None

    if not name or not email or not password:
        return jsonify({"message": "Name, email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists with this email"}), 400

    user = User(
        name=name,
        email=email,
        phone=phone,
        role="customer",
        password_hash=generate_password_hash(password),
        drivers_license=drivers_license,
        license_expiry=license_expiry,
        country=country,
    )
    db.session.add(user)
    db.session.flush()

    if user.role == "customer":
        customer = Customer(user_id=user.id)
        db.session.add(customer)

    db.session.commit()

    admins = User.query.filter_by(role="admin", is_active=True).all()
    staff = User.query.filter_by(role="staff", is_active=True).all()
    for admin in admins:
        create_notification(
            admin.id,
            "New Customer Registered",
            f"{user.name} ({user.email}) created an account.",
        )
    for s in staff:
        create_notification(
            s.id,
            "New Customer Registered",
            f"{user.name} ({user.email}) created an account.",
        )

    token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(days=7),
    )

    return (
        jsonify(
            {
                "user": {
                    "_id": str(user.id),
                    "id": str(user.id),
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone,
                    "role": user.role,
                    "driversLicense": user.drivers_license,
                    "licenseExpiry": user.license_expiry,
                    "country": user.country,
                    "profilePhoto": user.profile_photo,
                    "createdAt": (
                        user.created_at.isoformat() if user.created_at else None
                    ),
                    "updatedAt": (
                        user.updated_at.isoformat() if user.updated_at else None
                    ),
                },
                "token": token,
            }
        ),
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if (
        not user
        or not user.password_hash
        or not check_password_hash(user.password_hash, password)
    ):
        return jsonify({"message": "Invalid email or password"}), 401

    user.last_login = datetime.now(timezone.utc)
    db.session.commit()

    if user.role == "customer":
        admins = User.query.filter_by(role="admin", is_active=True).all()
        for admin in admins:
            notification = Notification(
                user_id=admin.id,
                title="Customer Login",
                message=f"{user.name} ({user.email}) logged in.",
            )
            db.session.add(notification)
        db.session.commit()

    token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(days=7),
    )

    return (
        jsonify(
            {
                "user": {
                    "_id": str(user.id),
                    "id": str(user.id),
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone,
                    "role": user.role,
                    "driversLicense": user.drivers_license,
                    "licenseExpiry": user.license_expiry,
                    "country": user.country,
                    "profilePhoto": user.profile_photo,
                    "createdAt": (
                        user.created_at.isoformat() if user.created_at else None
                    ),
                    "updatedAt": (
                        user.updated_at.isoformat() if user.updated_at else None
                    ),
                },
                "token": token,
            }
        ),
        200,
    )


@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email is required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "No user found with that email"}), 404
    reset_token = (
        __import__("random").choice("abcdefghijklmnopqrstuvwxyz0123456789") * 8
    )
    user.reset_password_token = reset_token
    user.reset_password_expire = int((datetime.now(timezone.utc).timestamp() + 3600))
    db.session.commit()
    return (
        jsonify(
            {"message": "Password reset token sent to email", "resetToken": reset_token}
        ),
        200,
    )


@auth_bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    data = request.get_json() or {}
    password = data.get("password")
    if not password:
        return jsonify({"message": "Password is required"}), 400
    user = User.query.filter_by(reset_password_token=token).first()
    if (
        not user
        or not user.reset_password_expire
        or user.reset_password_expire < datetime.now(timezone.utc).timestamp()
    ):
        return jsonify({"message": "Invalid or expired reset token"}), 400
    user.password_hash = generate_password_hash(password)
    user.reset_password_token = None
    user.reset_password_expire = None
    db.session.commit()
    return jsonify({"message": "Password reset successful"}), 200


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return (
        jsonify(
            {
                "user": {
                    "_id": str(user.id),
                    "id": str(user.id),
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone,
                    "role": user.role,
                    "driversLicense": user.drivers_license,
                    "licenseExpiry": user.license_expiry,
                    "country": user.country,
                    "profilePhoto": user.profile_photo,
                    "createdAt": (
                        user.created_at.isoformat() if user.created_at else None
                    ),
                    "updatedAt": (
                        user.updated_at.isoformat() if user.updated_at else None
                    ),
                }
            }
        ),
        200,
    )


@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    for field in [
        "name",
        "email",
        "phone",
        "drivers_license",
        "license_expiry",
        "country",
        "profile_photo",
    ]:
        if field in data:
            setattr(user, field, data[field])
    db.session.commit()
    return (
        jsonify(
            {
                "user": {
                    "_id": str(user.id),
                    "id": str(user.id),
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone,
                    "role": user.role,
                    "driversLicense": user.drivers_license,
                    "licenseExpiry": user.license_expiry,
                    "country": user.country,
                    "profilePhoto": user.profile_photo,
                    "createdAt": (
                        user.created_at.isoformat() if user.created_at else None
                    ),
                    "updatedAt": (
                        user.updated_at.isoformat() if user.updated_at else None
                    ),
                }
            }
        ),
        200,
    )


@auth_bp.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    current_password = data.get("currentPassword")
    new_password = data.get("newPassword")
    if not current_password or not new_password:
        return (
            jsonify({"message": "Current password and new password are required"}),
            400,
        )
    if not check_password_hash(user.password_hash, current_password):
        return jsonify({"message": "Current password is incorrect"}), 400
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"message": "Password changed successfully"}), 200


@auth_bp.route("/config", methods=["GET"])
def public_config():
    return (
        jsonify(
            {
                "mpesaPaymentNumber": os.getenv("MPESA_PAYMENT_NUMBER", "0728268111"),
                "mpesaEnvironment": os.getenv("MPESA_ENVIRONMENT", "sandbox"),
                "businessName": "DriveGo Car Rental",
                "businessAddress": "123 Main Street, Nairobi, Kenya",
                "businessPhone": "+254 700 123 456",
                "businessEmail": "info@drivego.com",
            }
        ),
        200,
    )
