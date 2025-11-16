"""
API endpoints для AI рекомендаций менеджеру
"""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .utils.ai import generate_manager_recommendations, generate_recommendations_groq
from .data.logger import app_logger

ai_manager_bp = Blueprint('ai_manager', __name__)


@ai_manager_bp.route('/manager-recommendations', methods=['POST'])
@jwt_required()
def get_manager_recommendations():
    """
    Получить AI-генерированные рекомендации для менеджера через Yandex GPT

    Body:
    {
        "critical": 2,
        "warning": 2,
        "good": 1,
        "total": 5,
        "avg_burnout": 60
    }

    Returns:
    {
        "recommendations": ["...", "..."],
        "generated_by": "ai" | "fallback"
    }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Валидация данных
        team_stats = {
            'critical': data.get('critical', 0),
            'warning': data.get('warning', 0),
            'good': data.get('good', 0),
            'total': data.get('total', 0),
            'avg_burnout': data.get('avg_burnout', 0),
        }

        app_logger.info(f"Генерация рекомендаций для менеджера {user_id}: {team_stats}")

        # Генерация рекомендаций через Yandex GPT
        recommendations = generate_manager_recommendations(team_stats)

        return jsonify({
            'recommendations': recommendations,
            'generated_by': 'ai' if len(recommendations) > 0 else 'fallback',
            'timestamp': data.get('timestamp')
        }), 200

    except Exception as e:
        app_logger.error(f"Ошибка при генерации рекомендаций: {str(e)}")
        return jsonify({'error': 'Ошибка генерации рекомендаций'}), 500


@ai_manager_bp.route('/manager-recommendations-groq', methods=['POST'])
@jwt_required()
def get_manager_recommendations_groq():
    """
    Альтернативный endpoint через Yandex GPT (замена устаревшего Groq API)
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        team_stats = {
            'critical': data.get('critical', 0),
            'warning': data.get('warning', 0),
            'good': data.get('good', 0),
            'total': data.get('total', 0),
            'avg_burnout': data.get('avg_burnout', 0),
        }

        recommendations = generate_recommendations_groq(team_stats)

        return jsonify({
            'recommendations': recommendations,
            'generated_by': 'yandex_gpt',
        }), 200

    except Exception as e:
        app_logger.error(f"Ошибка Yandex GPT API: {str(e)}")
        return jsonify({'error': 'Ошибка генерации рекомендаций'}), 500
