"""
Модуль для выбора рекомендаций на основе метрик выгорания
"""
import requests
import os
import json
from ..data.logger import ai_logger

RECOMMENDATIONS_DB = [
    {
        'id': 1,
        'category': 'Медитация',
        'title': 'Практикуйте осознанность',
        'description': 'Уделяйте 10 минут в день медитации или дыхательным упражнениям для снижения стресса',
    },
    {
        'id': 2,
        'category': 'Тайм-менеджмент',
        'title': 'Используйте технику Pomodoro',
        'description': 'Работайте 25 минут, затем делайте 5-минутный перерыв для повышения концентрации',
    },
    {
        'id': 3,
        'category': 'Физическая активность',
        'title': 'Регулярные упражнения',
        'description': 'Занимайтесь физической активностью минимум 3 раза в неделю по 30 минут',
    },
    {
        'id': 4,
        'category': 'Сон',
        'title': 'Соблюдайте режим сна',
        'description': 'Ложитесь спать и просыпайтесь в одно и то же время, спите 7-8 часов',
    },
    {
        'id': 5,
        'category': 'Питание',
        'title': 'Сбалансированное питание',
        'description': 'Включайте в рацион больше овощей, фруктов, избегайте переработанных продуктов',
    },
    {
        'id': 6,
        'category': 'Социальные связи',
        'title': 'Общайтесь с близкими',
        'description': 'Проводите время с семьей и друзьями, делитесь переживаниями',
    },
    {
        'id': 7,
        'category': 'Благодарность',
        'title': 'Ведите дневник благодарности',
        'description': 'Каждый вечер записывайте три вещи, за которые вы благодарны — повышает уровень счастья и снижает депрессию',
    },
    {
        'id': 8,
        'category': 'Природа',
        'title': 'Проводите время на свежем воздухе',
        'description': 'Минимум 120 минут в неделю в парке или лесу снижают стресс и улучшают настроение',
    },
    {
        'id': 9,
        'category': 'Чтение',
        'title': 'Читайте художественную литературу',
        'description': '30 минут чтения в день развивают эмпатию и защищают от когнитивного старения',
    },
    {
        'id': 10,
        'category': 'Ведение дневника',
        'title': 'Практикуйте экспрессивное письмо',
        'description': '15 минут записи эмоций снижают тревогу и улучшают психическое здоровье',
    },
    {
        'id': 11,
        'category': 'Саморазвитие',
        'title': 'Учитесь новому еженедельно',
        'description': 'Освоение навыков (язык, хобби) повышает удовлетворённость жизнью',
    },
    {
        'id': 12,
        'category': 'Волонтерство',
        'title': 'Помогайте другим',
        'description': 'Волонтёрство раз в месяц усиливает чувство цели и снижает депрессию',
    },
    {
        'id': 13,
        'category': 'Дыхание',
        'title': 'Практикуйте диафрагмальное дыхание',
        'description': '3–5 минут глубокого дыхания снижают уровень кортизола',
    },
    {
        'id': 14,
        'category': 'Гидратация',
        'title': 'Пейте достаточно воды',
        'description': '2–3 литра воды в день улучшают когнитивные функции и настроение',
    },
    {
        'id': 15,
        'category': 'Смех',
        'title': 'Смейтесь чаще',
        'description': 'Просмотр комедий или общение с юмористами снижает стресс и укрепляет иммунитет',
    },
    {
        'id': 16,
        'category': 'Музыка',
        'title': 'Слушайте любимую музыку',
        'description': '30 минут музыки в день снижают тревогу и повышают дофамин',
    },
    {
        'id': 17,
        'category': 'Танцы',
        'title': 'Танцуйте под музыку',
        'description': 'Танцы 2–3 раза в неделю улучшают настроение и координацию',
    },
    {
        'id': 18,
        'category': 'Игры',
        'title': 'Играйте в настольные игры',
        'description': 'Социальные игры с друзьями усиливают когнитивный резерв и радость',
    },
    {
        'id': 19,
        'category': 'Хобби',
        'title': 'Занимайтесь творчеством',
        'description': 'Рисование, вязание, лепка — снижают стресс и улучшают самооценку',
    },
    {
        'id': 20,
        'category': 'Цифровой детокс',
        'title': 'Ограничьте экранное время',
        'description': 'Не более 2 часов соцсетей в день — улучшает сон и концентрацию',
    },
    {
        'id': 25,
        'category': 'Йога',
        'title': 'Практикуйте йогу',
        'description': 'Йога 2–3 раза в неделю снижает тревогу и улучшает гибкость',
    },
    {
        'id': 32,
        'category': 'Кофеин',
        'title': 'Ограничьте кофеин после 14:00',
        'description': 'Поздний кофеин нарушает глубокий сон',
    },
    {
        'id': 35,
        'category': 'Зелёный чай',
        'title': 'Пейте зелёный чай',
        'description': 'L-теанин + кофеин = спокойная концентрация',
    },
    {
        'id': 37,
        'category': 'Сауна',
        'title': 'Посещайте сауну',
        'description': '2–3 раза в неделю снижают риск деменции на 65%',
    },
    {
        'id': 39,
        'category': 'Ароматерапия',
        'title': 'Используйте лаванду',
        'description': 'Аромат лаванды перед сном улучшает качество сна',
    },
    {
        'id': 43,
        'category': 'Медитация любящей доброты',
        'title': 'Практикуйте метту',
        'description': 'Желание добра себе и другим повышает эмпатию',
    },
    {
        'id': 44,
        'category': 'Цели',
        'title': 'Ставьте SMART-цели',
        'description': 'Чёткие цели повышают мотивацию и успех',
    },
    {
        'id': 46,
        'category': 'Самосострадание',
        'title': 'Практикуйте самосострадание',
        'description': 'Доброта к себе при неудачах снижает тревогу',
    },
    {
        'id': 47,
        'category': 'Границы',
        'title': 'Учитесь говорить "нет"',
        'description': 'Здоровые границы снижают выгорание',
    },
    {
        'id': 54,
        'category': 'Темнота',
        'title': 'Спите в полной темноте',
        'description': 'Блокировка света улучшает мелатонин и сон',
    },
    {
        'id': 56,
        'category': 'Лесные ванны',
        'title': 'Практикуйте шинрин-ёку',
        'description': 'Прогулки в лесу снижают кортизол на 16%',
    },
    {
        'id': 59,
        'category': 'Минимализм',
        'title': 'Уберите лишнее',
        'description': 'Меньше вещей = больше спокойствия',
    },
    {
        'id': 61,
        'category': 'Добрые дела',
        'title': 'Совершайте акты доброты',
        'description': '5 добрых дел в неделю повышают благополучие',
    },
    {
        'id': 68,
        'category': 'Книги по привычкам',
        'title': 'Читайте "Атомные привычки"',
        'description': 'Маленькие изменения = большие результаты',
    },
    {
        'id': 70,
        'category': 'Подкасты',
        'title': 'Слушайте подкасты по саморазвитию',
        'description': '15 минут в день = новые идеи',
    },
    {
        'id': 72,
        'category': 'Дыхание 4-7-8',
        'title': 'Дышите по методу 4-7-8',
        'description': '4 вдох — 7 задержка — 8 выдох = быстрое успокоение',
    },
    {
        'id': 77,
        'category': 'Объятия',
        'title': 'Обнимайтесь 20 секунд',
        'description': 'Долгие объятия высвобождают окситоцин',
    },
    {
        'id': 79,
        'category': 'Слушание',
        'title': 'Практикуйте активное слушание',
        'description': 'Полное внимание собеседнику укрепляет связи',
    },
    {
        'id': 81,
        'category': 'Фокус',
        'title': 'Практикуйте одно задание за раз',
        'description': 'Монотаскинг повышает эффективность на 40%',
    },
    {
        'id': 85,
        'category': 'Тайм-блокинг',
        'title': 'Планируйте день блоками',
        'description': 'Чёткие временные рамки повышают продуктивность',
    },
    {
        'id': 88,
        'category': 'Правило 80/20',
        'title': 'Фокусируйтесь на 20% задач',
        'description': '20% усилий дают 80% результата',
    },
    {
        'id': 91,
        'category': 'Эпикур',
        'title': 'Практикуйте умеренные удовольствия',
        'description': 'Простые радости — основа счастья',
    },
]


def get_ai_recommendations(burnout_level: str, emotional_exhaustion: float,
                          depersonalization: float, reduced_accomplishment: float,
                          employee_burnout_score: float = None) -> list:
    """Получить рекомендации от AI на основе метрик выгорания"""
    try:
        final_burnout_score = employee_burnout_score if employee_burnout_score else emotional_exhaustion

        prompt = f"""На основе следующих метрик выгорания сотрудника:
- Уровень выгорания: {burnout_level}
- Профессиональная активность: {emotional_exhaustion:.2f}/1.0
- Психическая стабильность: {depersonalization:.2f}/1.0
- Эмоциональное отношение: {reduced_accomplishment:.2f}/1.0
- Итоговый балл выгорания: {final_burnout_score:.2f}/1.0

Выбери 5-7 наиболее подходящих рекомендаций из следующего списка:

{_format_recommendations_for_prompt()}

Верни ТОЛЬКО список в таком формате (без других текстов):
1. Название рекомендации
2. Название рекомендации
3. Название рекомендации
и т.д.

Не добавляй описания, номера ID или категории. Только названия рекомендаций."""

        ai_logger.info(f"Отправляю запрос на выбор рекомендаций для уровня {burnout_level}. Итоговый балл: {final_burnout_score}")

        reply = _call_ai_chat(prompt)

        if not reply:
            ai_logger.warning("AI вернула пустой ответ, используем рекомендации по умолчанию")
            return _get_default_recommendations(burnout_level)

        recommendations = _parse_ai_response(reply)

        if not recommendations:
            ai_logger.warning("Не удалось распарсить ответ AI, используем рекомендации по умолчанию")
            return _get_default_recommendations(burnout_level)

        ai_logger.info(f"Успешно получены {len(recommendations)} рекомендаций от AI")
        return recommendations

    except Exception as e:
        ai_logger.error(f"Ошибка при получении рекомендаций от AI: {e}", exc_info=True)
        return _get_default_recommendations(burnout_level)


def _format_recommendations_for_prompt() -> str:
    """Форматирует список рекомендаций для промпта"""
    formatted = ""
    for rec in RECOMMENDATIONS_DB:
        formatted += f"- {rec['title']} (категория: {rec['category']})\n"
    return formatted


def _call_ai_chat(message: str) -> str:
    """Вызывает AI chat endpoint и возвращает ответ"""
    try:
        ai_endpoint = os.environ.get('AI_CHAT_ENDPOINT', 'http://localhost:5000/ai/chat')
        payload = {'message': message}

        ai_logger.info(f"Calling AI endpoint: {ai_endpoint}")

        response = requests.post(
            ai_endpoint,
            json=payload,
            timeout=60
        )

        if response.status_code == 200:
            data = response.json()
            reply = data.get('reply', '')
            ai_logger.info("Successfully got response from AI")
            return reply
        else:
            ai_logger.warning(f"AI endpoint returned status {response.status_code}")
            return ""

    except Exception as e:
        ai_logger.error(f"Error calling AI chat: {e}", exc_info=True)
        return ""


def _parse_ai_response(response: str) -> list:
    """Парсит ответ от AI в формате списка рекомендаций"""
    try:
        recommendations = []
        lines = response.strip().split('\n')

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if line[0].isdigit() and '.' in line[:3]:
                line = line.split('.', 1)[1].strip()

            if line:
                matched_rec = None
                for rec in RECOMMENDATIONS_DB:
                    if rec['title'].lower() in line.lower() or line.lower() in rec['title'].lower():
                        matched_rec = rec
                        break

                if matched_rec:
                    recommendations.append({
                        'category': matched_rec['category'],
                        'title': matched_rec['title'],
                        'description': matched_rec['description'],
                        'priority': _get_priority(matched_rec['title']),
                        'duration': _get_duration(matched_rec['category']),
                    })

        return recommendations

    except Exception as e:
        ai_logger.error(f"Error parsing AI response: {e}", exc_info=True)
        return []


def _get_priority(title: str) -> str:
    """Определяет приоритет рекомендации на основе её названия"""
    high_priority_keywords = ['истощ', 'сон', 'стресс', 'депресс', 'дыхание', 'медитация']
    medium_priority_keywords = ['активность', 'физи', 'упраж', 'хобби', 'творч']

    title_lower = title.lower()

    for keyword in high_priority_keywords:
        if keyword in title_lower:
            return 'high'

    for keyword in medium_priority_keywords:
        if keyword in title_lower:
            return 'medium'

    return 'low'


def _get_duration(category: str) -> str:
    """Определяет длительность рекомендации на основе категории"""
    durations = {
        'Медитация': '10 минут в день',
        'Тайм-менеджмент': '25 минут на сеанс',
        'Физическая активность': '30 минут 3 раза в неделю',
        'Сон': 'Ежедневно',
        'Питание': 'Ежедневно',
        'Социальные связи': 'По мере возможности',
        'Йога': '30-60 минут 2-3 раза в неделю',
        'Дыхание': '5-10 минут в день',
    }

    return durations.get(category, 'По расписанию')


def _get_default_recommendations(burnout_level: str) -> list:
    """Возвращает рекомендации по умолчанию на основе уровня выгорания"""
    defaults = {
        'high': [
            RECOMMENDATIONS_DB[0],
            RECOMMENDATIONS_DB[1],
            RECOMMENDATIONS_DB[3],
            RECOMMENDATIONS_DB[7],
            RECOMMENDATIONS_DB[12],
            RECOMMENDATIONS_DB[34],
            RECOMMENDATIONS_DB[37],
        ],
        'medium': [
            RECOMMENDATIONS_DB[0],
            RECOMMENDATIONS_DB[2],
            RECOMMENDATIONS_DB[4],
            RECOMMENDATIONS_DB[8],
            RECOMMENDATIONS_DB[15],
            RECOMMENDATIONS_DB[19],
        ],
        'low': [
            RECOMMENDATIONS_DB[5],
            RECOMMENDATIONS_DB[6],
            RECOMMENDATIONS_DB[10],
            RECOMMENDATIONS_DB[11],
            RECOMMENDATIONS_DB[17],
        ],
    }

    result = defaults.get(burnout_level, defaults['medium'])

    for rec in result:
        rec['priority'] = _get_priority(rec['title'])
        rec['duration'] = _get_duration(rec['category'])

    return result
