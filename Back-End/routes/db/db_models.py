"""
ORM модели для SQLAlchemy
"""
from database import db
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

class User(db.Model):
    """Модель пользователя"""
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    position = Column(String(255))
    department = Column(String(255))
    join_date = Column(DateTime, default=datetime.utcnow)
    days_in_system = Column(Integer, default=0)
    completed_recommendations = Column(Integer, default=0)
    avatar = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Связи
    assessments = relationship('Assessment', back_populates='user', cascade='all, delete-orphan')
    recommendations = relationship('Recommendation', back_populates='user', cascade='all, delete-orphan')
    employee_data = relationship('EmployeeData', back_populates='user', uselist=False, cascade='all, delete-orphan')

    def to_dict(self):
        """Преобразование объекта в словарь"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'position': self.position,
            'department': self.department,
            'joinDate': self.join_date.strftime('%Y-%m-%d') if self.join_date else None,
            'daysInSystem': self.days_in_system,
            'completedRecommendations': self.completed_recommendations,
            'avatar': self.avatar,
        }

    def __repr__(self):
        return f'<User {self.email}>'


class Assessment(db.Model):
    """Модель диагностики (оценки выгорания)"""
    __tablename__ = 'assessments'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    burnout_level = Column(String(50), nullable=False)  # low, medium, high
    score = Column(Float, nullable=False)
    emotional_exhaustion = Column(Float, nullable=False)
    depersonalization = Column(Float, nullable=False)
    reduced_accomplishment = Column(Float, nullable=False)
    answers = Column(JSON, nullable=False)  # Ответы на вопросы (словарь)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Связь
    user = relationship('User', back_populates='assessments')

    def to_dict(self):
        """Преобразование объекта в словарь"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'date': self.date.strftime('%Y-%m-%d'),
            'timestamp': self.date.isoformat() + 'Z',
            'burnoutLevel': self.burnout_level,
            'score': self.score,
            'emotionalExhaustion': self.emotional_exhaustion,
            'depersonalization': self.depersonalization,
            'reducedAccomplishment': self.reduced_accomplishment,
            'answers': self.answers,
        }

    def __repr__(self):
        return f'<Assessment {self.id} - User {self.user_id}>'


class Recommendation(db.Model):
    """Модель рекомендации"""
    __tablename__ = 'recommendations'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    category = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(50), nullable=False)  # low, medium, high
    duration = Column(String(100))
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Связь
    user = relationship('User', back_populates='recommendations')

    def to_dict(self):
        """Преобразование объекта в словарь"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'category': self.category,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'duration': self.duration,
            'completed': self.completed,
        }

    def __repr__(self):
        return f'<Recommendation {self.id} - User {self.user_id}>'


class Metric(db.Model):
    """Модель метрик дашборда"""
    __tablename__ = 'metrics'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    date = Column(String(50), nullable=False)  # День недели или дата
    burnout = Column(Float, nullable=False)
    stress = Column(Float, nullable=False)
    productivity = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Преобразование объекта в словарь"""
        return {
            'date': self.date,
            'burnout': self.burnout,
            'stress': self.stress,
            'productivity': self.productivity,
        }

    def __repr__(self):
        return f'<Metric {self.date} - User {self.user_id}>'


class OldUser(db.Model):
    """Архивная таблица пользователей"""
    __tablename__ = 'old_users'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    position = Column(String(255))
    department = Column(String(255))
    join_date = Column(String(50))
    days_in_system = Column(Integer)
    completed_recommendations = Column(Integer)
    avatar = Column(Text, nullable=True)
    archived_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<OldUser {self.email}>'

class EmployeeData(db.Model):
    """Отдельный класс для данных из Excel (отдельная таблица/база)"""
    __tablename__ = 'employee_data'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False, index=True)  # Связь с User (one-to-one)
    full_name = Column(String(255))  # Имя + Фамилия + Отчество (если нужно)
    gender = Column(String(50))  # Пол
    age = Column(Integer)  # Возраст
    position = Column(String(255))  # Должность
    department = Column(String(255))  # Отдел
    tenure = Column(String(255))  # Стаж (строка вроде '5 лет 4 месяца')
    training = Column(String(100))  # Обучение ('завершена', 'в процессе' и т.д.)
    last_vacation = Column(DateTime)  # Отпуск (когда ходил в последний раз), конвертировано из Excel date
    subordinates = Column(String(255))  # В подчинении сотрудники (для нормализации position)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Связь
    user = relationship('User', back_populates='employee_data')

    def to_dict(self):
        """Преобразование в словарь"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'fullName': self.full_name,
            'gender': self.gender,
            'age': self.age,
            'position': self.position,
            'department': self.department,
            'tenure': self.tenure,
            'training': self.training,
            'lastVacation': self.last_vacation.strftime('%Y-%m-%d') if self.last_vacation else None,
            'subordinates': self.subordinates,
        }

    def __repr__(self):
        return f'<EmployeeData {self.id} - User {self.user_id}>'