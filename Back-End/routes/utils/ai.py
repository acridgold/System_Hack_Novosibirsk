"""
Модуль для работы с AI (OpenAI GPT и Groq)
"""
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Инициализация клиента OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def generate_manager_recommendations(team_stats):
    """
    Генерация рекомендаций для менеджера на основе статистики команды

    Args:
        team_stats (dict): Статистика команды
            {
                'critical': int,
                'warning': int,
                'good': int,
                'total': int,
                'avg_burnout': float,
                'trends': dict
            }

    Returns:
        list: Список рекомендаций
    """
    try:
        # Формируем промпт для GPT
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

        messages = [
            {"role": "system", "content": "Ты - эксперт по HR и профилактике выгорания."},
            {"role": "user", "content": prompt}
        ]

        response = client.chat.completions.create(
            model="gpt-3.5",  # Можно использовать gpt-3.5-turbo для экономии
            messages=messages,  # type: ignore
            max_tokens=500,
            temperature=0.7,
        )

        # Парсим ответ
        recommendations_text = response.choices[0].message.content.strip()
        recommendations = [r.strip() for r in recommendations_text.split('\n') if r.strip()]

        return recommendations[:5]  # Ограничиваем до 5 рекомендаций

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
            "Организовать ��ренинги по управлению стрессом и тайм-менеджменту"
        )

    recommendations.append(
        "Внедрить программу поддержки психологического здоровья сотрудников"
    )

    return recommendations[:5]


def generate_recommendations_groq(team_stats):
    """
    Генерация через Groq (бесплатный альтернатива OpenAI)
    """
    try:
        # Импортируем Groq локально, чтобы статический анализатор не ругался, если пакет не установлен
        try:
            from groq import Groq  # type: ignore
        except Exception:
            raise RuntimeError('Пакет "groq" не установлен. Установите его через pip install groq или обновите Back-end/requirements.txt')

        groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

        prompt = f"""
Статистика команды:
- Критическое состояние: {team_stats['critical']} чел.
- Требует внимания: {team_stats['warning']} чел.
- В норме: {team_stats['good']} чел.
- Средний уровень выгорания: {team_stats['avg_burnout']}%

Предложи 4-5 конкретных действий для менеджера курьерской службы.
"""

        messages = [
            {"role": "system", "content": "Ты HR-эксперт."},
            {"role": "user", "content": prompt}
        ]

        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",  # Бесплатная модель
            messages=messages,  # type: ignore
            max_tokens=400,
            temperature=0.7,
        )

        recommendations_text = response.choices[0].message.content.strip()
        recommendations = [r.strip() for r in recommendations_text.split('\n') if r.strip()]

        return recommendations[:5]

    except Exception as e:
        print(f"Ошибка Groq API: {e}")
        return get_fallback_recommendations(team_stats)

