from datetime import datetime
from typing import Optional, Dict, Any, List

from .db.db_models import EmployeeData

# Текущая дата по умолчанию (можно передать свою)
DEFAULT_CURRENT_DATE = datetime.utcnow()

# Нормализация метрик (оставляем прежние коэффициенты)
def normalize_type(burnout_type: Optional[str]) -> float:
    # НЕ мапим ничего дополнительно: ожидаем, что burnout_type уже в виде 'G','S','A','B' или None.
    mapping = {'G': 0, 'S': 0.3, 'A': 0.7, 'B': 1}
    if burnout_type is None:
        return 0
    return mapping.get(burnout_type.strip().upper(), 0)

def normalize_vacation_days(days: Optional[int]) -> float:
    return min(days / 365, 1) if days is not None else 1

def normalize_tenure(tenure_months: Optional[int]) -> float:
    return min(tenure_months / 120, 1) if tenure_months is not None else 0

def normalize_position(position: Optional[str]) -> float:
    if not position:
        return 0.2
    p = position.lower()
    return 0.5 if ('руководитель' in p or 'началь' in p) else 0.2

def normalize_training(training: Optional[str]) -> float:
    if not training:
        return 0.6
    mapping = {'завершена': 0, 'в процессе': 0.3, 'нет': 0.6, 'не прошел': 0.6, 'не прошла': 0.6}
    return mapping.get(training.lower(), 0.6)

# Парсинг стажа из строки вроде '5 лет 4 месяца' (если tenure хранится в таком же формате)
def parse_tenure(tenure_str: Optional[str]) -> int:
    if not isinstance(tenure_str, str):
        return 0
    months = 0
    parts = tenure_str.split()
    for i, part in enumerate(parts):
        if part.isdigit():
            if i + 1 < len(parts):
                nxt = parts[i + 1].lower()
                if 'лет' in nxt or 'год' in nxt:
                    months += int(part) * 12
                elif 'месяц' in nxt:
                    months += int(part)
    return months

# Основная формула: принимает burnout_type как строку из БД (не пытаемся мапить по score)
def calculate_burnout_score_from_employee(
    emp: EmployeeData,
    burnout_type: Optional[str],
    current_date: datetime = DEFAULT_CURRENT_DATE
) -> float:
    type_score = normalize_type(burnout_type)

    # last_vacation уже хранится как datetime в БД (или None)
    last_vac_dt = emp.last_vacation  # type: Optional[datetime]
    vacation_days = None
    if isinstance(last_vac_dt, datetime):
        vacation_days = (current_date - last_vac_dt).days
    vacation_norm = normalize_vacation_days(vacation_days)

    tenure_months = parse_tenure(emp.tenure)
    tenure_norm = normalize_tenure(tenure_months)

    # position/subordinates: используем поля EmployeeData.position и subordinates
    position_str = emp.position or emp.subordinates or ''
    position_norm = normalize_position(position_str)

    training_norm = normalize_training(emp.training)

    interaction = tenure_norm * position_norm * 0.5
    vacation_contrib = vacation_norm * 0.3
    training_penalty = 0.2 if training_norm > 0.3 else 0

    score = type_score + interaction + vacation_contrib + training_penalty
    return min(score, 1.0)
