#!/usr/bin/env python3
"""
Тестовый скрипт для проверки работы эндпойнта авторизации
"""
import requests
import json

BASE_URL = "http://localhost:5555"

print("=" * 60)
print("ТЕСТИРОВАНИЕ ЭНДПОЙНТА АВТОРИЗАЦИИ")
print("=" * 60)

# Тестовые учетные данные
test_credentials = {
    'username': 'user@example.co',
    'password': 'password123'
}

print(f"\n📤 Отправляю POST запрос на {BASE_URL}/auth/token")
print(f"📋 Данные: {test_credentials}")

try:
    response = requests.post(
        f"{BASE_URL}/auth/token",
        data=test_credentials,
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )

    print(f"\n✅ Статус ответа: {response.status_code}")
    print(f"📄 Ответ:\n{json.dumps(response.json(), indent=2, ensure_ascii=False)}")

    if response.status_code == 200:
        token = response.json().get('access_token')
        print(f"\n✅ Токен получен успешно: {token[:20]}...")

        # Проверим endpoint /auth/me
        print(f"\n📤 Проверяю GET запрос на {BASE_URL}/auth/me")
        response_me = requests.get(
            f"{BASE_URL}/auth/me",
            headers={'Authorization': f'Bearer {token}'}
        )
        print(f"✅ Статус ответа: {response_me.status_code}")
        print(f"📄 Ответ:\n{json.dumps(response_me.json(), indent=2, ensure_ascii=False)}")

except requests.exceptions.ConnectionError:
    print("\n❌ ОШИБКА: Не могу подключиться к бэкенду на localhost:8000")
    print("💡 Убедитесь, что Flask сервер запущен!")
except Exception as e:
    print(f"\n❌ ОШИБКА: {e}")

print("\n" + "=" * 60)

