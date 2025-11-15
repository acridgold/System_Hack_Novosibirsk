// Вопросы для оценки выгорания (на основе шкалы Маслач)
export const ASSESSMENT_QUESTIONS = [
    {
        // BE
        id: 0,
        text: 'Оцените Ваше стремление к профессиональным достижениям',
        category: 'professional_activity',
        component: 'ProfessionalGoalsQuestion'
    },
    {
        // BA
        id: 1,
        text: 'Оцените Ваш баланс между работой и жизнью',
        subtitle: 'Для этого перемещайте чаши весов',
        category: 'professional_activity',
        component: 'WorkLifeBalanceQuestion'
    },
    {
        //PS
        id: 2,
        text: 'Стремитесь ли Вы к совершенству?',
        subtitle: 'Покажите, каким результатом работы вы были бы довольны',
        category: 'professional_activity',
        component: 'PerfectWorkQuestion'
    },
    {
        //DF
        id: 3,
        text: 'Умеете ли Вы отдыхать после работы?',
        subtitle: 'Переместите аватара чтобы отметить ваше состояние',
        category: 'professional_activity',
        component: 'RelaxAbilityQuestion'
    },
    {
        //VB
        id: 4,
        text: 'Сколько времени и сил Вы посвещаете работе?',
        subtitle: '',
        category: 'professional_activity',
    },
    {
        //RT
        id: 5,
        text: 'Оцените свое умения справляться с неудачами',
        subtitle: '',
        category: 'mental_stability',
    },
    {
        //OP
        id: 6,
        text: 'Как вы реагируете на проблемы на работе?',
        subtitle: '',
        category: 'mental_stability',
    },
    {
        //IR
        id: 7,
        text: 'Умеете ли вы сохранять спокойствие в стрессовых ситуациях?',
        subtitle: '',
        category: 'mental_stability',
    },
    {
        //EE
        id: 8,
        text: 'Оцените свои профессиональные достижения',
        subtitle: '',
        category: 'emotional_attitude',
    },
    {
        //LZ
        id: 9,
        text: 'Насколько вы в целом довольны своей жизнью?',
        subtitle: '',
        category: 'emotional_attitude',
    },
    {
        //SU
        id: 10,
        text: 'Ощущаете ли вы поддержку от близких людей?',
        subtitle: '',
        category: 'emotional_attitude',
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
