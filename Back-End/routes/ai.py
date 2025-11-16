from flask import Blueprint, request, jsonify
import requests
import os

from .data.logger import ai_logger

ai_bp = Blueprint('ai', __name__)


@ai_bp.route('/chat', methods=['POST'])
def chat():
    """
    Endpoint для общения с LLM.
    Порядок приоритета:
    1) Yandex GPT API (если задан YANDEX_GPT_IAM_TOKEN)
    2) OpenAI API (если задан OPENAI_API_KEY)
    3) Локальный endpoint, указанный в LOCAL_LLM_ENDPOINT
    4) Локальная безопасная заглушка (всегда работает)

    Ожидает JSON: { "message": "..." }
    Возвращает JSON: { "reply": "..." } с статусом 200
    """
    try:
        data = request.get_json(force=True)
        message = (data or {}).get('message')
        if not message or not isinstance(message, str):
            ai_logger.warning('AI chat: invalid payload')
            return jsonify({'detail': 'Field "message" is required'}), 400

        # 1) Yandex GPT API
        yandex_api_key = os.environ.get('YANDEX_GPT_API_KEY')
        yandex_iam_token = os.environ.get('YANDEX_GPT_IAM_TOKEN')

        if yandex_api_key or yandex_iam_token:
            try:
                yandex_model = os.environ.get('YANDEX_GPT_MODEL', 'yandexgpt/latest')
                yandex_catalog_id = os.environ.get('YANDEX_GPT_CATALOG_ID', '')
                temperature = float(os.environ.get('YANDEX_GPT_TEMPERATURE', '0.7'))
                max_tokens = int(os.environ.get('YANDEX_GPT_MAX_TOKENS', '512'))

                headers = {
                    'Content-Type': 'application/json',
                    'x-folder-id': yandex_catalog_id,
                }

                # Используем либо API Key, либо IAM токен (приоритет: API Key)
                if yandex_api_key:
                    headers['Authorization'] = f'Api-Key {yandex_api_key}'
                else:
                    headers['Authorization'] = f'Bearer {yandex_iam_token}'

                payload = {
                    'modelUri': f'gpt://{yandex_catalog_id}/{yandex_model}',
                    'completionOptions': {
                        'temperature': temperature,
                        'maxTokens': max_tokens,
                    },
                    'messages': [
                        {
                            'role': 'user',
                            'text': message
                        }
                    ]
                }

                ai_logger.info(f'Sending request to Yandex GPT API: model={yandex_model}')
                resp = requests.post(
                    'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
                    json=payload,
                    headers=headers,
                    timeout=60
                )
                ai_logger.info(f'Yandex GPT response status: {resp.status_code}')

                if resp.status_code == 200:
                    try:
                        response_data = resp.json()
                        reply = None
                        if isinstance(response_data, dict):
                            result = response_data.get('result')
                            if isinstance(result, dict):
                                alternatives = result.get('alternatives')
                                if isinstance(alternatives, list) and len(alternatives) > 0:
                                    first_alt = alternatives[0]
                                    if isinstance(first_alt, dict):
                                        reply = first_alt.get('message', {}).get('text')

                        if reply:
                            ai_logger.info('Successfully got reply from Yandex GPT')
                            return jsonify({'reply': reply.strip()}), 200
                    except Exception as e:
                        ai_logger.warning(f'Error parsing Yandex GPT response: {e}')
                else:
                    ai_logger.warning(f'Yandex GPT returned status {resp.status_code}')
                    try:
                        error_data = resp.json()
                        ai_logger.warning(f'Yandex GPT error: {error_data}')
                    except:
                        ai_logger.warning(f'Yandex GPT response: {resp.text}')

                # Fallback к локальной заглушке
                ai_logger.info('Yandex GPT error or invalid response, falling back to local mock')
                reply = _local_mock_response(message)
                return jsonify({'reply': reply}), 200

            except requests.exceptions.Timeout:
                ai_logger.warning('Timeout contacting Yandex GPT API, using local response')
                reply = _local_mock_response(message)
                return jsonify({'reply': reply}), 200
            except Exception as e:
                ai_logger.warning(f'Error contacting Yandex GPT API: {e}, using local response')
                reply = _local_mock_response(message)
                return jsonify({'reply': reply}), 200

        # 2) Если указан OpenAI API key
        openai_key = os.environ.get('OPENAI_API_KEY')
        if openai_key:
            try:
                openai_model = os.environ.get('OPENAI_MODEL', 'gpt-3.5-turbo')
                temperature = float(os.environ.get('OPENAI_TEMPERATURE', '0.7'))
                max_tokens = int(os.environ.get('OPENAI_MAX_TOKENS', '512'))

                headers = {
                    'Authorization': f'Bearer {openai_key}',
                    'Content-Type': 'application/json'
                }

                payload = {
                    'model': openai_model,
                    'messages': [
                        {'role': 'user', 'content': message}
                    ],
                    'temperature': temperature,
                    'max_tokens': max_tokens,
                    'n': 1,
                }

                ai_logger.info('Sending request to OpenAI API')
                resp = requests.post('https://api.openai.com/v1/chat/completions', json=payload, headers=headers, timeout=60)

                if resp.status_code == 200:
                    try:
                        data = resp.json()
                        reply = None
                        if isinstance(data, dict):
                            choices = data.get('choices')
                            if isinstance(choices, list) and len(choices) > 0:
                                msg = choices[0].get('message')
                                if isinstance(msg, dict):
                                    reply = msg.get('content')

                        if reply:
                            ai_logger.info('Successfully got reply from OpenAI')
                            return jsonify({'reply': reply.strip()}), 200
                    except Exception as e:
                        ai_logger.warning(f'Error parsing OpenAI response: {e}')

                # Fallback к локальной заглушке
                ai_logger.info('OpenAI error or invalid response, falling back to local mock')
                reply = _local_mock_response(message)
                return jsonify({'reply': reply}), 200

            except Exception as e:
                ai_logger.warning(f'Error contacting OpenAI API: {e}, using local response')
                reply = _local_mock_response(message)
                return jsonify({'reply': reply}), 200

        # 3) Попытка форварда на локальный LLM endpoint
        local_endpoint = os.environ.get('LOCAL_LLM_ENDPOINT')
        if local_endpoint:
            try:
                ai_logger.info(f'Sending request to local endpoint: {local_endpoint}')
                resp = requests.post(local_endpoint, json={'message': message}, timeout=30)
                if resp.status_code == 200:
                    try:
                        payload = resp.json()
                        reply = payload.get('reply') if isinstance(payload, dict) else None
                        if reply:
                            ai_logger.info('Successfully got reply from local LLM endpoint')
                            return jsonify({'reply': reply}), 200
                    except Exception as e:
                        ai_logger.warning(f'Error parsing local LLM response: {e}')
            except Exception as e:
                ai_logger.warning(f'Error contacting local LLM endpoint: {e}')

        # 4) Локальная заглушка — всегда работает
        ai_logger.info('Using local mock response')
        reply = _local_mock_response(message)
        return jsonify({'reply': reply}), 200

    except Exception as e:
        ai_logger.error(f'AI chat error: {e}', exc_info=True)
        # Даже при ошибке возвращаем 200 с локальной заглушкой
        reply = _local_mock_response("Произошла ошибка при обработке запроса")
        return jsonify({'reply': reply}), 200


def _extract_hf_reply(response_data) -> str:
    """
    Извлечь текст ответа из HuggingFace API ответа.
    Поддерживает разные форматы ответов.
    """
    reply = None

    if isinstance(response_data, list) and len(response_data) > 0:
        # Формат: [{"generated_text": "..."}, ...] или [{"summary_text": "..."}, ...]
        first = response_data[0]
        if isinstance(first, dict):
            reply = (first.get('generated_text') or
                    first.get('summary_text') or
                    first.get('text') or
                    str(first))

    elif isinstance(response_data, dict):
        # Формат: {"generated_text": "..."} или {"error": "..."}
        if 'error' in response_data:
            return None

        reply = (response_data.get('generated_text') or
                response_data.get('summary_text') or
                response_data.get('text') or
                str(response_data))

    return reply.strip() if reply else None


def _local_mock_response(message: str) -> str:
    """
    Простая эвристическая генерация ответа (локальная заглушка).
    Всегда возвращает ответ, не требует внешних сервисов.
    """
    msg = message.strip().lower()
    if not msg:
        return "Пожалуйста, напишите сообщение — я готов помочь."

    # Простейшая логика: вопрос -> ответ, приветствие, благодарность
    if any(w in msg for w in ['привет', 'здравствуйте', 'хаю', 'хай', 'привет!']):
        return "Привет! Я ваш AI помощник. Чем я могу помочь?"

    if any(w in msg for w in ['спасибо', 'благодарю', 'спасибо!']):
        return "Пожалуйста! Рад был помочь вам."

    if any(w in msg for w in ['как дела', 'как ты', 'что случилось', 'что нового']):
        return "У меня все хорошо! Я готов ответить на ваши вопросы и помочь с рекомендациями."

    if any(w in msg for w in ['рекомендаци', 'совет', 'подскажи', 'помоги']):
        return "Я могу помочь с персональными рекомендациями. Расскажите мне больше о том, что вас интересует."

    if any(w in msg for w in ['день', 'время', 'дата', 'когда']):
        from datetime import datetime
        now = datetime.now()
        return f"Сейчас {now.strftime('%H:%M:%S')} {now.strftime('%d.%m.%Y')} (время на сервере)."

    if msg.endswith('?') or any(w in msg for w in ['как', 'что', 'почему', 'где', 'когда', 'кто']):
        return f"Спасибо за вопрос: «{message.strip()}». Это интересный вопрос! Могу предложить несколько вариантов решения или рекомендаций."

    # Иначе парафраз
    shortened = message
    if len(shortened) > 150:
        shortened = shortened[:147] + '...'
    return f"Интересное замечание: «{shortened}». Могу помочь развить эту тему или предложить рекомендации."
