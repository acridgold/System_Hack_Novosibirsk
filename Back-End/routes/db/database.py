"""
Инициализация SQLAlchemy и создание базы данных
"""
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import declarative_base

# Создаем экземпляр SQLAlchemy
db = SQLAlchemy()

def init_db(app):
    """Инициализировать БД с приложением Flask"""
    db.init_app(app)

    with app.app_context():
        # Создаем все таблицы на основе моделей
        db.create_all()
        print("Таблицы БД созданы/проверены успешно")

def reset_db(app):
    """Удалить все таблицы и создать заново (для разработки)"""
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("БД полностью переинициализирована")

