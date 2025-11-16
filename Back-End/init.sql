-- Создание таблиц при первом запуске (опционально)
-- Flask-SQLAlchemy автоматически создаст таблицы при первом запуске

-- Если нужно создать расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Индексы для оптимизации (опционально)
-- Они будут созданы SQLAlchemy автоматически на основе db_models.py

