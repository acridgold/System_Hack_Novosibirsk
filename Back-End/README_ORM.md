# 🗄️ SQLAlchemy ORM Интеграция для System_Hack_Novosibirsk

## 📋 Что было сделано

### 1. ✅ Установлены зависимости
- SQLAlchemy 2.0.23
- Flask-SQLAlchemy 3.1.1
- psycopg2-binary (драйвер PostgreSQL)

### 2. ✅ Создана структура ORM
- **`config.py`** - Конфигурация приложения с параметрами БД
- **`database.py`** - Инициализация SQLAlchemy
- **`routes/db_models.py`** - ORM модели для всех таблиц:
  - `User` (Пользователи)
  - `Assessment` (Диагностики)
  - `Recommendation` (Рекомендации)
  - `Metric` (Метрики дашборда)
  - `OldUser` (Архив пользователей)

### 3. ✅ Обновлены все роуты для использования ORM
- **`routes/auth.py`** - Аутентификация с ORM
- **`routes/assessment.py`** - Диагностики с ORM
- **`routes/recommendations.py`** - Рекомендации с ORM
- **`routes/dashboard.py`** - Дашборд с ORM

### 4. ✅ Создана инициализация БД
- **`init_db.py`** - Скрипт для инициализации БД с тестовыми данными
- **.env** - Конфигурация подключения к PostgreSQL

### 5. ✅ Созданы тесты и документация
- **`test_api.py`** - Полный набор тестов всех эндпоинтов
- **`ORM_DOCUMENTATION.md`** - Подробная документация по использованию ORM

---

## 🚀 Быстрый старт

### 1. Установить зависимости (если еще не установлены)
```bash
cd Back-end
pip install -r requirements.txt
```

### 2. Инициализировать БД с тестовыми данными
```bash
python init_db.py
```

### 3. Запустить бэкенд
```bash
python app.py
```

Бэкенд будет доступен на `http://localhost:8000`

### 4. Запустить тесты API
```bash
python test_api.py
```

---

## 📊 Результаты тестирования

Все 9 тестов успешно пройдены:

✅ Вход в систему
✅ Получение текущего пользователя  
✅ Получение вопросов диагностики
✅ Отправка диагностики
✅ Получение истории диагностик
✅ Получение рекомендаций
✅ Отметка рекомендации как выполненная
✅ Получение метрик дашборда
✅ Получение сводки дашборда

---

## 🗄️ Структура БД PostgreSQL

### Таблица: `users` (Пользователи)
```
id (PRIMARY KEY) - INTEGER
email (UNIQUE) - VARCHAR(255)
password - VARCHAR(255)
name - VARCHAR(255)
position - VARCHAR(255)
department - VARCHAR(255)
join_date - TIMESTAMP
days_in_system - INTEGER
completed_recommendations - INTEGER
avatar - TEXT
created_at - TIMESTAMP
updated_at - TIMESTAMP
```

### Таблица: `assessments` (Диагностики)
```
id (PRIMARY KEY) - INTEGER
user_id (FOREIGN KEY) - INTEGER
date - TIMESTAMP
burnout_level - VARCHAR(50)
score - FLOAT
emotional_exhaustion - FLOAT
depersonalization - FLOAT
reduced_accomplishment - FLOAT
answers - JSON
created_at - TIMESTAMP
```

### Таблица: `recommendations` (Рекомендации)
```
id (PRIMARY KEY) - INTEGER
user_id (FOREIGN KEY) - INTEGER
category - VARCHAR(100)
title - VARCHAR(255)
description - TEXT
priority - VARCHAR(50)
duration - VARCHAR(100)
completed - BOOLEAN
created_at - TIMESTAMP
updated_at - TIMESTAMP
```

### Таблица: `metrics` (Метрики)
```
id (PRIMARY KEY) - INTEGER
user_id (FOREIGN KEY) - INTEGER
date - VARCHAR(50)
burnout - FLOAT
stress - FLOAT
productivity - FLOAT
created_at - TIMESTAMP
```

### Таблица: `old_users` (Архив)
```
id (PRIMARY KEY) - INTEGER
email (UNIQUE) - VARCHAR(255)
password - VARCHAR(255)
name - VARCHAR(255)
position - VARCHAR(255)
department - VARCHAR(255)
join_date - VARCHAR(50)
days_in_system - INTEGER
completed_recommendations - INTEGER
avatar - TEXT
archived_at - TIMESTAMP
```

---

## 🔌 Параметры подключения БД

```
Host: localhost
Port: 2525
User: postgres
Password: academy25
Database: cdek_BD
```

Эти параметры хранятся в файле `.env`:

```env
DB_HOST=localhost
DB_PORT=2525
DB_USER=postgres
DB_PASSWORD=academy25
DB_NAME=cdek_BD
```

---

## 📚 Основные примеры использования ORM

### Создание нового пользователя
```python
from routes.db_models import User
from database import db

user = User(
    email='user@example.com',
    password='password123',
    name='Иван Петров',
    position='Менеджер',
    department='HR'
)
db.session.add(user)
db.session.commit()
```

### Получение пользователя по ID
```python
user = User.query.get(1)
```

### Получение пользователя по email
```python
user = User.query.filter_by(email='user@example.com').first()
```

### Создание диагностики
```python
from routes.db_models import Assessment

assessment = Assessment(
    user_id=1,
    burnout_level='high',
    score=78.5,
    emotional_exhaustion=35,
    depersonalization=20,
    reduced_accomplishment=23,
    answers={'0': 4, '1': 5, ...}
)
db.session.add(assessment)
db.session.commit()
```

### Получение всех диагностик пользователя
```python
assessments = Assessment.query.filter_by(user_id=1).all()
```

### Получение последней диагностики
```python
latest = Assessment.query.filter_by(user_id=1).order_by(
    Assessment.date.desc()
).first()
```

### Преобразование объекта в словарь (JSON)
```python
user_dict = user.to_dict()
assessment_dict = assessment.to_dict()
```

---

## 🔐 API Endpoints

### Аутентификация
- `POST /auth/register` - Регистрация
- `POST /auth/token` - Вход
- `GET /auth/me` - Данные текущего пользователя
- `GET /auth/verify` - Проверка токена

### Диагностики
- `GET /assessment/questions` - Получить вопросы
- `POST /assessment/submit` - Отправить диагностику
- `GET /assessment/history` - История диагностик
- `GET /assessment/{id}` - Детали диагностики

### Рекомендации
- `GET /recommendations` - Список рекомендаций
- `POST /recommendations/{id}/complete` - Отметить как выполненную
- `POST /recommendations/{id}/incomplete` - Отметить как невыполненную
- `GET /recommendations/{id}` - Детали рекомендации

### Дашборд
- `GET /dashboard/metrics` - Метрики
- `GET /dashboard/summary` - Сводка

---

## 🛠️ Полезные SQL запросы

### Получить статистику по выгоранию
```sql
SELECT 
    u.name,
    AVG(a.score) as avg_score,
    MAX(a.score) as max_score,
    COUNT(a.id) as assessment_count
FROM users u
LEFT JOIN assessments a ON u.id = a.user_id
GROUP BY u.id, u.name
ORDER BY avg_score DESC;
```

### Получить пользователей с высоким выгоранием
```sql
SELECT DISTINCT u.id, u.name, a.burnout_level
FROM users u
JOIN assessments a ON u.id = a.user_id
WHERE a.burnout_level = 'high'
ORDER BY a.date DESC;
```

### Получить статистику по рекомендациям
```sql
SELECT 
    category,
    COUNT(*) as total,
    SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed
FROM recommendations
WHERE user_id = 1
GROUP BY category;
```

---

## 📝 Важные замечания

### Безопасность пароля ⚠️
Текущая реализация хранит пароли в открытом виде! В продакшене необходимо:
1. Использовать хеширование (bcrypt, argon2)
2. Установить пакет: `pip install werkzeug` или `pip install bcrypt`
3. Обновить код в `routes/auth.py`

Пример хеширования:
```python
from werkzeug.security import generate_password_hash, check_password_hash

# При регистрации
user.password = generate_password_hash(password)

# При проверке
check_password_hash(user.password, password)
```

### JSON в PostgreSQL
Поле `answers` в таблице `assessments` использует тип JSON, что позволяет:
- Хранить сложные структуры данных
- Запрашивать данные через JSON операторы PostgreSQL
- Индексировать JSON ключи

---

## 🐛 Отладка

### Включить логирование SQL запросов
В `config.py` уже установлено:
```python
SQLALCHEMY_ECHO = True  # Для development
```

Это выведет все SQL запросы в консоль.

### Просмотр логов приложения
```bash
tail -f Back-end/logs/app.log
tail -f Back-end/logs/auth.log
tail -f Back-end/logs/assessment.log
tail -f Back-end/logs/recommendations.log
tail -f Back-end/logs/dashboard.log
```

---

## 📦 Файлы проекта

```
Back-end/
├── app.py                      # Главное приложение Flask (обновлено)
├── config.py                   # Конфигурация (новое)
├── database.py                 # Инициализация SQLAlchemy (новое)
├── init_db.py                  # Инициализация БД (новое)
├── test_api.py                 # Тесты API (новое)
├── .env                        # Переменные окружения (новое)
├── requirements.txt            # Зависимости (обновлено)
├── ORM_DOCUMENTATION.md        # Документация ORM (новое)
└── routes/
    ├── db_models.py            # ORM модели (новое)
    ├── auth.py                 # Роуты аутентификации (обновлено)
    ├── assessment.py           # Роуты диагностик (обновлено)
    ├── recommendations.py      # Роуты рекомендаций (обновлено)
    └── dashboard.py            # Роуты дашборда (обновлено)
```

---

## ✨ Что дальше?

1. **Хеширование пароле** - Внедрить bcrypt для безопасного хранения паролей
2. **Миграции БД** - Использовать Alembic для управления миграциями
3. **Кэширование** - Добавить Redis для кэширования часто используемых данных
4. **Пиксель** - Покрыть код unit-тестами и интеграционными тестами
5. **Мониторинг** - Добавить Sentry для отслеживания ошибок в продакшене

---

## 📞 Вопросы и поддержка

Если возникнут вопросы по использованию ORM, обратитесь к файлу `ORM_DOCUMENTATION.md` где есть подробные примеры для всех сценариев использования.

---

**Дата создания:** 2025-11-13  
**Версия:** 1.0  
**Статус:** ✅ Готово к использованию

