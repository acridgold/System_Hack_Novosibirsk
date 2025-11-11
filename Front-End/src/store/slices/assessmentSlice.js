import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

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

            // Если пользователь авторизован, добавляем user_id
            if (user?.id) {
                payload.user_id = user.id;
                // Отправляем на backend
                const data = await api.post('/assessment/submit', payload);
                return data;
            } else {
                // Если не авторизован, рассчитываем результаты локально
                const results = calculateResults(answers);
                return {
                    local: true,
                    ...results,
                    timestamp: payload.timestamp,
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
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.get('/assessment/history');
            return data.assessments || [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Загрузка последней диагностики с backend
export const fetchLatestAssessment = createAsyncThunk(
    'assessment/fetchLatest',
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.get('/assessment/latest');
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
            state.results = action.payload;
            state.burnoutLevel = action.payload.burnoutLevel;
            state.score = action.payload.score;
            state.emotionalExhaustion = action.payload.emotionalExhaustion;
            state.depersonalization = action.payload.depersonalization;
            state.reducedAccomplishment = action.payload.reducedAccomplishment;
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
                // ВАЖНО: Сохраняем все результаты в state
                state.results = action.payload;
                state.burnoutLevel = action.payload.burnoutLevel;
                state.score = action.payload.score || 0;
                state.emotionalExhaustion = action.payload.emotionalExhaustion || 0;
                state.depersonalization = action.payload.depersonalization || 0;
                state.reducedAccomplishment = action.payload.reducedAccomplishment || 0;
                state.loading = false;
                state.synced = action.payload.local ? false : true;
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
                state.history = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssessmentHistory.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            // fetchLatestAssessment
            .addCase(fetchLatestAssessment.fulfilled, (state, action) => {
                state.results = action.payload;
                state.burnoutLevel = action.payload.burnoutLevel;
                state.score = action.payload.score;
                state.synced = true;
            });
    },
});

export const { setAnswer, clearAnswers, updateAssessmentFromBackend, clearError } = assessmentSlice.actions;
export default assessmentSlice.reducer;
