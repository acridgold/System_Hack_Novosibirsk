"""
Модуль для работы с AI (Yandex GPT)
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()


def generate_manager_recommendations(team_stats):
    """
    Генерация рекомендаций для менеджера на основе статистики команды через Yandex GPT

    Args:
        team_stats (dict): Статистика команды
            {
                'critical': int,
                'warning': int,
                'good': int,
                'total': int,
                'avg_burnout': float,
            }

    Returns:
        list: Список рекомендаций
    """
    try:
        yandex_api_key = os.getenv('YANDEX_GPT_API_KEY')
        yandex_iam_token = os.getenv('YANDEX_GPT_IAM_TOKEN')
        yandex_catalog_id = os.getenv('YANDEX_GPT_CATALOG_ID', '')
        yandex_model = os.getenv('YANDEX_GPT_MODEL', 'yandexgpt/latest')

        if not yandex_api_key and not yandex_iam_token:
            print("Ошибка: YANDEX_GPT_API_KEY или YANDEX_GPT_IAM_TOKEN не установлены")
            return get_fallback_recommendations(team_stats)

        # Формируем промпт для Yandex GPT
        prompt = f"""
Ты - эксперт по управлению персоналом и профилактике профессионального выгорания.

Статистика команды:
- Сотрудников в критическом состоянии: {team_stats['critical']}
- Сотрудников требующих внимания: {team_stats['warning']}
- Сотрудников в норме: {team_stats['good']}
- Всего сотрудников: {team_stats['total']}
- Средний уровень выгорания: {team_stats['avg_burnout']}%

Сгенерируй 4-5 конкретных, практичных рекомендаций для менеджера по улучшению ситуации.
Рекомендации должны быть:
- Краткими (1-2 предложения каждая)
- Действенными и конкретными
- Применимыми в контексте курьерской службы CDEK
- Без общих фраз

Формат ответа: каждая рекомендация с новой строки, без номеров и маркеров.
"""

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
                'temperature': 0.7,
                'maxTokens': 500,
            },
            'messages': [
                {
                    'role': 'system',
                    'text': 'Ты - эксперт по HR и профилактике выгорания.'
                },
                {
                    'role': 'user',
                    'text': prompt
                }
            ]
        }

        response = requests.post(
            'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
            json=payload,
            headers=headers,
            timeout=60
        )

        if response.status_code == 200:
            try:
                response_data = response.json()
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
                    recommendations = [r.strip() for r in reply.split('\n') if r.strip()]
                    return recommendations[:5]
            except Exception as e:
                print(f"Ошибка парсинга ответа Yandex GPT: {e}")
        else:
            print(f"Yandex GPT вернул статус {response.status_code}")
            try:
                error_data = response.json()
                print(f"Ошибка: {error_data}")
            except:
                print(f"Ответ: {response.text}")

        return get_fallback_recommendations(team_stats)

    except Exception as e:
        # Fallback на статичные рекомендации при ошибке
        print(f"Ошибка генерации AI рекомендаций: {e}")
        return get_fallback_recommendations(team_stats)


def get_fallback_recommendations(team_stats):
    """
    Резервные рекомендации на случай недоступности AI
    """
    recommendations = []

    if team_stats['critical'] > 0:
        recommendations.append(
            f"Срочно провести индивидуальные беседы с {team_stats['critical']} сотрудниками в критическом состоянии"
        )

    if team_stats['warning'] > 0:
        recommendations.append(
            f"Организовать групповую встречу с {team_stats['warning']} сотрудниками, требующими внимания"
        )

    if team_stats['avg_burnout'] > 60:
        recommendations.append(
            "Рассмотреть возможность перераспределения нагрузки в команде"
        )
        recommendations.append(
            "Организовать тренинги по управлению стрессом и тайм-менеджменту"
        )

    recommendations.append(
        "Внедрить программу поддержки психологического здоровья сотрудников"
    )

    return recommendations[:5]


def generate_recommendations_groq(team_stats):
    """
    Альтернативная функция через Yandex GPT вместо Groq.
    Используется тот же функционал что и generate_manager_recommendations.
    """
    return generate_manager_recommendations(team_stats)
