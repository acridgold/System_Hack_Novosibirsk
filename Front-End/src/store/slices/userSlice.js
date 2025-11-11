import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Авторизация пользователя
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', credentials.email);
            formData.append('password', credentials.password);

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);

            // Получаем данные пользователя
            const userData = await api.get('/auth/me');

            // После успешной авторизации синхронизируем локальные данные с backend
            dispatch(syncLocalDataWithBackend(userData.id));

            return { token: data.access_token, user: userData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Проверка авторизации
export const checkAuth = createAsyncThunk(
    'user/checkAuth',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token');

            const data = await api.get('/auth/verify');

            // Синхронизируем локальные данные после проверки авторизации
            dispatch(syncLocalDataWithBackend(data.id));

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Синхронизация локальных данных с backend
export const syncLocalDataWithBackend = createAsyncThunk(
    'user/syncData',
    async (userId, { getState, rejectWithValue, dispatch }) => {
        try {
            const state = getState();

            // Если есть локальные результаты диагностики, отправляем их на backend
            if (Object.keys(state.assessment.answers).length > 0) {
                const assessmentPayload = {
                    answers: state.assessment.answers,
                    user_id: userId,
                    timestamp: new Date().toISOString(),
                };

                const assessmentResult = await api.post('/assessment/submit', assessmentPayload);
                dispatch(updateAssessmentFromBackend(assessmentResult));
            }

            // Если есть локальные рекомендации, синхронизируем статусы
            if (state.recommendations.tips.length > 0) {
                const completedTips = state.recommendations.tips.filter(tip => tip.completed);

                for (const tip of completedTips) {
                    await api.patch(`/recommendations/${tip.id}`, { completed: true });
                }

                // Загружаем свежие рекомендации с backend
                dispatch(fetchRecommendations());
            }

            // Загружаем историю диагностик пользователя
            dispatch(fetchAssessmentHistory());

            return { synced: true, userId };
        } catch (error) {
            console.error('Sync error:', error);
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuthenticated: false,
        isSynced: false,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isSynced = false;
            localStorage.removeItem('token');
        },

        // Добавьте этот reducer
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },

        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // checkAuth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isAuthenticated = false;
                state.loading = false;
            })
            // loginUser
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            // syncLocalDataWithBackend
            .addCase(syncLocalDataWithBackend.fulfilled, (state) => {
                state.isSynced = true;
            });
    },
});

export const { logout, updateUser, clearError } = userSlice.actions;
export default userSlice.reducer;