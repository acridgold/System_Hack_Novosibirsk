import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    InputAdornment,
    IconButton,
    Link,
} from '@mui/material';
import { Visibility, VisibilityOff, Psychology } from '@mui/icons-material';
import { loginUser } from '../store/slices/userSlice';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await dispatch(loginUser({ email, password }));
            if (result.payload) {
                navigate('/dashboard');
            } else {
                setError('Ошибка при входе. Проверьте данные.');
            }
        } catch (err) {
            setError('Ошибка подключения к серверу');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #F0F9F5 0%, #E0F2EA 50%, #D0EBDF 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        boxShadow: '0 12px 48px rgba(0, 170, 68, 0.15)',
                        border: '1px solid #E0EFE5',
                    }}
                >
                    {/* Logo Section */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                mx: 'auto',
                                mb: 2,
                                background: 'linear-gradient(135deg, #00AA44 0%, #33CC77 100%)',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(0, 170, 68, 0.25)',
                            }}
                        >
                            <Psychology sx={{ fontSize: 40, color: 'white' }} />
                        </Box>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #00AA44 0%, #1DB954 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                            }}
                        >
                            SDEK Burnout AI
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#4B5563' }}>
                            Войдите в свой аккаунт
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#00AA44',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#00AA44',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#00AA44',
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Пароль"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#00AA44',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#00AA44',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#00AA44',
                                },
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                background: 'linear-gradient(135deg, #00AA44 0%, #33CC77 100%)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1rem',
                                py: 1.5,
                                boxShadow: '0 8px 24px rgba(0, 170, 68, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1DB954 0%, #33CC77 100%)',
                                    boxShadow: '0 12px 32px rgba(0, 170, 68, 0.4)',
                                    transform: 'translateY(-2px)',
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(135deg, #00AA44 0%, #33CC77 100%)',
                                },
                                transition: 'all 0.3s',
                            }}
                        >
                            {loading ? 'Вход...' : 'Войти'}
                        </Button>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flex: 1, height: 1, backgroundColor: '#E0EFE5' }} />
                        <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                            или
                        </Typography>
                        <Box sx={{ flex: 1, height: 1, backgroundColor: '#E0EFE5' }} />
                    </Box>

                    {/* Demo Credentials */}
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: '#F0F9F5',
                            border: '1px solid #E0EFE5',
                            borderRadius: 2,
                            mb: 3,
                        }}
                    >
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#00AA44', mb: 1 }}>
                            📧 Тестовые учетные данные:
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#4B5563', display: 'block' }}>
                            Email: <strong>user@example.com</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#4B5563' }}>
                            Password: <strong>password123</strong>
                        </Typography>
                    </Paper>

                    {/* Back Link */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#4B5563' }}>
                            Нет аккаунта?{' '}
                            <Link
                                onClick={() => navigate('/')}
                                sx={{
                                    color: '#00AA44',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        color: '#1DB954',
                                    },
                                }}
                            >
                                Вернуться на главную
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
