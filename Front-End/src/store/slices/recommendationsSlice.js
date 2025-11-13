import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { MOCK_RECOMMENDATIONS } from '../../utils/mockUser';

// Получение рекомендаций
export const fetchRecommendations = createAsyncThunk(
    'recommendations/fetch',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().user;

            // ===== MOCK РЕКОМЕНДАЦИИ ДЛЯ ТЕСТОВОГО ПОЛЬЗОВАТЕЛЯ =====
            if (user?.email === 'user@example.com') {
                return MOCK_RECOMMENDATIONS;
            }

            // ===== РЕАЛЬНАЯ ЗАГРУЗКА =====
            if (user?.id) {
                const data = await api.get('/recommendations');
                return data.tips || [];
            }

            return [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Отметить рекомендацию как выполненную
export const markRecommendationComplete = createAsyncThunk(
    'recommendations/markComplete',
    async (tipId, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().user;

            // Если авторизован, отправляем на backend
            if (user?.id) {
                const data = await api.patch(`/recommendations/${tipId}`, { completed: true });
                return data;
            }

            // Если не авторизован, обновляем локально
            return { id: tipId, completed: true, local: true };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const recommendationsSlice = createSlice({
    name: 'recommendations',
    initialState: {
        // Начальные нулевые значения
        tips: [],
        schedule: null,

        // Статусы
        loading: false,
        synced: false,
        error: null,
    },
    reducers: {
        // Локальное отмечание рекомендации
        localMarkComplete: (state, action) => {
            const index = state.tips.findIndex(tip => tip.id === action.payload);
            if (index !== -1) {
                state.tips[index].completed = true;
            }
            state.synced = false;
        },

        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchRecommendations
            .addCase(fetchRecommendations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.tips = action.payload;
                state.loading = false;
                state.synced = true;
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.tips = [];
                state.error = action.payload;
                state.loading = false;
            })

            // markRecommendationComplete
            .addCase(markRecommendationComplete.fulfilled, (state, action) => {
                const index = state.tips.findIndex(tip => tip.id === action.payload.id);
                if (index !== -1) {
                    state.tips[index].completed = true;
                }
                state.synced = !action.payload.local;
            });
    },
});

export const { localMarkComplete, clearError } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
