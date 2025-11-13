from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import RECOMMENDATIONS_DB

# Импортируем логгер
from .logger import recommendations_logger

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('', methods=['GET'])
@jwt_required()
def get_recommendations():
    """
    Получить список рекомендаций для пользователя
    GET /recommendations
    Header: Authorization: Bearer {token}
    """
    try:
        user_id = get_jwt_identity()

        recommendations = RECOMMENDATIONS_DB.get(user_id, [])

        return jsonify({
            'recommendations': recommendations,
            'total': len(recommendations),
        }), 200

    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@recommendations_bp.route('/<int:recommendation_id>/complete', methods=['POST'])
@jwt_required()
def mark_recommendation_complete(recommendation_id):
    """
    Отметить рекомендацию как выполненную
    POST /recommendations/{recommendation_id}/complete
    Header: Authorization: Bearer {token}
    """
    try:
        user_id = get_jwt_identity()

        recommendations_logger.info(f"Попытка отметить рекомендацию ID: {recommendation_id} как выполненную для пользователя ID: {user_id}")

        recommendations = RECOMMENDATIONS_DB.get(user_id, [])

        for rec in recommendations:
            if rec['id'] == recommendation_id:
                rec['completed'] = True
                recommendations_logger.info(f"Рекомендация ID: {recommendation_id} отмечена как выполненная")
                return jsonify({
                    'id': rec['id'],
                    'completed': True,
                    'message': 'Recommendation marked as completed',
                }), 200

        recommendations_logger.warning(f"Рекомендация ID: {recommendation_id} не найдена для пользователя ID: {user_id}")
        return jsonify({'detail': 'Recommendation not found'}), 404

    except Exception as e:
        recommendations_logger.error(f"Ошибка при отметке рекомендации: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500

@recommendations_bp.route('/<int:recommendation_id>/incomplete', methods=['POST'])
@jwt_required()
def mark_recommendation_incomplete(recommendation_id):
    """
    Отметить рекомендацию как невыполненную
    POST /recommendations/{recommendation_id}/incomplete
    Header: Authorization: Bearer {token}
    """
    try:
        user_id = get_jwt_identity()

        recommendations = RECOMMENDATIONS_DB.get(user_id, [])

        for rec in recommendations:
            if rec['id'] == recommendation_id:
                rec['completed'] = False
                return jsonify({
                    'id': rec['id'],
                    'completed': False,
                    'message': 'Recommendation marked as incomplete',
                }), 200

        return jsonify({'detail': 'Recommendation not found'}), 404

    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@recommendations_bp.route('/<int:recommendation_id>', methods=['GET'])
@jwt_required()
def get_recommendation(recommendation_id):
    """
    Получить детали конкретной рекомендации
    GET /recommendations/{recommendation_id}
    Header: Authorization: Bearer {token}
    """
    try:
        user_id = get_jwt_identity()

        recommendations_logger.info(f"Запрос деталей рекомендации ID: {recommendation_id} для пользователя ID: {user_id}")

        recommendations = RECOMMENDATIONS_DB.get(user_id, [])

        for rec in recommendations:
            if rec['id'] == recommendation_id:
                recommendations_logger.info(f"Рекомендация ID: {recommendation_id} найдена")
                return jsonify(rec), 200

        recommendations_logger.warning(f"Рекомендация ID: {recommendation_id} не найдена для пользователя ID: {user_id}")
        return jsonify({'detail': 'Recommendation not found'}), 404

    except Exception as e:
        recommendations_logger.error(f"Ошибка при получении рекомендации: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500
