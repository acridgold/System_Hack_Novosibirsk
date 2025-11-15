from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from .models import ASSESSMENTS_DB, ASSESSMENT_QUESTIONS
from .redisClient import redis_client  # Добавляем импорт Redis

# Импортируем логгер
from logger import assessment_logger

assessment_bp = Blueprint('assessment', __name__)

def calculate_burnout_scores(answers):
    """
    Рассчитывает показатели выгорания на основе ответов
    Использует шкалу Maslach Burnout Inventory (MBI)

    Структура:
    - Emotional Exhaustion (вопросы 0-8): диапазон 0-54
    - Depersonalization (вопросы 9-13): диапазон 0-30
    - Reduced Accomplishment (вопросы 14-19): диапазон 0-36
    """
    # Эмоциональное истощение (9 вопросов)
    ee_questions = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    emotional_exhaustion = sum(int(answers.get(str(i), 0)) for i in ee_questions)

    # Деперсонализация (5 вопросов)
    dp_questions = [9, 10, 11, 12, 13]
    depersonalization = sum(int(answers.get(str(i), 0)) for i in dp_questions)

    # Снижение личных достижений (6 вопросов)
    pa_questions = [14, 15, 16, 17, 18, 19]
    reduced_accomplishment = sum(int(answers.get(str(i), 0)) for i in pa_questions)

    # Общий балл
    total_score = emotional_exhaustion + depersonalization + reduced_accomplishment

    # Определяем уровень выгорания
    if total_score >= 70:
        burnout_level = 'high'
    elif total_score >= 50:
        burnout_level = 'medium'
    else:
        burnout_level = 'low'

    return {
        'emotionalExhaustion': emotional_exhaustion,
        'depersonalization': depersonalization,
        'reducedAccomplishment': reduced_accomplishment,
        'score': total_score,
        'burnoutLevel': burnout_level,
    }

@assessment_bp.route('/questions', methods=['GET'])
def get_questions():
    """
    Получить список вопросов для диагностики
    GET /assessment/questions
    """
    try:
        return jsonify({
            'questions': ASSESSMENT_QUESTIONS,
            'total': len(ASSESSMENT_QUESTIONS),
        }), 200
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@assessment_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_assessment():
    """
    Отправить ответы на диагностику
    POST /assessment/submit
    Header: Authorization: Bearer {token}

    Body (JSON):
    {
        "answers": {
            "0": 3,
            "1": 4,
            ...
        }
    }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        assessment_logger.info(f"Получена диагностика от пользователя ID: {user_id}")

        if not data or 'answers' not in data:
            assessment_logger.warning(f"Диагностика без ответов от пользователя ID: {user_id}")
            return jsonify({'detail': 'Answers are required'}), 400

        answers = data.get('answers')

        # Проверяем, что получены ответы на все вопросы
        if len(answers) != len(ASSESSMENT_QUESTIONS):
            assessment_logger.warning(f"Неполные ответы от пользователя ID: {user_id}. Получено: {len(answers)}, ожидается: {len(ASSESSMENT_QUESTIONS)}")
            return jsonify({'detail': f'Expected {len(ASSESSMENT_QUESTIONS)} answers'}), 400

        # Рассчитываем показатели выгорания
        scores = calculate_burnout_scores(answers)

        assessment_logger.info(f"Диагностика обработана для пользователя ID: {user_id}. Уровень выгорания: {scores['burnoutLevel']}, Балл: {scores['score']}")

        # Создаем новую запись о диагностике
        assessments = ASSESSMENTS_DB.get(user_id, [])

        new_assessment_id = max([a['id'] for a in assessments], default=0) + 1

        now = datetime.utcnow()
        new_assessment = {
            'id': new_assessment_id,
            'userId': user_id,
            'date': now.strftime('%Y-%m-%d'),
            'timestamp': now.isoformat() + 'Z',
            'burnoutLevel': scores['burnoutLevel'],
            'score': scores['score'],
            'emotionalExhaustion': scores['emotionalExhaustion'],
            'depersonalization': scores['depersonalization'],
            'reducedAccomplishment': scores['reducedAccomplishment'],
            'answers': answers,
        }

        # Сохраняем в БД
        if user_id not in ASSESSMENTS_DB:
            ASSESSMENTS_DB[user_id] = []

        ASSESSMENTS_DB[user_id].insert(0, new_assessment)  # Добавляем в начало для актуальности
        # Сохраняем последнюю диагностику в Redis на 1 неделю
        last_assessment_key = f"user:{user_id}:last_assessment"
        redis_client.set_json(last_assessment_key, new_assessment, ttl_seconds=604800)  # 7 дней

        # Инвалидируем кэш сводки дашборда
        summary_cache_key = f"user:{user_id}:summary"
        redis_client.delete(summary_cache_key)

        assessment_logger.info(f"Диагностика сохранена. ID диагностики: {new_assessment['id']}")

        return jsonify({
            'id': new_assessment['id'],
            'burnoutLevel': new_assessment['burnoutLevel'],
            'score': new_assessment['score'],
            'emotionalExhaustion': new_assessment['emotionalExhaustion'],
            'depersonalization': new_assessment['depersonalization'],
            'reducedAccomplishment': new_assessment['reducedAccomplishment'],
            'timestamp': new_assessment['timestamp'],
        }), 201

    except Exception as e:
        assessment_logger.error(f"Ошибка при сохранении диагностики: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500

@assessment_bp.route('/history', methods=['GET'])
@jwt_required()
def get_assessment_history():
    """
    Получить историю диагностик пользователя
    GET /assessment/history
    Header: Authorization: Bearer {token}
    """
    try:
        user_id = get_jwt_identity()

        # Пытаемся получить историю из кэша
        cache_key = f"user:{user_id}:assessment_history"
        cached_history = redis_client.get_json(cache_key)

        if cached_history:
            return jsonify({
                'assessments': cached_history,
                'total': len(cached_history),
            }), 200

        assessments = ASSESSMENTS_DB.get(user_id, [])

        # Сохраняем историю в кэш на 1 час
        redis_client.set_json(cache_key, assessments, ttl_seconds=3600)

        return jsonify({
            'assessments': assessments,
            'total': len(assessments),
        }), 200


    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@assessment_bp.route('/<int:assessment_id>', methods=['GET'])
@jwt_required()
def get_assessment(assessment_id):
    """
    Получить детали конкретной диагностики
    GET /assessment/{assessment_id}
    Header: Authorization: Bearer {token}
    """
    try:
        user_id = get_jwt_identity()

        assessment_logger.info(f"Запрос деталей диагностики ID: {assessment_id} для пользователя ID: {user_id}")

        assessments = ASSESSMENTS_DB.get(user_id, [])

        for assessment in assessments:
            if assessment['id'] == assessment_id:
                assessment_logger.info(f"Диагностика ID: {assessment_id} найдена")
                return jsonify(assessment), 200

        assessment_logger.warning(f"Диагностика ID: {assessment_id} не найдена для пользователя ID: {user_id}")
        return jsonify({'detail': 'Assessment not found'}), 404

    except Exception as e:
        assessment_logger.error(f"Ошибка при получении диагностики: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500
