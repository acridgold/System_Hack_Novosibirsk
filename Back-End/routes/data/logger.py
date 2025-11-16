import logging
import logging.handlers
import os
from datetime import datetime

LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Настройка логирования
def setup_logger(name):
    """Настроить логгер с файловым и консольным выводом"""
    logger = logging.getLogger(name)

    # Очищаем существующие handlers, если логгер уже был настроен
    if logger.handlers:
        for handler in logger.handlers[:]:
            logger.removeHandler(handler)

    logger.setLevel(logging.DEBUG)
    logger.propagate = False

    # Формат логов
    log_format = '%(asctime)s - %(name)s - %(levelname)s - [%(funcName)s:%(lineno)d] - %(message)s'
    formatter = logging.Formatter(log_format)

    # Обработчик для файлов (ротация по размеру)
    log_file = os.path.join(LOG_DIR, f'{name}.log')
    try:
        file_handler = logging.handlers.RotatingFileHandler(
            log_file,
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5,
            encoding='utf-8'
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except Exception as e:
        # Пытаемся создать обработчик в текущей директории как fallback
        try:
            fallback_log_file = os.path.join(os.getcwd(), f'{name}.log')
            file_handler = logging.handlers.RotatingFileHandler(
                fallback_log_file,
                maxBytes=10*1024*1024,
                backupCount=5,
                encoding='utf-8'
            )
        except:
            pass

    # Обработчик для консоли
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger

# Главные логгеры приложения
app_logger = setup_logger('app')
auth_logger = setup_logger('auth')
assessment_logger = setup_logger('assessment')
dashboard_logger = setup_logger('dashboard')
recommendations_logger = setup_logger('recommendations')
ai_logger = setup_logger('ai')

# Проверка инициализации
app_logger.info("=" * 50)
app_logger.info("Логирование инициализировано успешно")
app_logger.info(f"Директория логов: {LOG_DIR}")
app_logger.info("=" * 50)
