from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.data.logger import app_logger
from routes.data.config import get_config
from routes.db.database import init_db

app_logger.info("=" * 50)
app_logger.info("Запуск приложения Flask")
app_logger.info("=" * 50)

app = Flask(__name__)

config = get_config()
app.config.from_object(config)

app_logger.info(f"Конфигурация загружена: {config.__name__}")
app_logger.info(f"БД: {app.config['SQLALCHEMY_DATABASE_URI']}")

try:
    init_db(app)
    app_logger.info("SQLAlchemy инициализирована")
except Exception as e:
    app_logger.warning(f"Не удалось подключиться к БД: {e}")
    app_logger.info("Приложение запустится без БД")

CORS(app, resources={r"/*": {"origins": "*"}})
app_logger.info("CORS инициализирован")

jwt = JWTManager(app)
app_logger.info("JWT инициализирован")

from routes.auth import auth_bp
from routes.assessment import assessment_bp
from routes.dashboard import dashboard_bp
from routes.recommendations import recommendations_bp
from routes.ai import ai_bp

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(assessment_bp, url_prefix='/assessment')
app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
app.register_blueprint(recommendations_bp, url_prefix='/recommendations')
app.register_blueprint(ai_bp, url_prefix='/ai')

app_logger.info("Все blueprints зарегистрированы")

# Health check endpoint для Docker
@app.route('/health', methods=['GET'])
def health():
    """Проверка здоровья приложения"""
    return jsonify({'status': 'healthy', 'message': 'Application is running'}), 200

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

if __name__ == '__main__':
    # Запускаем на 0.0.0.0:8000 чтобы совпадать с ожиданиями фронтенда (VITE_API_URL по умолчанию http://localhost:8000)
    app_logger.info("Запуск Flask на http://0.0.0.0:8000")
    app.run(host='0.0.0.0', port=8000, debug=False)
