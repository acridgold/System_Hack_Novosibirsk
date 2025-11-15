from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.db_models import Assessment, User
from db.database import db

# Импортируем логгер
from data.logger import assessment_logger

assessment_bp = Blueprint('assessment', __name__)

def calculate_burnout_scores(answers):
    """
    Рассчитывает показатели выгорания на основе ответов
    Использует шкалу Maslach Burnout Inventory (MBI)
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

ASSESSMENT_QUESTIONS = [
    "Я чувствую себя эмоционально истощенным из-за работы",
    "Я чувствую усталость в конце рабочего дня",
    "Я отношусь к своей работе с безразличием",
    "Я чувствую, что мои усилия напрасны",
    "Я работаю не по силам",
    "Я чувствую отчаяние из-за работы",
    "Я думаю, что моя работа разрушает мою личность",
    "Я чувствую, что моя работа теряет значение",
    "Я не заботлюсь о том, что происходит с моими коллегами",
    "Я воспринимаю других людей как объекты",
    "Я работаю с людьми лишь потому, что это мой долг",
    "Я чувствую себя использованным людьми",
    "Я чувствую, что люди не ценят мою помощь",
    "Я чувствую апатию к своей работе",
    "Я не чувствую готовности браться за новые проекты",
    "Я чувствую, что мои успехи не признаются",
    "Я чувствую себя не компетентным в своей работе",
    "Я думаю о том, что я неудачник",
    "Я чувствую, что мои достижения незначительны",
    "Я чувствую, что я не способен справляться с проблемами",
]

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
        assessment_logger.error(f"Ошибка при получении вопросов: {str(e)}", exc_info=True)
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
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)
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

        # Проверяем, что пользователь существует
        user = User.query.get(user_id)
        if not user:
            assessment_logger.warning(f"Пользователь ID: {user_id} не найден")
            return jsonify({'detail': 'User not found'}), 404

        # Рассчитываем показатели выгорания
        scores = calculate_burnout_scores(answers)

        assessment_logger.info(f"Диагностика обработана для пользователя ID: {user_id}. Уровень выгорания: {scores['burnoutLevel']}, Балл: {scores['score']}")

        # Создаем новую диагностику в БД
        new_assessment = Assessment(
            user_id=user_id,
            burnout_level=scores['burnoutLevel'],
            score=scores['score'],
            emotional_exhaustion=scores['emotionalExhaustion'],
            depersonalization=scores['depersonalization'],
            reduced_accomplishment=scores['reducedAccomplishment'],
            answers=answers
        )

        db.session.add(new_assessment)
        db.session.commit()

        assessment_logger.info(f"Диагностика сохранена. ID диагностики: {new_assessment.id}")

        return jsonify(new_assessment.to_dict()), 201

    except Exception as e:
        db.session.rollback()
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
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)

        assessment_logger.info(f"Запрос истории диагностик для пользователя ID: {user_id}")

        # Получаем все диагностики пользователя, отсортированные по дате (новые в начале)
        assessments = Assessment.query.filter_by(user_id=user_id).order_by(
            Assessment.date.desc()
        ).all()

        assessment_logger.info(f"Найдено {len(assessments)} диагностик для пользователя ID: {user_id}")

        return jsonify({
            'assessments': [a.to_dict() for a in assessments],
            'total': len(assessments),
        }), 200

    except Exception as e:
        assessment_logger.error(f"Ошибка при получении истории: {str(e)}", exc_info=True)
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
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)

        assessment_logger.info(f"Запрос деталей диагностики ID: {assessment_id} для пользователя ID: {user_id}")

        # Получаем диагностику, проверяя что она принадлежит пользователю
        assessment = Assessment.query.filter_by(
            id=assessment_id,
            user_id=user_id
        ).first()

        if not assessment:
            assessment_logger.warning(f"Диагностика ID: {assessment_id} не найдена для пользователя ID: {user_id}")
            return jsonify({'detail': 'Assessment not found'}), 404

        assessment_logger.info(f"Диагностика ID: {assessment_id} найдена")
        return jsonify(assessment.to_dict()), 200

    except Exception as e:
        assessment_logger.error(f"Ошибка при получении диагностики: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500
