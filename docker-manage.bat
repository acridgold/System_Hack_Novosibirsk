@echo off
REM Скрипт для запуска бэкенда в Docker на Windows

setlocal enabledelayedexpansion

echo 🚀 System Hack Backend - Docker Setup
echo ======================================

REM Проверка Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker не установлен. Пожалуйста, установите Docker Desktop.
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose не установлен. Пожалуйста, установите Docker Desktop.
    exit /b 1
)

REM Проверка .env файла
if not exist .env (
    echo ⚠️  .env файл не найден. Создаю из .env.example...
    copy .env.example .env
    echo ✅ .env файл создан. Пожалуйста, отредактируйте его перед запуском.
    echo    Откройте .env и установите правильные значения для SECRET_KEY и DB_PASSWORD
    exit /b 0
)

REM Выбор команды
if "%1"=="" goto start
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="down" goto down
if "%1"=="down-volumes" goto down_volumes
if "%1"=="logs" goto logs
if "%1"=="logs-backend" goto logs_backend
if "%1"=="logs-db" goto logs_db
if "%1"=="ps" goto ps
if "%1"=="bash" goto bash
if "%1"=="psql" goto psql
if "%1"=="rebuild" goto rebuild
if "%1"=="clean" goto clean
if "%1"=="health" goto health
goto help

:start
echo 🔄 Запуск контейнеров...
docker-compose up -d
echo ✅ Контейнеры запущены!
echo.
echo 📊 Статус:
docker-compose ps
echo.
echo 🔗 Адреса:
echo    Backend: http://localhost:5000
echo    Database: localhost:5432
echo.
echo 💡 Полезные команды:
echo    docker-manage.bat logs      - Просмотр логов
echo    docker-manage.bat stop      - Остановка
echo    docker-manage.bat bash      - Вход в контейнер бэкенда
echo    docker-manage.bat psql      - Вход в PostgreSQL
goto end

:stop
echo 🛑 Остановка контейнеров...
docker-compose stop
echo ✅ Контейнеры остановлены
goto end

:restart
echo 🔄 Перезагрузка контейнеров...
docker-compose restart
echo ✅ Контейнеры перезагружены
goto end

:down
echo 🗑️  Удаление контейнеров...
docker-compose down
echo ✅ Контейнеры удалены
goto end

:down_volumes
echo 🗑️  Удаление контейнеров и данных БД...
docker-compose down -v
echo ✅ Контейнеры и данные удалены
goto end

:logs
echo 📋 Логи всех сервисов ^(последние 100 строк^):
docker-compose logs --tail=100 -f
goto end

:logs_backend
echo 📋 Логи бэкенда:
docker-compose logs -f backend
goto end

:logs_db
echo 📋 Логи БД:
docker-compose logs -f db
goto end

:ps
echo 📊 Статус контейнеров:
docker-compose ps
goto end

:bash
echo 🖥️  Вход в контейнер бэкенда...
docker-compose exec backend bash
goto end

:psql
echo 🗄️  Вход в PostgreSQL...
docker-compose exec db psql -U postgres -d system_hack_db
goto end

:rebuild
echo 🔨 Пересборка образов и перезагрузка...
docker-compose up -d --build
echo ✅ Контейнеры пересобраны и перезагружены
goto end

:clean
echo 🧹 Очистка Docker ресурсов...
docker system prune -f
echo ✅ Очистка завершена
goto end

:health
echo 🏥 Проверка здоровья приложения...
curl http://localhost:5000/health
echo.
goto end

:help
echo Использование: docker-manage.bat [команда]
echo.
echo Доступные команды:
echo   start          - Запустить контейнеры
echo   stop           - Остановить контейнеры
echo   restart        - Перезагрузить контейнеры
echo   down           - Удалить контейнеры
echo   down-volumes   - Удалить контейнеры и данные БД
echo   logs           - Просмотр логов всех сервисов
echo   logs-backend   - Логи бэкенда
echo   logs-db        - Логи БД
echo   ps             - Статус контейнеров
echo   bash           - Вход в контейнер бэкенда
echo   psql           - Вход в PostgreSQL
echo   rebuild        - Пересобрать образы
echo   clean          - Очистить неиспользуемые ресурсы
echo   health         - Проверить здоровье приложения

:end
endlocal
#!/bin/bash
# Скрипт для запуска бэкенда в Docker на Linux/Mac

set -e

echo "🚀 System Hack Backend - Docker Setup"
echo "======================================"

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Пожалуйста, установите Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose."
    exit 1
fi

# Проверка .env файла
if [ ! -f .env ]; then
    echo "⚠️  .env файл не найден. Создаю из .env.example..."
    cp .env.example .env
    echo "✅ .env файл создан. Пожалуйста, отредактируйте его перед запуском."
    echo "   Откройте .env и установите правильные значения для SECRET_KEY и DB_PASSWORD"
    exit 0
fi

# Выбор команды
case "${1:-start}" in
    start)
        echo "🔄 Запуск контейнеров..."
        docker-compose up -d
        echo "✅ Контейнеры запущены!"
        echo ""
        echo "📊 Статус:"
        docker-compose ps
        echo ""
        echo "🔗 Адреса:"
        echo "   Backend: http://localhost:5000"
        echo "   Database: localhost:5432"
        echo ""
        echo "💡 Полезные команды:"
        echo "   ./docker-manage.sh logs      - Просмотр логов"
        echo "   ./docker-manage.sh stop      - Остановка"
        echo "   ./docker-manage.sh bash      - Вход в контейнер бэкенда"
        echo "   ./docker-manage.sh psql      - Вход в PostgreSQL"
        ;;

    stop)
        echo "🛑 Остановка контейнеров..."
        docker-compose stop
        echo "✅ Контейнеры остановлены"
        ;;

    restart)
        echo "🔄 Перезагрузка контейнеров..."
        docker-compose restart
        echo "✅ Контейнеры перезагружены"
        ;;

    down)
        echo "🗑️  Удаление контейнеров..."
        docker-compose down
        echo "✅ Контейнеры удалены"
        ;;

    down-volumes)
        echo "🗑️  Удаление контейнеров и данных БД..."
        docker-compose down -v
        echo "✅ Контейнеры и данные удалены"
        ;;

    logs)
        echo "📋 Логи всех сервисов (последние 100 строк):"
        docker-compose logs --tail=100 -f
        ;;

    logs-backend)
        echo "📋 Логи бэкенда:"
        docker-compose logs -f backend
        ;;

    logs-db)
        echo "📋 Логи БД:"
        docker-compose logs -f db
        ;;

    ps)
        echo "📊 Статус контейнеров:"
        docker-compose ps
        ;;

    bash)
        echo "🖥️  Вход в контейнер бэкенда..."
        docker-compose exec backend bash
        ;;

    psql)
        echo "🗄️  Вход в PostgreSQL..."
        docker-compose exec db psql -U postgres -d system_hack_db
        ;;

    rebuild)
        echo "🔨 Пересборка образов и перезагрузка..."
        docker-compose up -d --build
        echo "✅ Контейнеры пересобраны и перезагружены"
        ;;

    clean)
        echo "🧹 Очистка Docker ресурсов..."
        docker system prune -f
        echo "✅ Очистка завершена"
        ;;

    health)
        echo "🏥 Проверка здоровья приложения..."
        curl http://localhost:5000/health
        echo ""
        ;;

    *)
        echo "Использование: ./docker-manage.sh [команда]"
        echo ""
        echo "Доступные команды:"
        echo "  start          - Запустить контейнеры"
        echo "  stop           - Остановить контейнеры"
        echo "  restart        - Перезагрузить контейнеры"
        echo "  down           - Удалить контейнеры"
        echo "  down-volumes   - Удалить контейнеры и данные БД"
        echo "  logs           - Просмотр логов всех сервисов"
        echo "  logs-backend   - Логи бэкенда"
        echo "  logs-db        - Логи БД"
        echo "  ps             - Статус контейнеров"
        echo "  bash           - Вход в контейнер бэкенда"
        echo "  psql           - Вход в PostgreSQL"
        echo "  rebuild        - Пересобрать образы"
        echo "  clean          - Очистить неиспользуемые ресурсы"
        echo "  health         - Проверить здоровье приложения"
        ;;
esac

