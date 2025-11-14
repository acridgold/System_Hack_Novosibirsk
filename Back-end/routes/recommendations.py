from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .db_models import Recommendation, User
from database import db

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
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)

        recommendations_logger.info(f"Запрос рекомендаций для пользователя ID: {user_id}")

        # Проверяем, что пользователь существует
        user = User.query.get(user_id)
        if not user:
            recommendations_logger.warning(f"Пользователь ID: {user_id} не найден")
            return jsonify({'detail': 'User not found'}), 404

        # Получаем все рекомендации пользователя
        recommendations = Recommendation.query.filter_by(user_id=user_id).all()

        recommendations_logger.info(f"Найдено {len(recommendations)} рекомендаций для пользователя ID: {user_id}")

        return jsonify({
            'recommendations': [r.to_dict() for r in recommendations],
            'total': len(recommendations),
        }), 200

    except Exception as e:
        recommendations_logger.error(f"Ошибка при получении рекомендаций: {str(e)}", exc_info=True)
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
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)

        recommendations_logger.info(f"Попытка отметить рекомендацию ID: {recommendation_id} как выполненную для пользователя ID: {user_id}")

        # Получаем рекомендацию, проверяя что она принадлежит пользователю
        rec = Recommendation.query.filter_by(
            id=recommendation_id,
            user_id=user_id
        ).first()

        if not rec:
            recommendations_logger.warning(f"Рекомендация ID: {recommendation_id} не найдена для пользователя ID: {user_id}")
            return jsonify({'detail': 'Recommendation not found'}), 404

        rec.completed = True
        db.session.commit()

        recommendations_logger.info(f"Рекомендация ID: {recommendation_id} отмечена как выполненная")

        return jsonify(rec.to_dict()), 200

    except Exception as e:
        db.session.rollback()
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
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)

        recommendations_logger.info(f"Попытка отметить рекомендацию ID: {recommendation_id} как невыполненную для пользователя ID: {user_id}")

        # Получаем рекомендацию, проверяя что она принадлежит пользователю
        rec = Recommendation.query.filter_by(
            id=recommendation_id,
            user_id=user_id
        ).first()

        if not rec:
            recommendations_logger.warning(f"Рекомендация ID: {recommendation_id} не найдена для пользователя ID: {user_id}")
            return jsonify({'detail': 'Recommendation not found'}), 404

        rec.completed = False
        db.session.commit()

        recommendations_logger.info(f"Рекомендация ID: {recommendation_id} отмечена как невыполненная")

        return jsonify(rec.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        recommendations_logger.error(f"Ошибка при отметке рекомендации: {str(e)}", exc_info=True)
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
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)

        recommendations_logger.info(f"Запрос деталей рекомендации ID: {recommendation_id} для пользователя ID: {user_id}")

        # Получаем рекомендацию, проверяя что она принадлежит пользователю
        rec = Recommendation.query.filter_by(
            id=recommendation_id,
            user_id=user_id
        ).first()

        if not rec:
            recommendations_logger.warning(f"Рекомендация ID: {recommendation_id} не найдена для пользователя ID: {user_id}")
            return jsonify({'detail': 'Recommendation not found'}), 404

        recommendations_logger.info(f"Рекомендация ID: {recommendation_id} найдена")
        return jsonify(rec.to_dict()), 200

    except Exception as e:
        recommendations_logger.error(f"Ошибка при получении рекомендации: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500
