"""
Модуль для генерации рекомендаций через Hugging Face Inference API
Копия логики из `ai.py`, но использует переменную окружения `HF_MODEL` и `HF_API_KEY`.
"""
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

HF_MODEL = os.getenv('HF_MODEL')
HF_API_KEY = os.getenv('HF_API_KEY')

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


def generate_recommendations_hf(team_stats):
    """
    Генерация рекомендаций через Hugging Face Inference API, модель берётся из HF_MODEL.

    Args:
        team_stats (dict): статистика команды (ключи: critical, warning, good, total, avg_burnout)

    Returns:
        list: до 5 рекомендаций (строк)
    """
    try:
        if not HF_MODEL or not HF_API_KEY:
            raise RuntimeError('HF_MODEL или HF_API_KEY не настроены в окружении')

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

        headers = {"Authorization": f"Bearer {HF_API_KEY}", "Content-Type": "application/json"}
        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": 400, "temperature": 0.7}
        }

        url = f"https://router.huggingface.co/hf-inference/models/{HF_MODEL}"
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        # Обработка различных форматов ответа от Hugging Face
        text = ""
        if isinstance(data, dict):
            # Некоторые модели возвращают {'error':...} или {'generated_text': '...'}
            if 'error' in data:
                raise RuntimeError(data['error'])
            text = data.get('generated_text') or data.get('text') or json.dumps(data)
        elif isinstance(data, list) and len(data) > 0:
            first = data[0]
            if isinstance(first, dict):
                text = first.get('generated_text') or first.get('text') or json.dumps(first)
            else:
                text = str(first)
        elif isinstance(data, str):
            text = data
        else:
            text = json.dumps(data)

        recommendations = [r.strip() for r in text.split('\n') if r.strip()]
        return recommendations[:5]

    except Exception as e:
        print(f"Ошибка HF inference: {e}")
        return get_fallback_recommendations(team_stats)


# Небольшой самотест при запуске файла напрямую
if __name__ == '__main__':
    sample = {'critical': 1, 'warning': 2, 'good': 7, 'total': 10, 'avg_burnout': 45}
    print('HF_MODEL:', HF_MODEL)
    print(generate_recommendations_hf(sample))

