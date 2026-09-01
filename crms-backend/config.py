import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get(
        'SECRET_KEY',
        'change-me-in-production'
    )

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'postgresql://postgres:postgres@localhost:5432/crms_db'
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    
    JWT_SECRET_KEY = os.environ.get(
    'JWT_SECRET_KEY',
    'crms-jwt-secret-key-2026-development-only-very-long'
)

    JWT_ACCESS_TOKEN_EXPIRES = 7 * 24 * 3600

    # M-Pesa / Safaricom Daraja configuration
    MPESA_CONSUMER_KEY = os.environ.get('MPESA_CONSUMER_KEY')
    MPESA_CONSUMER_SECRET = os.environ.get('MPESA_CONSUMER_SECRET')
    MPESA_PASSKEY = os.environ.get('MPESA_PASSKEY')

    MPESA_SHORTCODE = os.environ.get(
        'MPESA_SHORTCODE',
        '174379'
    )

    MPESA_ENVIRONMENT = os.environ.get(
        'MPESA_ENVIRONMENT',
        'sandbox'
    )