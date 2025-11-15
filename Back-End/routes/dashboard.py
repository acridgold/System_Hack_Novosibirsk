from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .db.db_models import Metric, Assessment, User

# Импортируем логгер
from .data.logger import dashboard_logger

# Доп. импорт для определения ошибок БД
import psycopg2
import sqlalchemy
from sqlalchemy import exc as sa_exc

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/metrics', methods=['GET'])
@jwt_required()
def get_metrics():
    """
    Получить метрики дашборда (последние 7 дней)
    GET /dashboard/metrics
    Header: Authorization: Bearer {token}
    """
    try:
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)

        dashboard_logger.info(f"Запрос метрик для пользователя ID: {user_id}")

        # Получаем все метрики пользователя
        metrics = Metric.query.filter_by(user_id=user_id).all()

        dashboard_logger.info(f"Найдено {len(metrics)} метрик для пользователя ID: {user_id}")

        return jsonify({
            'metrics': [m.to_dict() for m in metrics],
            'period': 'week',
            'total': len(metrics),
        }), 200

    except (psycopg2.OperationalError, sqlalchemy.exc.OperationalError) as e:
        dashboard_logger.error(f"Ошибка подключения к БД при получении метрик: {e}", exc_info=True)
        return jsonify({'detail': 'Service unavailable (database)'}), 503

    except Exception as e:
        dashboard_logger.error(f"Ошибка при получении метрик: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500

@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    """
    Получить сводку дашборда с последней диагностикой и общей статистикой
    GET /dashboard/summary
    Header: Authorization: Bearer {token}
    """
    try:
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)

        dashboard_logger.info(f"Запрос сводки дашборда для пользователя ID: {user_id}")

        # Проверяем, что пользователь существует
        user = User.query.get(user_id)
        if not user:
            dashboard_logger.warning(f"Пользователь ID: {user_id} не найден")
            return jsonify({'detail': 'User not found'}), 404

        # Получаем последнюю диагностику
        latest_assessment = Assessment.query.filter_by(user_id=user_id).order_by(
            Assessment.date.desc()
        ).first()

        # Получаем все диагностики (для подсчета)
        all_assessments = Assessment.query.filter_by(user_id=user_id).all()

        # Получаем метрики
        metrics = Metric.query.filter_by(user_id=user_id).all()

        summary = {
            'latestAssessment': None,
            'metrics': [m.to_dict() for m in metrics],
            'totalAssessments': len(all_assessments),
        }

        if latest_assessment:
            summary['latestAssessment'] = latest_assessment.to_dict()
            dashboard_logger.info(f"Последняя диагностика для пользователя ID: {user_id} - уровень: {latest_assessment.burnout_level}, балл: {latest_assessment.score}")
        else:
            dashboard_logger.info(f"Нет диагностик для пользователя ID: {user_id}")

        return jsonify(summary), 200

    except (psycopg2.OperationalError, sqlalchemy.exc.OperationalError) as e:
        dashboard_logger.error(f"Ошибка подключения к БД при получении сводки: {e}", exc_info=True)
        return jsonify({'detail': 'Service unavailable (database)'}), 503

    except Exception as e:
        dashboard_logger.error(f"Ошибка при получении сводки: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500
