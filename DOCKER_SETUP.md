# Инструкция по развертыванию бэкенда в Docker

Это руководство описывает, как развернуть бэкенд приложения System Hack в Docker контейнерах.

## Предварительные требования

1. **Docker** - [Скачать и установить](https://www.docker.com/products/docker-desktop)
2. **Docker Compose** - обычно поставляется вместе с Docker Desktop

Проверьте установку:
```bash
docker --version
docker-compose --version
```

## Структура Docker конфигурации

Проект включает:
- **Dockerfile** - конфигурация для Flask приложения
- **docker-compose.yml** - оркестрация контейнеров (бэкенд + PostgreSQL)
- **.dockerignore** - исключение ненужных файлов из образа
- **.env.example** - пример переменных окружения

## Быстрый старт

### Шаг 1: Подготовка переменных окружения

Скопируйте файл `.env.example` в `.env` и настройте необходимые значения:

```bash
cd C:\Users\Borus\PycharmProjects\System_Hack_Novosibirsk
copy .env.example .env
```

Отредактируйте `.env` файл (особенно важны):
```
FLASK_ENV=production
SECRET_KEY=ваш-очень-надежный-секретный-ключ
JWT_SECRET_KEY=ваш-очень-надежный-jwt-ключ
DB_PASSWORD=безопасный-пароль-для-бд
```

### Шаг 2: Запуск контейнеров

Выполните команду в корневой директории проекта:

```bash
docker-compose up -d
```

Ключи:
- `-d` - запуск в фоновом режиме (detached mode)

**Первый запуск может занять 2-3 минуты**, пока скачиваются образы и инициализируется БД.

### Шаг 3: Проверка статуса

```bash
docker-compose ps
```

Вы должны увидеть два запущенных сервиса:
- `system_hack_db` (PostgreSQL)
- `system_hack_backend` (Flask)

### Шаг 4: Проверка работоспособности

```bash
# Проверить логи бэкенда
docker-compose logs backend

# Проверить логи БД
docker-compose logs db

# Проверить работу API (если доступен endpoint)
curl http://localhost:5000/health
```

## Команды управления

### Просмотр логов

```bash
# Логи всех сервисов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f db

# Последние 100 строк
docker-compose logs --tail=100
```

### Остановка контейнеров

```bash
# Остановить (сохраняет состояние БД)
docker-compose stop

# Остановить и удалить контейнеры
docker-compose down

# Остановить и удалить всё, включая данные БД
docker-compose down -v
```

### Перезапуск

```bash
# Перезагрузить все сервисы
docker-compose restart

# Пересобрать и перезагрузить
docker-compose up -d --build
```

### Вход в контейнер

```bash
# Bash в контейнере бэкенда
docker-compose exec backend bash

# Python shell в бэкенде
docker-compose exec backend python

# psql в БД контейнере
docker-compose exec db psql -U postgres -d system_hack_db
```

## Переменные окружения

| Переменная | Значение по умолчанию | Описание |
|---|---|---|
| `FLASK_ENV` | production | production или development |
| `SECRET_KEY` | - | Секретный ключ для Flask (обязательно измените!) |
| `JWT_SECRET_KEY` | - | Ключ для JWT токенов (обязательно измените!) |
| `DB_HOST` | db | Хост БД (в Docker это имя сервиса) |
| `DB_PORT` | 5432 | Порт PostgreSQL |
| `DB_USER` | postgres | Пользователь БД |
| `DB_PASSWORD` | postgres | Пароль БД |
| `DB_NAME` | system_hack_db | Название БД |
| `BACKEND_PORT` | 5000 | Порт Flask приложения |
| `OPENROUTER_API_KEY` | - | API ключ OpenRouter (если используется) |
| `YANDEX_FOLDER_ID` | - | Folder ID Yandex (если используется) |
| `YANDEX_GPT_API_KEY` | - | API ключ Yandex GPT (если используется) |

## Развертывание на продакшене

### 1. Безопасность

**Обязательно** измените в `.env`:
```
SECRET_KEY=генерируйте-криптографически-стойкий-ключ
JWT_SECRET_KEY=генерируйте-криптографически-стойкий-ключ
DB_PASSWORD=очень-надежный-пароль
```

Генерация ключей:
```bash
# В Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### 2. Резервная копия данных БД

```bash
# Создать dump БД
docker-compose exec db pg_dump -U postgres system_hack_db > backup.sql

# Восстановить из dump
docker-compose exec -T db psql -U postgres system_hack_db < backup.sql
```

### 3. Обновление приложения

```bash
# Получить последние изменения кода
git pull

# Пересобрать образ и перезагрузить
docker-compose up -d --build
```

### 4. Мониторинг

```bash
# Просмотр использования ресурсов
docker stats

# Проверка здоровья контейнера
docker-compose ps
```

## Решение проблем

### Ошибка: "Port 5000 is already in use"

Измените порт в `.env`:
```
BACKEND_PORT=8000
```

Или остановите другой сервис на этом порту.

### Ошибка: "Cannot connect to database"

1. Проверьте, запущена ли БД:
   ```bash
   docker-compose ps
   ```

2. Проверьте логи БД:
   ```bash
   docker-compose logs db
   ```

3. Убедитесь, что переменные окружения совпадают в `.env` и `docker-compose.yml`

### Ошибка: "Connection refused"

Дождитесь инициализации БД (может занять до 30 секунд):
```bash
docker-compose logs -f db
```

Когда увидите "database system is ready to accept connections", БД готова.

### Очистка всего (если что-то сломалось)

```bash
# Полная очистка
docker-compose down -v

# Удалить неиспользуемые образы
docker image prune

# Удалить неиспользуемые тома
docker volume prune

# Начать заново
docker-compose up -d
```

## Структура папок в контейнере

```
/app
├── app.py
├── requirements.txt
├── Dockerfile
├── routes/
│   ├── auth.py
│   ├── assessment.py
│   ├── dashboard.py
│   ├── recommendations.py
│   ├── ai.py
│   └── db/
│       ├── database.py
│       └── db_models.py
└── logs/
    ├── app.log
    ├── auth.log
    └── ...
```

## Доступ к приложению

По умолчанию:
- **Бэкенд**: http://localhost:5000
- **База данных**: localhost:5432 (только внутри Docker)

Для подключения к БД с хоста:
```bash
psql -h localhost -U postgres -d system_hack_db
```

Пароль: `postgres` (из `.env`)

## Полезные команды

```bash
# Просмотр всех контейнеров (включая停止)
docker ps -a

# Просмотр образов
docker images

# Удалить контейнер
docker rm имя_контейнера

# Удалить образ
docker rmi имя_образа

# Посмотреть детали контейнера
docker inspect system_hack_backend
```

## Дополнительная информация

- [Официальная документация Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Python Docker Image](https://hub.docker.com/_/python)

## Поддержка

Если возникают проблемы:

1. Проверьте логи: `docker-compose logs -f`
2. Убедитесь, что Docker работает: `docker ps`
3. Очистите неиспользуемые ресурсы: `docker system prune`
4. Пересоберите образы: `docker-compose up -d --build`
# Используем официальный образ Python
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем переменные окружения
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements
COPY requirements.txt .

# Устанавливаем зависимости Python
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Копируем приложение
COPY . .

# Создаем директорию для логов
RUN mkdir -p /app/logs

# Expose порт
EXPOSE 5000

# Здоровье чек
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5000/health', timeout=5)" || exit 1

# Запускаем приложение
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]

