# System_Hack_Novosibirsk

Проект — демо-инструмент для оценки выгорания сотрудников и встроенного AI-ассистента (Hack System: Новосибирск).

Ниже — краткая инструкция что под капотом, как собрать и запустить проект локально и какие переменные окружения нужны для работы AI (Hugging Face / OpenAI).

---

## Структура репозитория (кратко)

- `Front-End/` — React + Vite клиентская часть
  - `src/components/common/Assistant.jsx` — компонент AI-ассистента
  - `src/services/api.js` — небольшой wrapper для HTTP-запросов к бэкенду
- `Back-end/` — Flask приложение
  - `app.py` — точка входа и регистрация blueprints
  - `routes/ai.py` — endpoint `/ai/chat` для общения с LLM
  - `routes/*` — остальные API: auth, assessment, recommendations и т.д.
  - `requirements.txt` — зависимости Python

---

## Что под капотом: AI-ассистент — логика вызовов

Когда пользователь отправляет сообщение из UI ассистента, фронтенд делает POST `/ai/chat` на бэкенд. На бэкенде логика выбора провайдера LLM следующая (приоритет):

1. Hugging Face Inference API (если задан `HF_API_KEY` / `HUGGINGFACE_API_KEY`).
2. OpenAI Chat Completions (если задан `OPENAI_API_KEY`).
3. Локальный LLM endpoint (если задан `LOCAL_LLM_ENDPOINT`).
4. Безопасная локальная заглушка (эмуляция ответа).

Ответ возвращается в формате JSON `{ "reply": "..." }` и отображается в UI ассистента.

---

## Переменные окружения

Backend (Flask):

- `HF_API_KEY` или `HUGGINGFACE_API_KEY` — токен Hugging Face Inference API (приоритетный, если указан).
- `HF_MODEL` — модель на Hugging Face (по умолчанию `gpt2`). Рекомендуется выбрать подходящую модель, например `tiiuae/falcon-7b-instruct` или другая, поддерживаемая Inference API.
- `OPENAI_API_KEY` — ключ OpenAI (если вы хотите использовать OpenAI вместо HF).
- `OPENAI_MODEL` — модель OpenAI (по умолчанию `gpt-3.5-turbo`).
- `LOCAL_LLM_ENDPOINT` — URL локального LLM (формат POST {"message": "..."}).

Пример (Windows cmd.exe):

```cmd
set HF_API_KEY=hf_xxxYOURKEYxxx
set HF_MODEL=tiiuae/falcon-7b-instruct
```

Frontend (Vite):

- `VITE_API_URL` — URL бэкенда (по умолчанию `http://localhost:8000`).

Пример (.env):

```
VITE_API_URL=http://localhost:8000
```

---

## Установка и запуск (локально)

1) Python backend:

- Перейдите в папку `Back-end` и установите зависимости:

```bash
python -m pip install -r Back-end/requirements.txt
```

- Установите необходимые env vars (см. выше).

- Запустите приложение:

```cmd
python Back-end/app.py
```

По умолчанию сервер слушает на `http://0.0.0.0:8000`.

2) Frontend (React + Vite):

- Перейдите в папку `Front-End` и установите зависимости:

```bash
cd Front-End
npm install
npm run dev
```

- Откройте в браузере `http://localhost:5173` (или адрес, который выдаст Vite).

---

## Быстрые проверки / примеры

- Health check бэкенда:

```bash
curl http://localhost:8000/health
# => {"status":"ok"}
```

- Тест `/ai/chat` через curl (пример):

```bash
curl -X POST http://localhost:8000/ai/chat -H "Content-Type: application/json" -d '{"message": "Привет, кто ты?"}'
# => {"reply":"..."}
```

Если настроен `HF_API_KEY`, запрос пойдёт в Hugging Face, иначе — в OpenAI (если есть), иначе — на локальную заглушку.

---

## Рекомендации и замечания

- Hugging Face Inference API может иметь лимиты/платные тарифы — внимательно читайте условия.
- OpenAI — платный сервис; следите за расходом ключа.
- Для продакшена: добавить rate-limiting, аутентификацию на `/ai/chat`, логирование запросов (с маскированием PII), и мониторинг затрат.
- В UI ассистента реализована простая история сообщений, она хранится в `sessionStorage` и очищается при завершении сессии (браузер/вкладка).

---

## Что можно улучшить далее

- Реализовать streaming ответов (SSE / chunked) для лучшей UX при больших ответах.
- Поддержать выбор провайдера в UI (HF / OpenAI / локал) и отображать используемый источник.
- Добавить механизм rate-limiting и авторизации для защиты от злоупотреблений.

---

Если хотите, могу обновить README ещё детальнее: добавить примеры env файлов, команды для Docker (если планируете контейнеризировать), и инструкции по выбору подходящей модели HF — скажите, что именно нужно добавить.
