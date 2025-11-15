"""
Документация по использованию SQLAlchemy ORM
"""

# ============================================================================
# СТРУКТУРА БД
# ============================================================================

# Таблицы:
# 1. users - Пользователи
# 2. assessments - Диагностики (результаты оценки выгорания)
# 3. recommendations - Рекомендации
# 4. metrics - Метрики дашборда
# 5. old_users - Архив старых пользователей

# ============================================================================
# ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ORM
# ============================================================================

# ---------
# ПОЛЬЗОВАТЕЛИ
# ---------

# Импорт
from routes.db_models import User
from database import db

# 1. Создание нового пользователя
new_user = User(
    email='newuser@example.com',
    password='hashed_password',  # В реальном приложении - хешированный пароль!
    name='Новый Пользователь',
    position='Менеджер',
    department='HR',
    days_in_system=0,
    completed_recommendations=0
)
db.session.add(new_user)
db.session.commit()

# 2. Получить пользователя по ID
user = User.query.get(1)

# 3. Получить пользователя по email
user = User.query.filter_by(email='user@example.com').first()

# 4. Получить всех пользователей
all_users = User.query.all()

# 5. Обновить пользователя
user = User.query.get(1)
user.completed_recommendations = 15
db.session.commit()

# 6. Удалить пользователя
user = User.query.get(1)
db.session.delete(user)
db.session.commit()

# 7. Получить все диагностики пользователя
user = User.query.get(1)
assessments = user.assessments  # Благодаря relationship

# 8. Преобразовать объект в словарь
user_dict = user.to_dict()

# ---------
# ДИАГНОСТИКИ
# ---------

from routes.db_models import Assessment

# 1. Создать новую диагностику
assessment = Assessment(
    user_id=1,
    burnout_level='high',
    score=78.5,
    emotional_exhaustion=35,
    depersonalization=20,
    reduced_accomplishment=23,
    answers={'0': 4, '1': 5, '2': 4, '3': 5}  # JSON
)
db.session.add(assessment)
db.session.commit()

# 2. Получить диагностики пользователя
assessments = Assessment.query.filter_by(user_id=1).all()

# 3. Получить последнюю диагностику пользователя
latest = Assessment.query.filter_by(user_id=1).order_by(Assessment.date.desc()).first()

# 4. Получить все диагностики за период
from datetime import datetime, timedelta
start_date = datetime(2025, 11, 1)
end_date = datetime(2025, 11, 30)
assessments = Assessment.query.filter(
    Assessment.user_id == 1,
    Assessment.date >= start_date,
    Assessment.date <= end_date
).all()

# 5. Преобразовать в словарь
assessment_dict = assessment.to_dict()

# ---------
# РЕКОМЕНДАЦИИ
# ---------

from routes.db_models import Recommendation

# 1. Создать рекомендацию
rec = Recommendation(
    user_id=1,
    category='Медитация',
    title='Практикуйте осознанность',
    description='Медитируйте 10 минут в день',
    priority='high',
    duration='10 мин/день',
    completed=False
)
db.session.add(rec)
db.session.commit()

# 2. Получить рекомендации пользователя
recs = Recommendation.query.filter_by(user_id=1).all()

# 3. Получить только выполненные рекомендации
completed = Recommendation.query.filter_by(user_id=1, completed=True).all()

# 4. Обновить статус рекомендации
rec = Recommendation.query.get(1)
rec.completed = True
db.session.commit()

# 5. Получить количество выполненных рекомендаций
count = Recommendation.query.filter_by(user_id=1, completed=True).count()

# ---------
# МЕТРИКИ
# ---------

from routes.db_models import Metric

# 1. Добавить метрику
metric = Metric(
    user_id=1,
    date='Пн',
    burnout=82,
    stress=85,
    productivity=18
)
db.session.add(metric)
db.session.commit()

# 2. Получить метрики пользователя
metrics = Metric.query.filter_by(user_id=1).all()

# 3. Получить среднее значение выгорания
from sqlalchemy import func
avg_burnout = db.session.query(func.avg(Metric.burnout)).filter_by(user_id=1).scalar()

# ---------
# АРХИВНЫЕ ПОЛЬЗОВАТЕЛИ
# ---------

from routes.db_models import OldUser

# 1. Добавить архивного пользователя
old_user = OldUser(
    email='archived@example.com',
    password='old_password',
    name='Архивный пользователь',
    position='Старая должность',
    department='Старый отдел'
)
db.session.add(old_user)
db.session.commit()

# 2. Получить архивных пользователей
old_users = OldUser.query.all()

# ============================================================================
# ПОЛЕЗНЫЕ SQL ЗАПРОСЫ
# ============================================================================

# Получить статистику по выгоранию
"""
SELECT 
    u.name,
    AVG(a.score) as avg_score,
    MAX(a.score) as max_score,
    COUNT(a.id) as assessment_count
FROM users u
LEFT JOIN assessments a ON u.id = a.user_id
GROUP BY u.id, u.name
ORDER BY avg_score DESC;
"""

# Получить пользователей с высоким уровнем выгорания
"""
SELECT DISTINCT u.id, u.name, a.burnout_level
FROM users u
JOIN assessments a ON u.id = a.user_id
WHERE a.burnout_level = 'high'
ORDER BY a.date DESC;
"""

# Получить выполненные рекомендации по категориям
"""
SELECT 
    category,
    COUNT(*) as total,
    SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed
FROM recommendations
WHERE user_id = 1
GROUP BY category;
"""

# ============================================================================
# ИНИЦИАЛИЗАЦИЯ БД И ЗАПУСК ПРИЛОЖЕНИЯ
# ============================================================================

# 1. Инициализировать БД с тестовыми данными:
#    python init_db.py

# 2. Запустить приложение Flask:
#    python app.py

# ============================================================================
# ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ В РОУТАХ
# ============================================================================

# routes/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from routes.db_models import User
from database import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Проверить, не существует ли уже пользователь
    existing = User.query.filter_by(email=data['email']).first()
    if existing:
        return jsonify({'detail': 'Email already registered'}), 409
    
    # Создать нового пользователя
    user = User(
        email=data['email'],
        password=data['password'],  # Должен быть хеширован!
        name=data['name'],
        position=data['position'],
        department=data['department']
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Создать JWT токен
    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'access_token': token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Найти пользователя по email
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or user.password != data['password']:  # Должна быть проверка хеша!
        return jsonify({'detail': 'Invalid credentials'}), 401
    
    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'access_token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'detail': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

# ============================================================================
# ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ В РОУТАХ (Диагностики)
# ============================================================================

# routes/assessment.py
from routes.db_models import Assessment, User
from database import db

@assessment_bp.route('/', methods=['POST'])
@jwt_required()
def create_assessment():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    # Создать новую диагностику
    assessment = Assessment(
        user_id=user_id,
        burnout_level=data['burnoutLevel'],
        score=data['score'],
        emotional_exhaustion=data['emotionalExhaustion'],
        depersonalization=data['depersonalization'],
        reduced_accomplishment=data['reducedAccomplishment'],
        answers=data['answers']
    )
    
    db.session.add(assessment)
    db.session.commit()
    
    return jsonify(assessment.to_dict()), 201

@assessment_bp.route('/history', methods=['GET'])
@jwt_required()
def get_assessment_history():
    user_id = int(get_jwt_identity())
    
    assessments = Assessment.query.filter_by(user_id=user_id).order_by(
        Assessment.date.desc()
    ).all()
    
    return jsonify([a.to_dict() for a in assessments]), 200

# ============================================================================
# ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ В РОУТАХ (Рекомендации)
# ============================================================================

# routes/recommendations.py
from routes.db_models import Recommendation, User
from database import db

@recommendations_bp.route('/', methods=['GET'])
@jwt_required()
def get_recommendations():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'detail': 'User not found'}), 404
    
    recommendations = Recommendation.query.filter_by(user_id=user_id).all()
    
    return jsonify([r.to_dict() for r in recommendations]), 200

@recommendations_bp.route('/<int:rec_id>/complete', methods=['PUT'])
@jwt_required()
def complete_recommendation(rec_id):
    user_id = int(get_jwt_identity())
    
    rec = Recommendation.query.filter_by(id=rec_id, user_id=user_id).first()
    
    if not rec:
        return jsonify({'detail': 'Recommendation not found'}), 404
    
    rec.completed = True
    db.session.commit()
    
    return jsonify(rec.to_dict()), 200

