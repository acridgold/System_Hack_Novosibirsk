// ===== ТЕСТОВЫЙ ПОЛЬЗОВАТЕЛЬ =====
export const MOCK_USER = {
    id: 1,
    email: 'user@example.com',
    name: 'Иван Петров',
    position: 'Старший курьер',
    department: 'Отдел доставки',
    joinDate: '2023-01-15',
    daysInSystem: 680,
    completedRecommendations: 12,
    avatar: null,
};

// ===== ИСТОРИЯ ДИАГНОСТИК =====
export const MOCK_ASSESSMENT_HISTORY = [
    {
        id: 1,
        date: '2025-11-11',
        timestamp: '2025-11-11T10:30:00Z',
        burnoutLevel: 'medium',
        score: 62,
        emotionalExhaustion: 28,
        depersonalization: 16,
        reducedAccomplishment: 18,
        answers: {
            0: 3, 1: 4, 2: 3, 3: 4, 4: 2, 5: 3, 6: 4, 7: 3, 8: 4, 9: 3,
            10: 2, 11: 3, 12: 4, 13: 3, 14: 2, 15: 3, 16: 4, 17: 3, 18: 2, 19: 3,
        },
    },
    {
        id: 2,
        date: '2025-11-04',
        timestamp: '2025-11-04T14:20:00Z',
        burnoutLevel: 'high',
        score: 78,
        emotionalExhaustion: 35,
        depersonalization: 20,
        reducedAccomplishment: 23,
        answers: {
            0: 4, 1: 5, 2: 4, 3: 5, 4: 3, 5: 4, 6: 5, 7: 4, 8: 5, 9: 4,
            10: 3, 11: 4, 12: 5, 13: 4, 14: 3, 15: 4, 16: 5, 17: 4, 18: 3, 19: 4,
        },
    },
    {
        id: 3,
        date: '2025-10-28',
        timestamp: '2025-10-28T09:15:00Z',
        burnoutLevel: 'high',
        score: 82,
        emotionalExhaustion: 37,
        depersonalization: 22,
        reducedAccomplishment: 23,
        answers: {
            0: 5, 1: 5, 2: 4, 3: 5, 4: 4, 5: 5, 6: 5, 7: 4, 8: 5, 9: 4,
            10: 4, 11: 4, 12: 5, 13: 4, 14: 4, 15: 4, 16: 5, 17: 4, 18: 4, 19: 4,
        },
    },
    {
        id: 4,
        date: '2025-10-21',
        timestamp: '2025-10-21T11:45:00Z',
        burnoutLevel: 'medium',
        score: 65,
        emotionalExhaustion: 29,
        depersonalization: 17,
        reducedAccomplishment: 19,
        answers: {
            0: 3, 1: 4, 2: 3, 3: 4, 4: 3, 5: 3, 6: 4, 7: 3, 8: 4, 9: 3,
            10: 3, 11: 3, 12: 4, 13: 3, 14: 3, 15: 3, 16: 4, 17: 3, 18: 3, 19: 3,
        },
    },
    {
        id: 5,
        date: '2025-10-14',
        timestamp: '2025-10-14T16:00:00Z',
        burnoutLevel: 'low',
        score: 45,
        emotionalExhaustion: 20,
        depersonalization: 11,
        reducedAccomplishment: 14,
        answers: {
            0: 2, 1: 3, 2: 2, 3: 3, 4: 2, 5: 2, 6: 3, 7: 2, 8: 3, 9: 2,
            10: 2, 11: 2, 12: 3, 13: 2, 14: 2, 15: 2, 16: 3, 17: 2, 18: 2, 19: 2,
        },
    },
];

// ===== МЕТРИКИ ДЛЯ ДАШБОРДА (ПОСЛЕДНИЕ 7 ДНЕЙ) =====
export const MOCK_DASHBOARD_METRICS = [
    { date: 'Пн', burnout: 82, stress: 85, productivity: 18 },
    { date: 'Вт', burnout: 78, stress: 80, productivity: 22 },
    { date: 'Ср', burnout: 75, stress: 78, productivity: 25 },
    { date: 'Чт', burnout: 70, stress: 72, productivity: 30 },
    { date: 'Пт', burnout: 65, stress: 68, productivity: 35 },
    { date: 'Сб', burnout: 62, stress: 65, productivity: 38 },
    { date: 'Вс', burnout: 62, stress: 63, productivity: 38 },
];

// ===== РЕКОМЕНДАЦИИ =====
export const MOCK_RECOMMENDATIONS = [
    {
        id: 1,
        category: 'Медитация',
        title: 'Практикуйте осознанность',
        description: 'Уделяйте 10 минут в день медитации или дыхательным упражнениям для снижения стресса',
        priority: 'high',
        duration: '10 мин/день',
        completed: true,
    },
    {
        id: 2,
        category: 'Тайм-менеджмент',
        title: 'Используйте технику Pomodoro',
        description: 'Работайте 25 минут, затем делайте 5-минутный перерыв для повышения концентрации',
        priority: 'high',
        duration: '30 мин циклы',
        completed: true,
    },
    {
        id: 3,
        category: 'Физическая активность',
        title: 'Регулярные упражнения',
        description: 'Занимайтесь физической активностью минимум 3 раза в неделю по 30 минут',
        priority: 'medium',
        duration: '3 раза/неделю',
        completed: false,
    },
    {
        id: 4,
        category: 'Сон',
        title: 'Соблюдайте режим сна',
        description: 'Ложитесь спать и просыпайтесь в одно и то же время, спите 7-8 часов',
        priority: 'high',
        duration: 'Ежедневно',
        completed: true,
    },
    {
        id: 5,
        category: 'Питание',
        title: 'Сбалансированное питание',
        description: 'Включайте в рацион больше овощей, фруктов, избегайте переработанных продуктов',
        priority: 'medium',
        duration: 'Постоянно',
        completed: false,
    },
    {
        id: 6,
        category: 'Социальные связи',
        title: 'Общайтесь с близкими',
        description: 'Проводите время с семьей и друзьями, делитесь переживаниями',
        priority: 'high',
        duration: '2-3 раза/неделю',
        completed: false,
    },
];
