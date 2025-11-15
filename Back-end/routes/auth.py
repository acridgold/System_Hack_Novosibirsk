from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import USERS_DB
from datetime import datetime, timedelta
from .redisClient import redis_client  # Добавляем импорт Redis

from .logger import auth_logger

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
        if email in USERS_DB:
            auth_logger.warning(f"Попытка регистрации с существующим email: {email}")
            return jsonify({'detail': 'Email already registered'}), 409

        # Проверка длины пароля
        if len(password) < 6:
            auth_logger.warning(f"Попытка регистрации с коротким паролем для {email}")
            return jsonify({'detail': 'Password must be at least 6 characters'}), 400

        # Генерируем новый ID (наибольший ID + 1)
        max_id = max([user['id'] for user in USERS_DB.values()], default=0)
        new_user_id = max_id + 1

        # Создаем нового пользователя
        new_user = {
            'id': new_user_id,
            'email': email,
            'password': password,  # В реальном приложении нужно хешировать пароль!
            'name': name,
            'position': position,
            'department': department,
            'joinDate': datetime.now().strftime('%Y-%m-%d'),
            'daysInSystem': 0,
            'completedRecommendations': 0,
            'avatar': None,
        }

        # Сохраняем пользователя в БД
        USERS_DB[email] = new_user

        auth_logger.info(f"Новый пользователь зарегистрирован: {email} (ID: {new_user_id})")

        # Создаем JWT токен с временем жизни 24 часа
        access_token = create_access_token(
            identity=str(new_user_id),
            expires_delta=timedelta(hours=24)
        )

        # Сохраняем токен в Redis на 24 часа
        token_cache_key = f"user:{new_user_id}:token"
        redis_client.set_json(token_cache_key, {
            'token': access_token,
            'user_id': new_user_id,
            'email': email,
            'created_at': datetime.now().isoformat()
        }, ttl_seconds=86400)  # 24 часа

        auth_logger.info(f"JWT токен сохранен в Redis для пользователя ID: {new_user_id}")

        return jsonify({
            'access_token': access_token,
            'token_type': 'bearer',
            'user': {
                'id': new_user['id'],
                'email': new_user['email'],
                'name': new_user['name'],
                'position': new_user['position'],
                'department': new_user['department'],
                'joinDate': new_user['joinDate'],
                'daysInSystem': new_user['daysInSystem'],
                'completedRecommendations': new_user['completedRecommendations'],
            }
        }), 201

    except Exception as e:
        auth_logger.error(f"Ошибка при регистрации: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500

@auth_bp.route('/token', methods=['POST'])
def login():
    """
    Авторизация пользователя
    POST /auth/token

    Формат: application/x-www-form-urlencoded
    - username: email пользователя
    - password: пароль
    """
    try:
        username = request.form.get('username')
        password = request.form.get('password')

        auth_logger.info(f"Попытка входа для пользователя: {username}")

        if not username or not password:
            auth_logger.warning(f"Ошибка входа: отсутствуют учетные данные для {username}")
            return jsonify({'detail': 'Email and password are required'}), 400

        # Ищем пользователя
        user = USERS_DB.get(username)

        if not user or user['password'] != password:
            auth_logger.warning(f"Неверные учетные данные для пользователя: {username} {password}")
            return jsonify({'detail': 'Invalid email or password'}), 401

        # Создаем JWT токен с временем жизни 24 часа
        access_token = create_access_token(
            identity=str(user['id']),
            expires_delta=timedelta(hours=24)
        )

        # Сохраняем токен в Redis на 24 часа
        token_cache_key = f"user:{user['id']}:token"
        redis_client.set_json(token_cache_key, {
            'token': access_token,
            'user_id': user['id'],
            'email': user['email'],
            'created_at': datetime.now().isoformat()
        }, ttl_seconds=86400)  # 24 часа

        auth_logger.info(f"Пользователь {username} (ID: {user['id']}) успешно авторизован, токен сохранен в Redis")

        return jsonify({
            'access_token': access_token,
            'token_type': 'bearer',
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'position': user['position'],
                'department': user['department'],
            }
        }), 200

    except Exception as e:
        auth_logger.error(f"Ошибка при авторизации: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    auth_logger.info("Запрос проверки валидности токена")
    """
    Проверка валидности токена
    GET /auth/verify
    Header: Authorization: Bearer {token}
    """
    try:
        user_id = get_jwt_identity()
        user_id_int = int(user_id)  # Преобразуем строку в число

        # Ищем пользователя по ID
        for email, user in USERS_DB.items():
            if user['id'] == user_id_int:
                return jsonify({
                    'valid': True,
                    'user_id': user_id,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'name': user['name'],
                    }
                }), 200

        return jsonify({'detail': 'User not found'}), 404

    except Exception as e:
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
        # Логируем заголовки для отладки
        auth_logger.info(f"Запрос текущего пользователя. Headers: {dict(request.headers)}")

        user_id = get_jwt_identity()
        auth_logger.info(f"Запрос данных пользователя ID: {user_id}")

        # Ищем пользователя по ID
        user_id_int = int(user_id)  # Преобразуем строку в число
        for user in USERS_DB.values():
            if user['id'] == user_id_int:
                auth_logger.info(f"Данные пользователя получены: {user['email']}")
                return jsonify({
                    'id': user['id'],
                    'email': user['email'],
                    'name': user['name'],
                    'position': user['position'],
                    'department': user['department'],
                    'joinDate': user['joinDate'],
                    'daysInSystem': user['daysInSystem'],
                    'completedRecommendations': user['completedRecommendations'],
                    'avatar': user['avatar'],
                }), 200

        auth_logger.warning(f"Пользователь не найден по ID: {user_id}")
        return jsonify({'detail': 'User not found'}), 404

    except Exception as e:
        auth_logger.error(f"Ошибка при получении данных пользователя: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500
