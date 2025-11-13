from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

from logger import app_logger

app_logger.info("=" * 50)
app_logger.info("Запуск приложения Flask")
app_logger.info("=" * 50)

# Инициализируем приложение Flask
app = Flask(__name__)

# Конфигурация
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 86400))

app_logger.info(f"Конфигурация загружена. JWT_ACCESS_TOKEN_EXPIRES: {app.config['JWT_ACCESS_TOKEN_EXPIRES']} секунд")

# Инициализируем CORS
CORS(app, resources={r"/*": {"origins": "*"}})
app_logger.info("CORS инициализирован")

# Инициализируем JWT
jwt = JWTManager(app)
app_logger.info("JWT инициализирован")

# Импортируем blueprints с роутами
from routes.auth import auth_bp
from routes.assessment import assessment_bp
from routes.dashboard import dashboard_bp
from routes.recommendations import recommendations_bp

# Регистрируем blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(assessment_bp, url_prefix='/assessment')
app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
app.register_blueprint(recommendations_bp, url_prefix='/recommendations')

app_logger.info("Все blueprints зарегистрированы")

# Обработчик ошибок для JWT
@app.errorhandler(401)
def unauthorized(error):
    app_logger.warning(f"Ошибка авторизации: {error}")
    return jsonify({'detail': 'Unauthorized'}), 401

@app.errorhandler(404)
def not_found(error):
    app_logger.warning(f"Ресурс не найден: {error}")
    return jsonify({'detail': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    app_logger.error(f"Внутренняя ошибка сервера: {error}", exc_info=True)
    return jsonify({'detail': 'Internal server error'}), 500

# Главный endpoint
@app.route('/health', methods=['GET'])
def health():
    app_logger.info("Проверка здоровья приложения")
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app_logger.info("Запуск Flask на http://0.0.0.0:8000")
    app.run(host='0.0.0.0', port=8000, debug=False)
