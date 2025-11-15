from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import METRICS_DB, ASSESSMENTS_DB
from .redisClient import redis_client  # Добавляем импорт Redis

# Импортируем логгер
from .logger import dashboard_logger

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
        user_id = get_jwt_identity()

        # Пытаемся получить метрики из кэша Redis
        cache_key = f"user:{user_id}:metrics"
        cached_metrics = redis_client.get_json(cache_key)

        if cached_metrics:
            return jsonify({
                'metrics': cached_metrics,
                'period': 'week',
                'total': len(cached_metrics),
            }), 200

        # Если в кэше нет, получаем из базы
        metrics = METRICS_DB.get(user_id, [])

        # Сохраняем в кэш Redis на 1 час
        redis_client.set_json(cache_key, metrics, ttl_seconds=3600)

        return jsonify({
            'metrics': metrics,
            'period': 'week',
            'total': len(metrics),
        }), 200


    except Exception as e:
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
        user_id = get_jwt_identity()

        dashboard_logger.info(f"Запрос сводки дашборда для пользователя ID: {user_id}")

        # Пытаемся получить сводку из кэша
        cache_key = f"user:{user_id}:summary"
        cached_summary = redis_client.get_json(cache_key)

        if cached_summary:
            return jsonify(cached_summary), 200

        # Получаем последнюю диагностику
        assessments = ASSESSMENTS_DB.get(user_id, [])
        latest_assessment = assessments[0] if assessments else None

        # Получаем метрики
        metrics = METRICS_DB.get(user_id, [])

        summary = {
            'latestAssessment': None,
            'metrics': metrics,
            'totalAssessments': len(assessments),
        }

        if latest_assessment:
            summary['latestAssessment'] = {
                'date': latest_assessment['date'],
                'burnoutLevel': latest_assessment['burnoutLevel'],
                'score': latest_assessment['score'],
                'emotionalExhaustion': latest_assessment['emotionalExhaustion'],
                'depersonalization': latest_assessment['depersonalization'],
                'reducedAccomplishment': latest_assessment['reducedAccomplishment'],
            }
            dashboard_logger.info(f"Последняя диагностика для пользователя ID: {user_id} - уровень: {latest_assessment['burnoutLevel']}, балл: {latest_assessment['score']}")
        else:
            dashboard_logger.info(f"Нет диагностик для пользователя ID: {user_id}")

        # Сохраняем сводку в кэш на 30 минут
        redis_client.set_json(cache_key, summary, ttl_seconds=1800)

        return jsonify(summary), 200

    except Exception as e:
        dashboard_logger.error(f"Ошибка при получении сводки: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500