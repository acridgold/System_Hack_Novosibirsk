from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import USERS_DB

from .logger import auth_logger

auth_bp = Blueprint('auth', __name__)

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

        # Создаем JWT токен
        access_token = create_access_token(identity=str(user['id']))

        auth_logger.info(f"Пользователь {username} (ID: {user['id']}) успешно авторизован")

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
