from flask import Blueprint, request, jsonify
import requests
import os

from .data.logger import app_logger

ai_bp = Blueprint('ai', __name__)


@ai_bp.route('/chat', methods=['POST'])
def chat():
    """
    Endpoint для общения с LLM.
    Порядок приоритета:
    1) Hugging Face Inference API (если задан HF_API_KEY или HUGGINGFACE_API_KEY)
    2) OpenAI API (если задан OPENAI_API_KEY)
    3) Локальный endpoint, указанный в LOCAL_LLM_ENDPOINT
    4) Локальная безопасная заглушка

    Ожидает JSON: { "message": "..." }
    Возвращает JSON: { "reply": "..." }
    """
    try:
        data = request.get_json(force=True)
        message = (data or {}).get('message')
        if not message or not isinstance(message, str):
            app_logger.warning('AI chat: invalid payload')
            return jsonify({'detail': 'Field "message" is required'}), 400

        # 1) Hugging Face Inference API
        hf_key = os.environ.get('HF_API_KEY') or os.environ.get('HUGGINGFACE_API_KEY')
        if hf_key:
            try:
                hf_model = os.environ.get('HF_MODEL', 'gpt2')
                hf_url = f'https://api-inference.huggingface.co/models/{hf_model}'
                headers = {
                    'Authorization': f'Bearer {hf_key}',
                    'Content-Type': 'application/json'
                }
                payload = {
                    'inputs': message,
                    'options': {'wait_for_model': True}
                }
                app_logger.info(f'Forwarding AI request to Hugging Face Inference API: model={hf_model}')
                resp = requests.post(hf_url, headers=headers, json=payload, timeout=60)
                if resp.status_code != 200:
                    app_logger.warning(f'Hugging Face returned status {resp.status_code}: {resp.text}')
                    return jsonify({'detail': 'Hugging Face API error', 'status': resp.status_code, 'body': resp.text}), 502

                payload = resp.json()
                # Возможные формы ответа: list of {generated_text}, or dict with 'generated_text', or list of dicts
                reply = None
                if isinstance(payload, list) and len(payload) > 0:
                    first = payload[0]
                    if isinstance(first, dict) and 'generated_text' in first:
                        reply = first['generated_text']
                    elif isinstance(first, dict) and 'generated_text' not in first:
                        # Иногда HF returns [{'generated_text': ...}] or [{'generated_text': ...}]
                        # If structure differs, try to join text fields
                        # fallback: convert to string
                        reply = str(first)
                elif isinstance(payload, dict):
                    if 'generated_text' in payload:
                        reply = payload.get('generated_text')
                    elif 'error' in payload:
                        app_logger.warning(f'Hugging Face error body: {payload.get("error")}')
                        return jsonify({'detail': 'Invalid response from Hugging Face', 'body': payload}), 502
                    else:
                        # fallback to stringified dict
                        reply = str(payload)

                if not reply:
                    app_logger.warning('Hugging Face response missing generated text')
                    return jsonify({'detail': 'Invalid response from Hugging Face'}), 502

                return jsonify({'reply': reply.strip()}), 200

            except Exception as e:
                app_logger.error(f'Error contacting Hugging Face API: {e}', exc_info=True)
                return jsonify({'detail': 'Failed to contact Hugging Face API'}), 502

        # 2) Если указан OpenAI API key — используем OpenAI Chat Completions
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

                app_logger.info('Forwarding AI request to OpenAI API')
                resp = requests.post('https://api.openai.com/v1/chat/completions', json=payload, headers=headers, timeout=60)
                if resp.status_code != 200:
                    app_logger.warning(f'OpenAI returned status {resp.status_code}: {resp.text}')
                    return jsonify({'detail': 'OpenAI API error', 'status': resp.status_code, 'body': resp.text}), 502

                data = resp.json()
                # Ожидаем структуру: choices[0].message.content
                reply = None
                if isinstance(data, dict):
                    choices = data.get('choices')
                    if isinstance(choices, list) and len(choices) > 0:
                        msg = choices[0].get('message')
                        if isinstance(msg, dict):
                            reply = msg.get('content')

                if not reply:
                    app_logger.warning('OpenAI response missing content')
                    return jsonify({'detail': 'Invalid response from OpenAI'}), 502

                return jsonify({'reply': reply.strip()}), 200

            except Exception as e:
                app_logger.error(f'Error contacting OpenAI API: {e}', exc_info=True)
                return jsonify({'detail': 'Failed to contact OpenAI API'}), 502

        # 3) Попытка форварда на локальный LLM endpoint (если задан)
        local_endpoint = os.environ.get('LOCAL_LLM_ENDPOINT')
        if local_endpoint:
            try:
                app_logger.info(f'Forwarding AI request to local endpoint: {local_endpoint}')
                resp = requests.post(local_endpoint, json={'message': message}, timeout=30)
                if resp.status_code != 200:
                    app_logger.warning(f'Local LLM returned status {resp.status_code}')
                    return jsonify({'detail': 'Local LLM error', 'status': resp.status_code}), 502
                # Ожидаем, что локальный LLM вернёт JSON с ключом 'reply'
                payload = resp.json()
                reply = payload.get('reply') if isinstance(payload, dict) else None
                if not reply:
                    app_logger.warning('Local LLM response missing "reply" field')
                    return jsonify({'detail': 'Invalid response from local LLM'}), 502
                return jsonify({'reply': reply}), 200
            except Exception as e:
                app_logger.error(f'Error forwarding to local LLM: {e}', exc_info=True)
                return jsonify({'detail': 'Failed to contact local LLM'}), 502

        # 4) Простая локальная заглушка — имитация ответа LLM
        reply = _local_mock_response(message)
        return jsonify({'reply': reply}), 200

    except Exception as e:
        app_logger.error(f'AI chat error: {e}', exc_info=True)
        return jsonify({'detail': str(e)}), 500


def _local_mock_response(message: str) -> str:
    """
    Простая эвристическая генерация ответа (заглушка LLM).
    - Если пользователь спрашивает о правилах, даём инструкцию.
    - Иначе делаем «умный» эхо с парафразой.
    """
    msg = message.strip().lower()
    if not msg:
        return "Пожалуйста, напишите сообщение — я готов помочь."

    # Простейшая логика: вопрос -> ответ, приветствие, благодарность
    if any(w in msg for w in ['привет', 'здравствуйте', 'хаю', 'хай']):
        return "Привет! Я локальный ассистент. Чем могу помочь?"

    if any(w in msg for w in ['спасибо', 'благодарю']):
        return "Пожалуйста! Рад был помочь."

    if msg.endswith('?') or any(w in msg for w in ['как', 'что', 'почему', 'где', 'когда']):
        return "Хороший вопрос — пока что я работаю в режиме эмуляции. Могу попробовать ответить так: «" + message + "» — уточните, если нужно более подробно."

    # Иначе парафраз
    shortened = message
    if len(shortened) > 200:
        shortened = shortened[:197] + '...'
    return f"Я услышал: «{shortened}». Могу помочь сформулировать ответ или поискать рекомендации."
