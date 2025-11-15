"""
Конфигурация приложения и подключения к БД
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Базовая конфигурация"""
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')

    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 86400))

    # Database
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = os.getenv('DB_PORT')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_NAME = os.getenv('DB_NAME')

    # SQLAlchemy
    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True  # Логирование SQL запросов

class DevelopmentConfig(Config):
    """Конфигурация для разработки"""
    DEBUG = True

class ProductionConfig(Config):
    """Конфигурация для продакшена"""
    DEBUG = False
    SQLALCHEMY_ECHO = False

class TestingConfig(Config):
    """Конфигурация для тестирования"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# Выбор конфигурации
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Получить конфигурацию на основе окружения"""
    env = os.getenv('FLASK_ENV')
    return config.get(env, config['default'])

