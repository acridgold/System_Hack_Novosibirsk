// Вопросы для оценки выгорания (на основе шкалы Маслач)
export const ASSESSMENT_QUESTIONS = [
    {
        id: 0,
        text: 'Оцените Ваше стремление к профессиональным достижениям',
        category: 'emotional_exhaustion',
        component: 'ProfessionalGoalsQuestion'
    },
    {
        id: 1,
        text: 'Оцените Ваш баланс между работой и жизнью',
        subtitle: 'Для этого перемещайте чаши весов',
        category: 'depersonalization',
        component: 'WorkLifeBalanceQuestion'
    },
    {
        id: 2,
        text: 'Ощущаете ли вы снижение личной продуктивности?',
        subtitle: 'Чувствуете ли вы, что работаете менее эффективно?',
        category: 'reduced_accomplishment',
    },
    {
        id: 3,
        text: 'Как часто вы чувствуете усталость в начале рабочего дня?',
        subtitle: 'Даже после отдыха вы чувствуете себя уставшим?',
        category: 'emotional_exhaustion',
    },
    {
        id: 4,
        text: 'Влияет ли работа на вашу личную жизнь и отношения?',
        subtitle: 'Чувствуете ли вы напряжение дома из-за работы?',
        category: 'work_life_balance',
    },
    {
        id: 5,
        text: 'Как часто вы избегаете общения с коллегами или клиентами?',
        subtitle: 'Предпочитаете ли вы работать в одиночку?',
        category: 'depersonalization',
    },
    {
        id: 6,
        text: 'Испытываете ли вы чувство вины за нежелание работать?',
        subtitle: 'Чувствуете ли вы себя виноватым за отсутствие мотивации?',
        category: 'emotional_exhaustion',
    },
    {
        id: 7,
        text: 'Насколько удовлетворены вы своими профессиональными достижениями?',
        subtitle: 'Чувствуете ли вы гордость за свою работу?',
        category: 'reduced_accomplishment',
    },
    {
        id: 8,
        text: 'Как часто вы испытываете раздражительность или гнев на работе?',
        subtitle: 'Замечаете ли вы повышенную эмоциональность?',
        category: 'emotional_exhaustion',
    },
    {
        id: 9,
        text: 'Ощущаете ли вы потерю интереса к профессиональному развитию?',
        subtitle: 'Хотите ли вы учиться новому в вашей сфере?',
        category: 'reduced_accomplishment',
    },
    {
        id: 10,
        text: 'Как часто вы чувствуете себя перегруженным рабочими задачами?',
        subtitle: 'Успеваете ли вы справляться с объемом работы?',
        category: 'work_overload',
    },
    {
        id: 11,
        text: 'Насколько сложно вам сконцентрироваться на работе?',
        subtitle: 'Отвлекаетесь ли вы часто во время работы?',
        category: 'reduced_accomplishment',
    },
    {
        id: 12,
        text: 'Как часто вы думаете о смене работы или профессии?',
        subtitle: 'Рассматриваете ли вы альтернативные варианты?',
        category: 'depersonalization',
    },
    {
        id: 13,
        text: 'Испытываете ли вы физические симптомы стресса?',
        subtitle: 'Головные боли, проблемы со сном, напряжение в теле?',
        category: 'physical_symptoms',
    },
    {
        id: 14,
        text: 'Как часто вы берете больничные или отгулы из-за усталости?',
        subtitle: 'Нуждаетесь ли вы в частых перерывах?',
        category: 'emotional_exhaustion',
    },
    {
        id: 15,
        text: 'Ощущаете ли вы поддержку со стороны руководства?',
        subtitle: 'Чувствуете ли вы, что вас ценят на работе?',
        category: 'organizational_support',
    },
    {
        id: 16,
        text: 'Насколько сбалансирован ваш рабочий график?',
        subtitle: 'Работаете ли вы сверхурочно регулярно?',
        category: 'work_life_balance',
    },
    {
        id: 17,
        text: 'Как часто вы чувствуете себя недооцененным на работе?',
        subtitle: 'Признают ли ваши усилия и достижения?',
        category: 'reduced_accomplishment',
    },
    {
        id: 18,
        text: 'Испытываете ли вы тревогу по поводу будущего на работе?',
        subtitle: 'Беспокоитесь ли вы о стабильности или карьере?',
        category: 'emotional_exhaustion',
    },
    {
        id: 19,
        text: 'Насколько эффективно вы восстанавливаетесь после работы?',
        subtitle: 'Чувствуете ли вы себя отдохнувшим после выходных?',
        category: 'recovery',
    },
];

// Уровни выгорания
export const BURNOUT_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
};

// Метки уровней
export const BURNOUT_LEVEL_LABELS = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
};

// Описания уровней
export const BURNOUT_LEVEL_DESCRIPTIONS = {
    low: 'Отличное состояние! Вы хорошо справляетесь с рабочей нагрузкой.',
    medium: 'Будьте внимательны. Появляются признаки профессионального выгорания.',
    high: 'Требуется немедленное внимание! Высокий уровень выгорания.',
};

// Эндпоинты API
export const API_ENDPOINTS = {
    LOGIN: '/auth/token',
    VERIFY: '/auth/verify',
    ME: '/auth/me',
    ASSESSMENT_SUBMIT: '/assessment/submit',
    ASSESSMENT_HISTORY: '/assessment/history',
    DASHBOARD_METRICS: '/dashboard/metrics',
    RECOMMENDATIONS: '/recommendations',
    RECOMMENDATIONS_COMPLETE: (id) => `/recommendations/${id}`,
};

// Категории рекомендаций
export const RECOMMENDATION_CATEGORIES = {
    MEDITATION: 'meditation',
    TIME_MANAGEMENT: 'time_management',
    EXERCISE: 'exercise',
    LEARNING: 'learning',
    REST: 'rest',
    SOCIAL: 'social',
};

// Приоритеты рекомендаций
export const RECOMMENDATION_PRIORITIES = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
};
