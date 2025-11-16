# Миграция с OpenRouter на Yandex GPT

## 📋 Что изменилось

**OpenRouter** был заменен на **Yandex GPT**.

### Преимущества Yandex GPT:
- ✅ Российский сервис (быстрее для локальной работы)
- ✅ Интеграция с Яндекс.Облаком
- ✅ Поддержка русского языка на отличном уровне
- ✅ Конкурентные цены
- ✅ Бесплатный уровень с пробным кредитом

---

## 🔧 Настройка переменных окружения

Создайте или отредактируйте файл `.env` в папке `Back-end/`:

### Шаг 1: Получить IAM токен

1. Перейдите на https://console.cloud.yandex.ru/
2. Создайте или выберите проект (Folder)
3. Скопируйте **Folder ID** (понадобится для `YANDEX_GPT_CATALOG_ID`)
4. Перейдите в "Сервисные аккаунты" → создайте новый сервисный аккаунт
5. Создайте ключ API для этого аккаунта
6. Скопируйте приватный ключ в файл (например, `key.json`)

### Шаг 2: Получить IAM токен из приватного ключа

```bash
# Используйте Yandex Cloud CLI или curl для получения IAM токена
curl -X POST https://auth.api.cloud.yandex.net/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" \
  -d "assertion=<JWT>"
```

Или используйте готовый инструмент: https://cloud.yandex.ru/docs/iam/operations/iam-token/create-for-sa

### Шаг 3: Конфигурация .env

```env
# Yandex GPT
YANDEX_GPT_IAM_TOKEN=t1.9eu..._ВАШ_IAM_ТОКЕН_ЗДЕСЬ
YANDEX_GPT_CATALOG_ID=b1xxxxxxxxxxxxxxxxxx
YANDEX_GPT_MODEL=yandexgpt/latest
YANDEX_GPT_TEMPERATURE=0.7
YANDEX_GPT_MAX_TOKENS=512

# OpenAI (опционально, как fallback)
# OPENAI_API_KEY=sk-YOUR_KEY_HERE
```

---

## 📊 Структура API Yandex GPT

### Request
```json
{
  "modelUri": "gpt://b1xxxxxxxxxxxxxxxxxx/yandexgpt/latest",
  "completionOptions": {
    "temperature": 0.7,
    "maxTokens": 512
  },
  "messages": [
    {
      "role": "user",
      "text": "Привет, как дела?"
    }
  ]
}
```

### Response
```json
{
  "result": {
    "alternatives": [
      {
        "message": {
          "role": "assistant",
          "text": "Привет! Я работаю хорошо и готов помочь."
        },
        "status": "FINAL"
      }
    ],
    "usage": {
      "inputTextTokens": "5",
      "completionTokens": "8"
    }
  }
}
```

---

## 🔐 Получение IAM токена (подробно)

### Способ 1: Используя Yandex Cloud CLI

```bash
# Установить CLI (если еще не установлен)
curl https://storage.yandexcloud.net/yandexcloud-release/install.sh | bash

# Инициализировать
yc init

# Получить IAM токен
yc iam create-token
```

### Способ 2: Используя сервисный аккаунт и JWT

```bash
# Установить jq для работы с JSON
sudo apt-get install jq

# Создать JWT токен
JWT=$(jq -r '.private_key' key.json | \
  openssl dgst -sha256 -sign /dev/stdin \
  <(echo '{"iss":"","sub":"","aud":"https://auth.api.cloud.yandex.net/oauth/token","iat":'$(date +%s)',"exp":'$(($(date +%s) + 3600))'}') | \
  base64 -w 0)

# Получить IAM токен
curl -X POST https://auth.api.cloud.yandex.net/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=$JWT"
```

### Способ 3: Автоматическое получение IAM токена в приложении

Если вы хотите, чтобы приложение автоматически получало IAM токен, создайте вспомогательный модуль:

```python
# Back-end/routes/utils/yandex_auth.py
import requests
import json
import time
from datetime import datetime, timedelta

class YandexGPTAuth:
    def __init__(self, service_account_key_file):
        self.key_file = service_account_key_file
        self.iam_token = None
        self.token_expires_at = None
    
    def get_iam_token(self):
        """Получить IAM токен, переиспользуя если он еще валиден"""
        if self.iam_token and self.token_expires_at and datetime.now() < self.token_expires_at:
            return self.iam_token
        
        # Получить новый токен
        with open(self.key_file, 'r') as f:
            key = json.load(f)
        
        # Создать JWT
        import jwt
        import time
        
        now = int(time.time())
        payload = {
            'iss': key['service_account_id'],
            'sub': key['service_account_id'],
            'aud': 'https://auth.api.cloud.yandex.net/oauth/token',
            'iat': now,
            'exp': now + 3600
        }
        
        jwt_token = jwt.encode(
            payload,
            key['private_key'],
            algorithm='RS256'
        )
        
        # Обменять JWT на IAM токен
        resp = requests.post(
            'https://auth.api.cloud.yandex.net/oauth/token',
            data={
                'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion': jwt_token
            }
        )
        
        data = resp.json()
        self.iam_token = data['access_token']
        self.token_expires_at = datetime.now() + timedelta(hours=1)
        
        return self.iam_token
```

---

## 🚀 Порядок приоритета API

Приложение теперь использует:

1. **Yandex GPT API** (если задан `YANDEX_GPT_IAM_TOKEN`)
2. **OpenAI API** (если задан `OPENAI_API_KEY`)
3. Локальный LLM endpoint (если задан `LOCAL_LLM_ENDPOINT`)
4. **Локальная заглушка** (всегда работает, не требует интернета)

---

## ✅ Проверка работы

### Тест 1: Запустить приложение
```bash
cd Back-end
python app.py
```

### Тест 2: Проверить API через curl

```bash
# Отправить сообщение в чат
curl -X POST http://localhost:8000/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Привет, как дела?"}'
```

Ожидаемый ответ:
```json
{
  "reply": "Привет! Я работаю хорошо и готов помочь вам."
}
```

### Тест 3: Проверить логи

```bash
# Посмотреть последние 100 строк логов AI
curl http://localhost:8000/ai/logs/ai?lines=100
```

В логах должны появиться строки вроде:
```
Sending request to Yandex GPT API: model=yandexgpt/latest
Yandex GPT response status: 200
Successfully got reply from Yandex GPT
```

---

## 🐛 Диагностика проблем

### Ошибка: "YANDEX_GPT_IAM_TOKEN не установлена"
**Решение:** Создайте файл `.env` в папке `Back-end/` с правильным IAM токеном

### Ошибка: "Yandex GPT returned status 401"
**Причина:** Неправильный или истекший IAM токен
**Решение:** Получите новый IAM токен (срок действия 1 час)

### Ошибка: "Yandex GPT returned status 403"
**Причина:** Неправильный Folder ID или недостаточно прав
**Решение:** Проверьте `YANDEX_GPT_CATALOG_ID`, убедитесь что сервисный аккаунт имеет право на использование YandexGPT

### Ошибка: "Yandex GPT returned status 400"
**Причина:** Неправильный формат запроса
**Решение:** Проверьте переменные окружения и формат modelUri

### Если все API недоступны
Приложение **все равно работает** с локальной заглушкой! Это гарантирует надежность.

---

## 📝 Пример полной конфигурации

```env
# ===== Yandex GPT =====
YANDEX_GPT_IAM_TOKEN=t1.9eu5ZefV64...
YANDEX_GPT_CATALOG_ID=b1c8xxxxxxxxxxxxxxxxxx
YANDEX_GPT_MODEL=yandexgpt/latest
YANDEX_GPT_TEMPERATURE=0.7
YANDEX_GPT_MAX_TOKENS=512

# ===== OpenAI (fallback) =====
# OPENAI_API_KEY=sk-proj-...
# OPENAI_MODEL=gpt-3.5-turbo
# OPENAI_TEMPERATURE=0.7
# OPENAI_MAX_TOKENS=512

# ===== Локальный endpoint (опционально) =====
# LOCAL_LLM_ENDPOINT=http://localhost:11434/api/generate
```

---

## 🔗 Полезные ссылки

- [Yandex Cloud Console](https://console.cloud.yandex.ru/)
- [Документация Yandex GPT](https://cloud.yandex.ru/docs/foundation-models/concepts/yandexgpt)
- [API Reference](https://cloud.yandex.ru/docs/foundation-models/text-generation/api-ref)
- [Getting Started](https://cloud.yandex.ru/docs/foundation-models/quickstart)

---

## 💡 Советы

1. **IAM токен действует 1 час** - учитывайте это при планировании
2. **Используйте пробный кредит** - Yandex дает бесплатный кредит на начало
3. **Мониторьте логи** - в логах будут видны все запросы и ошибки
4. **Тестируйте через curl перед интеграцией** - так легче найти проблемы

---

## ✨ Что дальше?

1. Создайте аккаунт на https://console.cloud.yandex.ru/
2. Получите IAM токен
3. Создайте файл `.env` с конфигурацией
4. Перезапустите Flask приложение
5. Протестируйте через curl

**Готово!** Теперь ваше приложение использует Yandex GPT! 🚀

