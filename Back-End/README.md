# Back-End — запуск и разработка (Windows)

Этот README объясняет, как запустить и развивать бэкенд-часть проекта (Flask) на Windows (cmd.exe). Документ содержит требования, быструю инструкцию по запуску, описание переменных окружения, структуру папок и полезные команды (включая обнуление выполненных рекомендаций).

Содержание
- Краткое описание
- Требования
- Быстрая установка и запуск (Windows, cmd.exe)
- Переменные окружения (.env)
- Команды для работы с базой (инициализация / сброс)
- Обнуление помеченных рекомендаций (локально в БД)
- Основные API endpoints
- Структура Back-End
- Логи и отладка
- Типичные ошибки и решения
- Примеры запросов (curl)

Краткое описание
----------------
Проект использует Flask и SQLAlchemy. Основной исполняемый файл — `app.py` в папке `Back-End`. Приложение регистрирует несколько blueprints для роутов: `auth`, `assessment`, `dashboard`, `recommendations`, `ai`.

Требования
----------
- Python 3.10+ (рекомендуется)
- pip
- Рекомендуется создать виртуальное окружение
- PostgreSQL (для полного функционала), но для тестов можно использовать sqlite (см. `routes/data/config.py`)

Установка Python и виртуального окружения (cmd.exe)
--------------------------------------------------
1. Установите Python с https://www.python.org/ (рекомендуется добавлять в PATH).
2. В командной строке (cmd.exe) из корня проекта выполните:

```cmd
cd "C:\Users\levan\WebstormProjects\System_Hack_Novosibirsk1\Back-End"
python -m venv .venv
.\.venv\Scripts\activate
```

Установка зависимостей
----------------------
В активированном виртуальном окружении выполните:

```cmd
pip install --upgrade pip
pip install -r requirements.txt
```

Запуск приложения в разработке
-----------------------------
По умолчанию приложение можно запустить напрямую (в `app.py` предусмотрён `app.run`):

```cmd
cd "C:\Users\levan\WebstormProjects\System_Hack_Novosibirsk1\Back-End"
.\.venv\Scripts\activate
python app.py
```

Приложение будет слушать на 0.0.0.0:8000 (в коде `app.run(host='0.0.0.0', port=8000)`). Откройте в браузере: http://localhost:8000/health

Запуск с окружением FLASK_ENV
----------------------------
Для выбора конфигурации (development/production/testing) используйте переменную `FLASK_ENV`. Пример (cmd.exe):

```cmd
set FLASK_ENV=production
python app.py
```

Переменные окружения (.env)
---------------------------
Файл `.env` в папке `Back-End` поддерживается (через python-dotenv). Ниже — рекомендуемые переменные:

```
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=jwt-secret-key
JWT_ACCESS_TOKEN_EXPIRES=86400
FLASK_ENV=development

# Postgres (пример)
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydb

# AI keys (опционально)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-3.5-turbo
OPENROUTER_API_KEY=
LOCAL_LLM_ENDPOINT=
```

Если переменные базы не заданы или подключение не проходит, приложение логирует предупреждение и продолжает запуск без БД (см. `app.py`).

Инициализация / сброс базы данных
--------------------------------
В проекте используется SQLAlchemy без миграций. Для создания таблиц выполняется `db.create_all()` при инициализации приложения.

Чтобы вручную полностью переинициализировать БД (внимание: удалит все данные), выполните в папке `Back-End`:

```cmd
.\.venv\Scripts\activate
python -c "from app import app; from routes.db.database import reset_db; reset_db(app)"
```

Если вы хотите просто проверить создание таблиц, можно запустить приложение — скрипт при старте вызовет `init_db(app)`.

Обнуление всех пройденных рекомендаций
-------------------------------------
Если нужно программно пометить все рекомендации как невыполненные и сбросить счётчики у пользователей (например, `completed_recommendations`), выполните команду из папки `Back-End` в активном виртуальном окружении:

```cmd
.\.venv\Scripts\activate
python -c "from app import app; from routes.db.database import db; from routes.db.db_models import Recommendation, User;\
with app.app_context():\
    Recommendation.query.update({Recommendation.completed: False});\
    User.query.update({User.completed_recommendations: 0});\
    db.session.commit();\
    print('Completed recommendations reset')"
```

Это обнулит флаг `completed` у всех записей в таблице `recommendations` и установит `completed_recommendations` в 0 у всех пользователей.

Основные API endpoints
----------------------
Ниже — краткое описание основных роутов, см. реализации в папке `Back-End/routes`.

- Auth (`/auth`):
  - POST /auth/register — регистрация (email, password, name, position, department)
  - POST /auth/token — получение JWT (логин)
  - GET /auth/verify — проверить валидность токена (JWT)
  - GET /auth/me — получить данные текущего пользователя

- Assessment (`/assessment`):
  - GET /assessment/questions — получить вопросы диагностики
  - POST /assessment/submit — отправить ответы (JWT req.)
  - GET /assessment/history — получить историю диагностик (JWT req.)
  - GET /assessment/{id} — получить конкретную диагностику (JWT req.)

- Recommendations (`/recommendations`) (JWT req.):
  - GET /recommendations — список рекомендаций пользователя
  - GET /recommendations/{id} — детали рекомендации
  - POST /recommendations/{id}/complete — пометить как выполненную
  - POST /recommendations/{id}/incomplete — пометить как невыполненной

- Dashboard (`/dashboard`) (JWT req.):
  - GET /dashboard/metrics — метрики дашборда (возвращает массив метрик)
  - GET /dashboard/summary — сводка с последней диагностикой и метриками

- AI (`/ai`):
  - POST /ai/chat — простой чат/обёртка LLM. Поддерживает OpenRouter, OpenAI и локальный endpoint (порядок приоритета). Ожидает JSON {"message": "..."} и возвращает {"reply": "..."}.

Аутентификация: большинство эндпоинтов требует JWT в заголовке Authorization: Bearer {token}.

Структура Back-End
------------------
Ниже — основные папки и файлы в `Back-End/` с кратким описанием:

Back-End/
├── app.py                      — точка входа приложения; регистрирует blueprints и инициализирует расширения
├── requirements.txt            — зависимости Python
├── README.md                   — этот файл
├── routes/                     — все HTTP-роуты и логика
│   ├── __init__.py
│   ├── auth.py                 — регистрация/логин/получение текущего пользователя
│   ├── assessment.py           — вопросы, отправка диагностики, история
│   ├── dashboard.py            — метрики и сводки для дашборда
│   ├── recommendations.py      — CRUD и отметки рекомендаций
│   ├── ai.py                   — LLM-обёртки и локальные заглушки
│   ├── ai_manager.py           — генерация рекомендаций менеджеру (AI)
│   ├── burnoutScore.py         — вспомогательная логика расчёта (если есть)
│   ├── data/                   — конфигурация, логгеры и логи
│   │   ├── config.py           — загрузка env и Config классы
│   │   ├── logger.py           — конфигурация логирования
│   │   └── logs/               — файлы логов (.log)
│   ├── db/                     — SQLAlchemy init и модели
│   │   ├── database.py         — init_db, reset_db, db (SQLAlchemy)
│   │   └── db_models.py        — ORM модели (User, Assessment, Recommendation...)
│   └── utils/                  — вспомогательные утилиты

Логи и мониторинг
-----------------
Логи пишутся в `Back-End/routes/data/logs/` (например, `app.log`, `auth.log`, `recommendations.log` и т.д.). Проверяйте эти файлы при отладке ошибок.

Типичные ошибки и решения
-------------------------
- Ошибка подключение к Postgres (psycopg2 OperationalError): проверьте правильность переменных DB_* в `.env` и доступность сервера Postgres. На Windows установка `psycopg2-binary` обычно решает проблему.
- При проблемах с зависимостями — убедитесь, что виртуальное окружение активно и используете совместимый Python.
- Если приложение запускается, но таблицы не созданы — убедитесь, что переменные DB_ заданы или используйте конфигурацию `TestingConfig` (sqlite in-memory) для тестирования.

Примеры запросов (curl)
-----------------------
Ниже — простые примеры для проверки основных endpoint'ов (замените `localhost:8000` и `{TOKEN}` на ваши значения).

Регистрация:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d "{ \"email\": \"user@example.com\", \"password\": \"secret123\", \"name\": \"Иван\", \"position\": \"Курьер\", \"department\": \"Доставка\" }"
```

Логин (получение токена):

```bash
curl -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/json" \
  -d "{ \"username\": \"user@example.com\", \"password\": \"secret123\" }"
```

Получить рекомендации (JWT required):

```bash
curl -X GET http://localhost:8000/recommendations \
  -H "Authorization: Bearer {TOKEN}"
```

Отметить рекомендацию как выполненную:

```bash
curl -X POST http://localhost:8000/recommendations/1/complete \
  -H "Authorization: Bearer {TOKEN}"
```

Docker-compose (локальная Postgres) — пример
-------------------------------------------
Создайте `docker-compose.yml` рядом с `Back-End` (пример ниже) и запустите Postgres для разработки.

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

Запуск:

```cmd
docker-compose up -d
```

После запуска — настройте `.env` с этими же данными и запустите Flask приложение.

Развёртывание
-------------
- Для продакшена используйте WSGI сервер (gunicorn на Linux, waitress для Windows) вместо встроенного `app.run`.

Пример запуска через `waitress` (Windows):

```cmd
pip install waitress
python -c "from waitress import serve; from app import app; serve(app, host='0.0.0.0', port=8000)"
```

Если развёртываете на Linux, рассмотрите `gunicorn` + systemd/nginx.

Дальше и поддержка
-------------------
Если нужно, могу:
- Добавить скрипты seed'инга тестовых данных для разработки (users, recommendations, metrics).
- Добавить `docker-compose` для полного стека (Postgres + Back-End) и инструкцию запуска.
- Написать примеры запросов через `axios`/Postman коллекцию.

Лицензия
--------
MIT