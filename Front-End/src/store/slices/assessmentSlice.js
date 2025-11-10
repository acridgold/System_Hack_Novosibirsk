import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Отправка опроса
export const submitAssessment = createAsyncThunk(
    'assessment/submit',
    async (answers, { rejectWithValue }) => {
        try {
            const data = await api.post('/assessment/submit', { answers });
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Получение истории опросов
export const fetchAssessmentHistory = createAsyncThunk(
    'assessment/fetchHistory',
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.get('/assessment/history');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const assessmentSlice = createSlice({
    name: 'assessment',
    initialState: {
        answers: {},
        results: null,
        burnoutLevel: null,
        history: [],
        loading: false,
        error: null,
    },
    reducers: {
        setAnswer: (state, action) => {
            const { questionId, value } = action.payload;
            state.answers[questionId] = value;
        },
        clearAnswers: (state) => {
            state.answers = {};
            state.results = null;
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
                state.results = action.payload;
                state.burnoutLevel = action.payload.burnoutLevel || 'medium';
                state.loading = false;
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
            });
    },
});

export const { setAnswer, clearAnswers, clearError } = assessmentSlice.actions;
export default assessmentSlice.reducer;
