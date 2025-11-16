import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { MOCK_ASSESSMENT_HISTORY } from '../../utils/mockUser';

// Отправка диагностики
export const submitAssessment = createAsyncThunk(
    'assessment/submit',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().user;
            const { answers } = getState().assessment;

            if (Object.keys(answers).length === 0) {
                throw new Error('Нет ответов для отправки');
            }

            const payload = {
                answers,
                timestamp: new Date().toISOString(),
            };

            // ===== MOCK ПОЛЬЗОВАТЕЛЬ =====
            // if (user?.email === 'user@example.com') {
            //     // Имитируем задержку
            //     await new Promise((resolve) => setTimeout(resolve, 500));
            //
            //     const results = calculateResults(answers);
            //     return {
            //         ...results,
            //         timestamp: payload.timestamp,
            //         date: payload.timestamp.split('T')[0],
            //     };
            // }

            // ===== РЕАЛЬНЫЕ ПОЛЬЗОВАТЕЛИ =====
            const token = localStorage.getItem('token');
            // Если есть токен — пробуем отправить на backend (иногда user еще не загружен, но токен есть)
            if (token) {
                console.info('submitAssessment: sending to backend', { user, payload, tokenExists: !!token });
                try {
                    // Backend автоматически берет user_id из JWT
                    const data = await api.post('/assessment/submit', payload);
                    console.info('submitAssessment: backend response', data);

                    // Добавляем date если Backend не вернул
                    if (data.timestamp && !data.date) {
                        data.date = data.timestamp.split('T')[0];
                    }

                    return data;
                } catch (err) {
                    console.error('submitAssessment: error sending to backend', err);
                    // В случае ошибки при отправке — откатываемся к локальному результату
                    const results = calculateResults(answers);
                    return {
                        local: true,
                        ...results,
                        timestamp: payload.timestamp,
                        date: payload.timestamp.split('T')[0],
                        _error: err.message,
                    };
                }
            } else {
                // Не авторизован - локальные результаты
                const results = calculateResults(answers);
                return {
                    local: true,
                    ...results,
                    timestamp: payload.timestamp,
                    date: payload.timestamp.split('T')[0],
                };
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Получение истории диагностик
export const fetchAssessmentHistory = createAsyncThunk(
    'assessment/fetchHistory',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().user;

            // ===== MOCK ИСТОРИЯ ДЛЯ ТЕСТОВОГО ПОЛЬЗОВАТЕЛЯ =====
            if (user?.email === 'user@example.com') {
                await new Promise((resolve) => setTimeout(resolve, 300));
                return MOCK_ASSESSMENT_HISTORY;
            }

            // ===== РЕАЛЬНАЯ ЗАГРУЗКА =====
            const data = await api.get('/assessment/history');

            // Backend возвращает { assessments: [...], total: N }
            const assessments = data.assessments || [];

            // Добавляем date для каждой диагностики если нет
            return assessments.map(item => {
                if (item.timestamp && !item.date) {
                    item.date = item.timestamp.split('T')[0];
                }
                return item;
            });
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Загрузка последней диагностики с backend
export const fetchLatestAssessment = createAsyncThunk(
    'assessment/fetchLatest',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().user;

            // ===== MOCK ДАННЫЕ =====
            // if (user?.email === 'user@example.com') {
            //     await new Promise((resolve) => setTimeout(resolve, 300));
            //     const latest = MOCK_ASSESSMENT_HISTORY[0];
            //
            //     // Добавляем date если нет
            //     if (latest.timestamp && !latest.date) {
            //         latest.date = latest.timestamp.split('T')[0];
            //     }
            //
            //     return latest;
            // }

            // ===== РЕАЛЬНАЯ ЗАГРУЗКА =====
            const data = await api.get('/assessment/latest');

            // Добавляем date если Backend не вернул
            if (data.timestamp && !data.date) {
                data.date = data.timestamp.split('T')[0];
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ===== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ РАСЧЕТА РЕЗУЛЬТАТОВ =====
function calculateResults(answers) {
    const values = Object.values(answers).map(v => parseInt(v));

    if (values.length === 0) {
        return {
            burnoutLevel: 'low',
            score: 0,
            emotionalExhaustion: 0,
            depersonalization: 0,
            reducedAccomplishment: 0,
        };
    }

    // Рассчитываем средний балл (1-5)
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    // Определяем уровень выгорания
    let burnoutLevel = 'low';
    if (average >= 3.5) {
        burnoutLevel = 'high';
    } else if (average >= 2.5) {
        burnoutLevel = 'medium';
    }

    // Рассчитываем общий score (0-100)
    const score = Math.round((average / 5) * 100);

    // Примерное распределение компонентов выгорания
    const emotionalExhaustion = Math.round(score * 0.45);
    const depersonalization = Math.round(score * 0.25);
    const reducedAccomplishment = Math.round(score * 0.30);

    return {
        burnoutLevel,
        score,
        emotionalExhaustion,
        depersonalization,
        reducedAccomplishment,
    };
}

const assessmentSlice = createSlice({
    name: 'assessment',
    initialState: {
        // Локальные ответы (кэширование)
        answers: {},

        // Результаты (могут быть локальные или с backend)
        results: null,
        burnoutLevel: null,
        score: 0,
        emotionalExhaustion: 0,
        depersonalization: 0,
        reducedAccomplishment: 0,

        // История диагностик с backend
        history: [],

        // Статусы
        loading: false,
        synced: false,
        error: null,
    },
    reducers: {
        setAnswer: (state, action) => {
            const { questionId, value } = action.payload;
            state.answers[questionId] = value;
            state.synced = false;
        },

        clearAnswers: (state) => {
            state.answers = {};
            state.results = null;
            state.burnoutLevel = null;
            state.score = 0;
            state.synced = false;
        },

        // Обновление данных с backend
        updateAssessmentFromBackend: (state, action) => {
            const payload = action.payload;

            // Добавляем date если нет
            if (payload.timestamp && !payload.date) {
                payload.date = payload.timestamp.split('T')[0];
            }

            state.results = payload;
            state.burnoutLevel = payload.burnoutLevel;
            state.score = payload.score;
            state.emotionalExhaustion = payload.emotionalExhaustion;
            state.depersonalization = payload.depersonalization;
            state.reducedAccomplishment = payload.reducedAccomplishment;
            state.synced = true;
        },

        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // submitAssessment
            .addCase(submitAssessment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitAssessment.fulfilled, (state, action) => {
                const payload = action.payload;

                // Преобразуем timestamp в date если нужно
                if (payload.timestamp && !payload.date) {
                    payload.date = payload.timestamp.split('T')[0];
                }

                // ВАЖНО: Сохраняем все результаты в state
                state.results = payload;
                state.burnoutLevel = payload.burnoutLevel;
                state.score = payload.score || 0;
                state.emotionalExhaustion = payload.emotionalExhaustion || 0;
                state.depersonalization = payload.depersonalization || 0;
                state.reducedAccomplishment = payload.reducedAccomplishment || 0;
                state.loading = false;
                state.synced = payload.local ? false : true;
            })
            .addCase(submitAssessment.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // fetchAssessmentHistory
            .addCase(fetchAssessmentHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAssessmentHistory.fulfilled, (state, action) => {
                // Добавляем date для каждой диагностики если нет
                const assessments = action.payload.map(item => {
                    if (item.timestamp && !item.date) {
                        item.date = item.timestamp.split('T')[0];
                    }
                    return item;
                });

                state.history = assessments;

                // Автоматически устанавливаем последнюю диагностику как текущую
                if (assessments.length > 0) {
                    const latest = assessments[0];
                    state.burnoutLevel = latest.burnoutLevel;
                    state.score = latest.score;
                    state.emotionalExhaustion = latest.emotionalExhaustion;
                    state.depersonalization = latest.depersonalization;
                    state.reducedAccomplishment = latest.reducedAccomplishment;
                }

                state.loading = false;
            })
            .addCase(fetchAssessmentHistory.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // fetchLatestAssessment
            .addCase(fetchLatestAssessment.fulfilled, (state, action) => {
                const payload = action.payload;

                // Добавляем date если нет
                if (payload.timestamp && !payload.date) {
                    payload.date = payload.timestamp.split('T')[0];
                }

                state.results = payload;
                state.burnoutLevel = payload.burnoutLevel;
                state.score = payload.score;
                state.emotionalExhaustion = payload.emotionalExhaustion;
                state.depersonalization = payload.depersonalization;
                state.reducedAccomplishment = payload.reducedAccomplishment;
                state.synced = true;
            });
    },
});

export const { setAnswer, clearAnswers, updateAssessmentFromBackend, clearError } = assessmentSlice.actions;
export default assessmentSlice.reducer;
