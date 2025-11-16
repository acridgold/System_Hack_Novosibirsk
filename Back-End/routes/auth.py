from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .db.db_models import User
from .db.database import db

from .data.logger import auth_logger

# Доп. импорт для определения ошибок БД
import psycopg2
import sqlalchemy

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Регистрация нового пользователя
    POST /auth/register

    Формат: application/json
    {
        "email": "user@example.com",
        "password": "password123",
        "name": "Иван Петров",
        "position": "Старший курьер",
        "department": "Отдел доставки"
    }
    """
    try:
        data = request.get_json()

        # Проверка обязательных полей
        required_fields = ['email', 'password', 'name', 'position', 'department']
        for field in required_fields:
            if not data.get(field):
                auth_logger.warning(f"Ошибка регистрации: отсутствует поле {field}")
                return jsonify({'detail': f'Field "{field}" is required'}), 400

        email = data.get('email').lower().strip()
        password = data.get('password')
        name = data.get('name')
        position = data.get('position')
        department = data.get('department')

        # Проверка, что пользователь еще не зарегистрирован
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            auth_logger.warning(f"Попытка регистрации с существующим email: {email}")
            return jsonify({'detail': 'Email already registered'}), 409

        # Проверка длины пароля
        if len(password) < 6:
            auth_logger.warning(f"Попытка регистрации с коротким паролем для {email}")
            return jsonify({'detail': 'Password must be at least 6 characters'}), 400

        # Создаем нового пользователя
        new_user = User(
            email=email,
            password=password,  # В реальном приложении нужно хешировать пароль!
            name=name,
            position=position,
            department=department,
            days_in_system=0,
            completed_recommendations=0
        )

        # Сохраняем пользователя в БД
        db.session.add(new_user)
        db.session.commit()

        auth_logger.info(f"Новый пользователь зарегистрирован: {email} (ID: {new_user.id})")

        # Создаем JWT токен
        access_token = create_access_token(identity=str(new_user.id))

        return jsonify({
            'access_token': access_token,
            'token_type': 'bearer',
            'user': new_user.to_dict()
        }), 201

    except (psycopg2.OperationalError, sqlalchemy.exc.OperationalError) as e:
        # Ошибка подключения к БД — возвращаем 503
        try:
            db.session.rollback()
        except Exception:
            pass
        auth_logger.error(f"Ошибка подключения к БД при регистрации: {e}", exc_info=True)
        return jsonify({'detail': 'Service unavailable (database)'}), 503

    except Exception as e:
        try:
            db.session.rollback()
        except Exception:
            pass
        auth_logger.error(f"Ошибка при регистрации: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500

@auth_bp.route('/token', methods=['POST'])
def login():
    """
    Авторизация пользователя
    POST /auth/token

    Формат: application/x-www-form-urlencoded или application/json
    - username: email пользователя
    - password: пароль
    """
    try:
        # Поддерживаем оба формата: form-data и JSON
        if request.is_json:
            data = request.get_json()
            username = data.get('username') or data.get('email')
            password = data.get('password')
        else:
            username = request.form.get('username') or request.form.get('email')
            password = request.form.get('password')

        auth_logger.info(f"Попытка входа для пользователя: {username}")

        if not username or not password:
            auth_logger.warning(f"Ошибка входа: отсутствуют учетные данные для {username}")
            return jsonify({'detail': 'Email and password are required'}), 400

        # Ищем пользователя в БД
        user = User.query.filter_by(email=username.lower().strip()).first()

        if not user or user.password != password:
            auth_logger.warning(f"Неверные учетные данные для пользователя: {username}")
            return jsonify({'detail': 'Invalid email or password'}), 401

        # Создаем JWT токен
        access_token = create_access_token(identity=str(user.id))

        auth_logger.info(f"Пользователь {username} (ID: {user.id}) успешно авторизован")

        return jsonify({
            'access_token': access_token,
            'token_type': 'bearer',
            'user': user.to_dict()
        }), 200

    except (psycopg2.OperationalError, sqlalchemy.exc.OperationalError) as e:
        auth_logger.error(f"Ошибка подключения к БД при авторизации: {e}", exc_info=True)
        return jsonify({'detail': 'Service unavailable (database)'}), 503

    except Exception as e:
        auth_logger.error(f"Ошибка при авторизации: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """
    Проверка валидности токена
    GET /auth/verify
    Header: Authorization: Bearer {token}
    """
    try:
        auth_logger.info("Запрос проверки валидности токена")
        user_id = get_jwt_identity()
        user_id_int = int(user_id)

        # Ищем пользователя по ID
        user = User.query.get(user_id_int)

        if not user:
            auth_logger.warning(f"Пользователь не найден по ID: {user_id}")
            return jsonify({'detail': 'User not found'}), 404

        return jsonify({
            'valid': True,
            'user_id': user_id,
            'user': user.to_dict()
        }), 200

    except (psycopg2.OperationalError, sqlalchemy.exc.OperationalError) as e:
        auth_logger.error(f"Ошибка подключения к БД при проверке токена: {e}", exc_info=True)
        return jsonify({'detail': 'Service unavailable (database)'}), 503

    except Exception as e:
        auth_logger.error(f"Ошибка при проверке токена: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Получить данные текущего пользователя
    GET /auth/me
    Header: Authorization: Bearer {token}
    """
    try:
        auth_logger.info(f"Запрос текущего пользователя")
        user_id = get_jwt_identity()
        user_id_int = int(user_id)

        auth_logger.info(f"Запрос данных пользователя ID: {user_id_int}")

        # Ищем пользователя по ID
        user = User.query.get(user_id_int)

        if not user:
            auth_logger.warning(f"Пользователь не найден по ID: {user_id}")
            return jsonify({'detail': 'User not found'}), 404

        auth_logger.info(f"Данные пользователя получены: {user.email}")
        return jsonify(user.to_dict()), 200

    except (psycopg2.OperationalError, sqlalchemy.exc.OperationalError) as e:
        auth_logger.error(f"Ошибка подключения к БД при получении текущего пользователя: {e}", exc_info=True)
        return jsonify({'detail': 'Service unavailable (database)'}), 503

    except Exception as e:
        auth_logger.error(f"Ошибка при получении данных пользователя: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500
