import logging
import logging.handlers
import os
from datetime import datetime

# Создаем директорию для логов, если её нет
LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Настройка логирования
def setup_logger(name):
    """Настроить логгер с файловым и консольным выводом"""
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    # Формат логов
    log_format = '%(asctime)s - %(name)s - %(levelname)s - [%(funcName)s:%(lineno)d] - %(message)s'
    formatter = logging.Formatter(log_format)

    # Обработчик для файлов (ротация по размеру)
    log_file = os.path.join(LOG_DIR, f'{name}.log')
    file_handler = logging.handlers.RotatingFileHandler(
        log_file,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # Обработчик для консоли
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger

# Главный логгер приложения
app_logger = setup_logger('app')
auth_logger = setup_logger('auth')
assessment_logger = setup_logger('assessment')
dashboard_logger = setup_logger('dashboard')
recommendations_logger = setup_logger('recommendations')

