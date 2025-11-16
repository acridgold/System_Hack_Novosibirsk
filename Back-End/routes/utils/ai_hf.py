"""
Модуль для генерации рекомендаций через Yandex GPT API
Копия логики из `ai.py`, но дублируется здесь для удобства.
"""
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

YANDEX_GPT_API_KEY = os.getenv('YANDEX_GPT_API_KEY')
YANDEX_GPT_IAM_TOKEN = os.getenv('YANDEX_GPT_IAM_TOKEN')
YANDEX_GPT_MODEL = os.getenv('YANDEX_GPT_MODEL', 'yandexgpt/latest')
YANDEX_GPT_CATALOG_ID = os.getenv('YANDEX_GPT_CATALOG_ID', '')

# Импортируем резервную функцию из оригинального модуля
try:
    from .ai import get_fallback_recommendations
except Exception:
    # На случай прямого запуска или если относительный импорт недоступен,
    # определим простую резервную функцию
    def get_fallback_recommendations(team_stats):
        recs = []
        if team_stats.get('critical', 0) > 0:
            recs.append(f"Срочно провести индивидуальные беседы с {team_stats['critical']} сотрудниками в критическом состоянии")
        if team_stats.get('warning', 0) > 0:
            recs.append(f"Организовать групповую встречу с {team_stats['warning']} сотрудниками, требующими внимания")
        if team_stats.get('avg_burnout', 0) > 60:
            recs.append("Рассмотреть возможность перераспределения нагрузки в команде")
            recs.append("Организовать тренинги по управлению стрессом и тайм-менеджменту")
        recs.append("Внедрить программу поддержки психологического здоровья сотрудников")
        return recs[:5]


def generate_recommendations_yandex(team_stats):
    """
    Генерация рекомендаций через Yandex GPT API.

    Args:
        team_stats (dict): статистика команды (ключи: critical, warning, good, total, avg_burnout)

    Returns:
        list: до 5 рекомендаций (строк)
    """
    try:
        if not YANDEX_GPT_API_KEY and not YANDEX_GPT_IAM_TOKEN:
            raise RuntimeError('YANDEX_GPT_API_KEY или YANDEX_GPT_IAM_TOKEN не настроены в окружении')

        prompt = f"""
Ты - эксперт по управлению персоналом и профилактике профессионального выгорания.

Статистика команды:
- Сотрудников в критическом состоянии: {team_stats.get('critical', 0)}
- Сотрудников требующих внимания: {team_stats.get('warning', 0)}
- Сотрудников в норме: {team_stats.get('good', 0)}
- Всего сотрудников: {team_stats.get('total', 0)}
- Средний уровень выгорания: {team_stats.get('avg_burnout', 0)}%

Сгенерируй 4-5 конкретных, практичных рекомендаций для менеджера по улучшению ситуации.
Рекомендации должны быть краткими (1-2 предложения каждая), действенными и конкретными, применимыми в контексте курьерской службы CDEK.
Формат ответа: каждая рекомендация с новой строки, без номеров и маркеров.
"""

        headers = {
            'Content-Type': 'application/json',
            'x-folder-id': YANDEX_GPT_CATALOG_ID,
        }

        # Используем либо API Key, либо IAM токен (приоритет: API Key)
        if YANDEX_GPT_API_KEY:
            headers['Authorization'] = f'Api-Key {YANDEX_GPT_API_KEY}'
        else:
            headers['Authorization'] = f'Bearer {YANDEX_GPT_IAM_TOKEN}'

        payload = {
            'modelUri': f'gpt://{YANDEX_GPT_CATALOG_ID}/{YANDEX_GPT_MODEL}',
            'completionOptions': {
                'temperature': 0.7,
                'maxTokens': 400,
            },
            'messages': [
                {
                    'role': 'user',
                    'text': prompt
                }
            ]
        }

        url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        # Обработка ответа от Yandex GPT
        text = ""
        if isinstance(data, dict):
            result = data.get('result')
            if isinstance(result, dict):
                alternatives = result.get('alternatives')
                if isinstance(alternatives, list) and len(alternatives) > 0:
                    first_alt = alternatives[0]
                    if isinstance(first_alt, dict):
                        message = first_alt.get('message')
                        if isinstance(message, dict):
                            text = message.get('text', '')

        if text:
            recommendations = [r.strip() for r in text.split('\n') if r.strip()]
            return recommendations[:5]
        else:
            return get_fallback_recommendations(team_stats)

    except Exception as e:
        print(f"Ошибка Yandex GPT inference: {e}")
        return get_fallback_recommendations(team_stats)


# Для обратной совместимости - алиас основной функции
generate_recommendations = generate_recommendations_yandex


# Небольшой самотест при запуске файла напрямую
if __name__ == '__main__':
    sample = {'critical': 1, 'warning': 2, 'good': 7, 'total': 10, 'avg_burnout': 45}
    print('YANDEX_GPT_MODEL:', YANDEX_GPT_MODEL)
    print(generate_recommendations_yandex(sample))
