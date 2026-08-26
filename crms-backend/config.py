import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'change-me-in-production')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/crms_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
