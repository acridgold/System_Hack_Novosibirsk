#!/usr/bin/env python3
"""
Тестовый скрипт для проверки работы AI эндпойнта
с диагностикой логирования
"""
import requests
import json
import sys
import os
from pathlib import Path

# Настройки
BASE_URL = "http://localhost:5555"
LOG_DIRS = [
    "Back-end/routes/data/logs",
    "Back-end/routes/logs",
    "Back-end/logs",
]

def check_logs():
    """Проверить наличие логов"""
    print("\n" + "=" * 60)
    print("ДИАГНОСТИКА ЛОГИРОВАНИЯ")
    print("=" * 60)

    # Найти директорию с логами
    for log_dir in LOG_DIRS:
        full_path = Path(log_dir)
        if full_path.exists():
            print(f"\n✅ Найдена директория логов: {full_path.absolute()}")
            log_files = list(full_path.glob("*.log"))
            if log_files:
                print(f"   Найдено {len(log_files)} файлов логов:")
                for log_file in log_files:
                    size = log_file.stat().st_size
                    print(f"   - {log_file.name} ({size} байт)")

                    # Показать последние строки app.log
                    if log_file.name == "app.log":
                        print(f"\n   Последние 10 строк {log_file.name}:")
                        try:
                            with open(log_file, 'r', encoding='utf-8') as f:
                                lines = f.readlines()
                                for line in lines[-10:]:
                                    print(f"   {line.rstrip()}")
                        except Exception as e:
                            print(f"   ❌ Ошибка чтения: {e}")
            else:
                print(f"   ⚠️  Директория пуста")
        else:
            print(f"\n❌ Директория не найдена: {log_dir}")

def test_health():
    """Проверить здоровье приложения"""
    print("\n" + "=" * 60)
    print("ПРОВЕРКА ЗДОРОВЬЯ ПРИЛОЖЕНИЯ")
    print("=" * 60)

    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"\n✅ Приложение доступно на {BASE_URL}")
        print(f"   Статус: {response.status_code}")
        print(f"   Ответ: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print(f"\n❌ ОШИБКА: Не могу подключиться к {BASE_URL}")
        print("   💡 Убедитесь, что Flask сервер запущен на порту 8000!")
        return False
    except Exception as e:
        print(f"\n❌ ОШИБКА: {e}")
        return False

def test_ai_chat(message):
    """Протестировать AI chat endpoint"""
    print("\n" + "=" * 60)
    print(f"ТЕСТИРОВАНИЕ AI CHAT")
    print("=" * 60)

    print(f"\n📤 Отправляю запрос к {BASE_URL}/ai/chat")
    print(f"📝 Сообщение: \"{message}\"")

    try:
        response = requests.post(
            f"{BASE_URL}/ai/chat",
            json={"message": message},
            timeout=30
        )

        print(f"\n✅ Статус ответа: {response.status_code}")

        try:
            data = response.json()
            print(f"📄 Ответ от AI:")
            print(json.dumps(data, indent=2, ensure_ascii=False))

            if response.status_code == 200:
                reply = data.get('reply')
                if reply:
                    print(f"\n✅ Успешно получен ответ!")
                    print(f"   Длина ответа: {len(reply)} символов")
                else:
                    print(f"\n⚠️  Ответ пуст или отсутствует ключ 'reply'")
            else:
                print(f"\n⚠️  Ошибка от сервера: {data.get('detail', 'Неизвестная ошибка')}")

        except ValueError as e:
            print(f"\n❌ ОШИБКА: Не могу распарсить JSON ответ")
            print(f"   Текст ответа: {response.text[:200]}")

    except requests.exceptions.Timeout:
        print(f"\n⏱️  TIMEOUT: Запрос на AI занял слишком много времени (>30сек)")
        print(f"   💡 Возможно, сервис HuggingFace/OpenAI недоступен")
    except requests.exceptions.ConnectionError:
        print(f"\n❌ ОШИБКА: Не могу подключиться к {BASE_URL}")
    except Exception as e:
        print(f"\n❌ ОШИБКА: {e}")

def test_ai_invalid_request():
    """Протестировать обработку ошибок"""
    print("\n" + "=" * 60)
    print("ТЕСТИРОВАНИЕ ОБРАБОТКИ ОШИБОК")
    print("=" * 60)

    print(f"\n📤 Отправляю невалидный запрос (без message)...")

    try:
        response = requests.post(
            f"{BASE_URL}/ai/chat",
            json={},
            timeout=5
        )

        print(f"\n✅ Статус ответа: {response.status_code}")
        data = response.json()
        print(f"📄 Ответ: {json.dumps(data, indent=2, ensure_ascii=False)}")

        if response.status_code == 400:
            print(f"\n✅ Корректная обработка ошибки (400)")
        else:
            print(f"\n⚠️  Неожиданный статус код")

    except Exception as e:
        print(f"\n❌ ОШИБКА: {e}")

def main():
    print("\n" + "=" * 60)
    print("ТЕСТИРОВАНИЕ AI CHAT И ДИАГНОСТИКА ЛОГИРОВАНИЯ")
    print("=" * 60)

    # Диагностика логов
    check_logs()

    # Проверка здоровья
    if not test_health():
        print("\n💡 Запустите сервер: python Back-end/app.py")
        return

    # Тесты AI
    test_messages = [
        "Привет! Как дела?",
        "Какой сегодня день?",
        "Помоги мне с рекомендациями",
        "Это пример вопроса с вопросительным знаком?"
    ]

    for message in test_messages:
        test_ai_chat(message)
        print()

    # Тест обработки ошибок
    test_ai_invalid_request()

    print("\n" + "=" * 60)
    print("ТЕСТИРОВАНИЕ ЗАВЕРШЕНО")
    print("=" * 60 + "\n")

if __name__ == '__main__':
    main()

