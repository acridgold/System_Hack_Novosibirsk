import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Получение рекомендаций
export const fetchRecommendations = createAsyncThunk(
    'recommendations/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.get('/recommendations');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Отметить рекомендацию как выполненную
export const markRecommendationComplete = createAsyncThunk(
    'recommendations/markComplete',
    async (tipId, { rejectWithValue }) => {
        try {
            const data = await api.patch(`/recommendations/${tipId}`, { completed: true });
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const recommendationsSlice = createSlice({
    name: 'recommendations',
    initialState: {
        tips: [],
        schedule: null,
        loading: false,
        error: null,
    },
    reducers: {
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
                state.tips = action.payload.tips || [];
                state.schedule = action.payload.schedule;
                state.loading = false;
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            // markRecommendationComplete
            .addCase(markRecommendationComplete.fulfilled, (state, action) => {
                const index = state.tips.findIndex(tip => tip.id === action.payload.id);
                if (index !== -1) {
                    state.tips[index].completed = true;
                }
            });
    },
});

export const { clearError } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
