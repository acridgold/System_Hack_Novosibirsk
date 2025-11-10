import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Проверка авторизации
export const checkAuth = createAsyncThunk(
    'user/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token');

            const data = await api.get('/auth/verify');
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Авторизация пользователя
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            // Для FastAPI OAuth2
            const formData = new URLSearchParams();
            formData.append('username', credentials.email);
            formData.append('password', credentials.password);

            const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:8000'}/auth/token`, {
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

            return { token: data.access_token, user: userData };
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
            .addCase(checkAuth.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.error = action.payload;
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

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
