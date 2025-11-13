import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Авторизация пользователя
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            // ===== ОТПРАВЛЯЕМ РЕАЛЬНЫЙ ЗАПРОС НА БЭКЕНД =====
            const formData = new URLSearchParams();
            formData.append('username', credentials.email);
            formData.append('password', credentials.password);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Неверный email или пароль');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);

            const userData = await api.get('/auth/me');

            return { token: data.access_token, user: userData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Проверка авторизации
export const checkAuth = createAsyncThunk(
    'user/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token');

            // ===== РЕАЛЬНАЯ ПРОВЕРКА =====
            const data = await api.get('/auth/verify');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
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
            });
    },
});

export const { logout, updateUser, clearError } = userSlice.actions;
export default userSlice.reducer;
