from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .db.db_models import Assessment, User, Recommendation, EmployeeData
from .db.database import db
from .data.logger import assessment_logger
from .utils.recommendations_selector import get_ai_recommendations
from .burnoutScore import calculate_burnout_score_from_employee
import psycopg2
from sqlalchemy import exc as sa_exc
from datetime import datetime

assessment_bp = Blueprint('assessment', __name__)

def calculate_burnout_scores(answers, user_id):
    """Рассчитывает показатели выгорания на основе ответов и данных сотрудника"""
    professional_activity = [0, 1, 2, 3, 4]
    professional_score = sum(float(answers.get(str(i), 0)) for i in professional_activity) / len(professional_activity)

    mental_stability = [5, 6, 7]
    mental_score = sum(float(answers.get(str(i), 0)) for i in mental_stability) / len(mental_stability)

    emotional_attitude = [8, 9, 10]
    emotional_score = sum(float(answers.get(str(i), 0)) for i in emotional_attitude) / len(emotional_attitude)

    total_score = (professional_score + mental_score + emotional_score) / 3

    if total_score >= 0.7:
        burnout_level = 'high'
    elif total_score >= 0.4:
        burnout_level = 'medium'
    else:
        burnout_level = 'low'

    employee_burnout_score = None
    try:
        employee_data = EmployeeData.query.filter_by(user_id=user_id).first()
        if employee_data:
            burnout_type_mapping = {
                'low': 'G',
                'medium': 'S',
                'high': 'A'
            }
            burnout_type = burnout_type_mapping.get(burnout_level, 'G')
            employee_burnout_score = calculate_burnout_score_from_employee(
                employee_data,
                burnout_type,
                datetime.utcnow()
            )
            assessment_logger.info(f"Рассчитан score для сотрудника: {employee_burnout_score}")
    except Exception as e:
        assessment_logger.warning(f"Не удалось рассчитать score из EmployeeData: {e}")
        employee_burnout_score = None

    return {
        'professionalActivityScore': round(professional_score, 2),
        'mentalStabilityScore': round(mental_score, 2),
        'emotionalAttitudeScore': round(emotional_score, 2),
        'score': round(total_score, 2),
        'employeeBurnoutScore': round(employee_burnout_score, 2) if employee_burnout_score else None,
        'burnoutLevel': burnout_level,
    }

ASSESSMENT_QUESTIONS = [
    {
        'id': 0,
        'text': 'Оцените Ваше стремление к профессиональным достижениям',
        'category': 'professional_activity',
        'component': 'ProfessionalGoalsQuestion'
    },
    {
        'id': 1,
        'text': 'Оцените Ваш баланс между работой и жизнью',
        'subtitle': 'Перемещайте чаши весов вверх и вниз',
        'category': 'professional_activity',
        'component': 'WorkLifeBalanceQuestion'
    },
    {
        'id': 2,
        'text': 'Стремитесь ли Вы к совершенству?',
        'subtitle': 'Отмечайте галочками выполненные «задания»',
        'category': 'professional_activity',
        'component': 'PerfectWorkQuestion'
    },
    {
        'id': 3,
        'text': 'Умеете ли Вы отдыхать после работы?',
        'subtitle': 'Перемещайте сотрудника между работой и отдыхом',
        'category': 'professional_activity',
        'component': 'RelaxAbilityQuestion'
    },
    {
        'id': 4,
        'text': 'Сколько времени и сил Вы посвещаете работе?',
        'subtitle': 'Поворачивайте часовую стрелку',
        'category': 'professional_activity',
        'component': 'TimeCostsQuestion'
    },
    {
        'id': 5,
        'text': 'Оцените свое умения справляться с неудачами',
        'subtitle': 'Перетаскивайте кусочки, чтобы собрать разбитый объект',
        'category': 'mental_stability',
        'component': 'ProblemSolvingQuestion'
    },
    {
        'id': 6,
        'text': 'Как вы реагируете на проблемы на работе?',
        'subtitle': 'Удлиняйте лестницу, перемещая сотрудника',
        'category': 'mental_stability',
        'component': 'GivingUpQuestion'
    },
    {
        'id': 7,
        'text': 'Умеете ли вы сохранять спокойствие в стрессовых ситуациях?',
        'subtitle': 'Перемещайте «облако стресса»',
        'category': 'mental_stability',
        'component': 'StressResistanceQuestion'
    },
    {
        'id': 8,
        'text': 'Оцените свои профессиональные достижения',
        'subtitle': 'Потяните за стрелочку, чтобы показать достижения',
        'category': 'emotional_attitude',
        'component': 'AchievementAssessmentQuestion'
    },
    {
        'id': 9,
        'text': 'Насколько вы в целом довольны своей жизнью?',
        'subtitle': 'Двигайте улыбку на лице',
        'category': 'emotional_attitude',
        'component': 'LifeSatisfactionQuestion'
    },
    {
        'id': 10,
        'text': 'Ощущаете ли вы поддержку от близких людей?',
        'subtitle': 'Двигайте людей друг к другу',
        'category': 'emotional_attitude',
        'component': 'RelativesSupportQuestion'
    },
]

@assessment_bp.route('/questions', methods=['GET'])
def get_questions():
    """Получить список вопросов для диагностики"""
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
    """Отправить ответы на диагностику"""
    try:
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)
        data = request.get_json()

        assessment_logger.info(f"Получена диагностика от пользователя ID: {user_id}")

        if not data or 'answers' not in data:
            assessment_logger.warning(f"Диагностика без ответов от пользователя ID: {user_id}")
            return jsonify({'detail': 'Answers are required'}), 400

        answers = data.get('answers')

        if len(answers) != len(ASSESSMENT_QUESTIONS):
            assessment_logger.warning(f"Неполные ответы от пользователя ID: {user_id}. Получено: {len(answers)}, ожидается: {len(ASSESSMENT_QUESTIONS)}")
            return jsonify({'detail': f'Expected {len(ASSESSMENT_QUESTIONS)} answers'}), 400

        for answer_id, answer_value in answers.items():
            try:
                val = float(answer_value)
                if not (0 <= val <= 1):
                    assessment_logger.warning(f"Ответ вне диапазона 0-1 для вопроса {answer_id}: {val}")
                    return jsonify({'detail': f'Answer for question {answer_id} must be between 0 and 1'}), 400
            except (ValueError, TypeError):
                assessment_logger.warning(f"Некорректный ответ для вопроса {answer_id}: {answer_value}")
                return jsonify({'detail': f'Answer for question {answer_id} must be a number between 0 and 1'}), 400

        user = User.query.get(user_id)
        if not user:
            assessment_logger.warning(f"Пользователь ID: {user_id} не найден")
            return jsonify({'detail': 'User not found'}), 404

        scores = calculate_burnout_scores(answers, user_id)

        assessment_logger.info(f"Диагностика обработана для пользователя ID: {user_id}. Уровень выгорания: {scores['burnoutLevel']}, Балл: {scores['score']}")

        new_assessment = Assessment(
            user_id=user_id,
            burnout_level=scores['burnoutLevel'],
            score=scores['score'],
            emotional_exhaustion=scores['professionalActivityScore'],
            depersonalization=scores['mentalStabilityScore'],
            reduced_accomplishment=scores['emotionalAttitudeScore'],
            answers=answers
        )

        db.session.add(new_assessment)
        db.session.flush()

        assessment_logger.info(f"Диагностика сохранена. ID диагностики: {new_assessment.id}")

        assessment_logger.info(f"Запрашиваю рекомендации для пользователя ID: {user_id}")

        recommended_items = get_ai_recommendations(
            burnout_level=scores['burnoutLevel'],
            emotional_exhaustion=scores['professionalActivityScore'],
            depersonalization=scores['mentalStabilityScore'],
            reduced_accomplishment=scores['emotionalAttitudeScore'],
            employee_burnout_score=scores['employeeBurnoutScore']
        )

        for rec_data in recommended_items:
            new_recommendation = Recommendation(
                user_id=user_id,
                category=rec_data['category'],
                title=rec_data['title'],
                description=rec_data['description'],
                priority=rec_data.get('priority', 'medium'),
                duration=rec_data.get('duration', ''),
            )
            db.session.add(new_recommendation)

        db.session.commit()

        assessment_logger.info(f"Сохранено {len(recommended_items)} рекомендаций для пользователя ID: {user_id}")

        return jsonify({
            **new_assessment.to_dict(),
            'professionalActivityScore': scores['professionalActivityScore'],
            'mentalStabilityScore': scores['mentalStabilityScore'],
            'emotionalAttitudeScore': scores['emotionalAttitudeScore'],
            'employeeBurnoutScore': scores['employeeBurnoutScore'],
            'recommendations': [r.to_dict() for r in recommended_items],
            'recommendationsCount': len(recommended_items)
        }), 201

    except (psycopg2.OperationalError, sa_exc.OperationalError) as db_error:
        db.session.rollback()
        assessment_logger.error(f"Ошибка подключения к БД: {str(db_error)}", exc_info=True)
        return jsonify({'detail': 'Database connection error'}), 503
    except Exception as e:
        db.session.rollback()
        assessment_logger.error(f"Ошибка при сохранении диагностики: {str(e)}", exc_info=True)
        return jsonify({'detail': str(e)}), 500

@assessment_bp.route('/history', methods=['GET'])
@jwt_required()
def get_assessment_history():
    """Получить историю диагностик пользователя"""
    try:
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)

        assessment_logger.info(f"Запрос истории диагностик для пользователя ID: {user_id}")

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
    """Получить детали конкретной диагностики"""
    try:
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)

        assessment_logger.info(f"Запрос деталей диагностики ID: {assessment_id} для пользователя ID: {user_id}")

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
