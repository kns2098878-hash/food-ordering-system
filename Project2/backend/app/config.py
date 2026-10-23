import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

class Config:
    """Base application configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'foodie-fallback-secret-key-2026-production-ready-32-chars')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'foodie-fallback-jwt-secret-key-2026-production-ready-32-chars')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES_HOURS', '24')))

    # MySQL connection string with PyMySQL driver
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '143*riharika')
    DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_NAME = os.getenv('DB_NAME', 'foodie_db')

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True,
    }

    # CORS settings
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            'CORS_ORIGINS',
            'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000'
        ).split(',')
        if origin.strip()
    ]


class TestConfig(Config):
    """Testing configuration with SQLite or test DB."""
    TESTING = True
    # Use SQLite memory or isolated test database for unit tests
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_ENGINE_OPTIONS = {}
    SECRET_KEY = 'test-secret-key-32-chars-minimum-valid-hmac-sha256'
    JWT_SECRET_KEY = 'test-jwt-secret-32-chars-minimum-valid-hmac-sha256'
