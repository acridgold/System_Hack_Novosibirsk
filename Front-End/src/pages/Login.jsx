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

            // Проверяем успешность авторизации
            if (loginUser.fulfilled.match(result)) {
                // Успешная авторизация - переходим на dashboard
                navigate('/dashboard');
            } else {
                // Ошибка авторизации - показываем сообщение
                setError(result.payload || 'Неверный логин или пароль');
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
                position: 'relative',
                overflow: 'hidden',
                py: 4,
                background: 'radial-gradient(circle at 30% 50%, #E0F2EA 0%, #F0F9F5 30%, #D0EBDF 60%, #B0E3CF 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `radial-gradient(circle, rgba(0, 170, 68, 0.12) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                    pointerEvents: 'none',
                    zIndex: 1,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `radial-gradient(circle, rgba(0, 255, 102, 0.08) 2px, transparent 2px)`,
                    backgroundSize: '48px 48px',
                    backgroundPosition: '12px 12px',
                    pointerEvents: 'none',
                    zIndex: 1,
                },
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        boxShadow: '0 12px 48px rgba(0, 255, 102, 0.2)',
                        border: '2px solid rgba(0, 255, 102, 0.1)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* Logo Section */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                mx: 'auto',
                                mb: 2,
                                background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                backgroundSize: '200% 200%',
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0, 255, 102, 0.4)',
                                animation: 'gradientPulse 3s ease infinite',
                                border: '3px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <Psychology sx={{ fontSize: 48, color: 'white' }} />
                        </Box>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                            }}
                        >
                            SDEK Burnout AI
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#4B5563', fontWeight: 500 }}>
                            Войдите в свой аккаунт
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                border: '1px solid #FEE2E2',
                            }}
                        >
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
                                    transition: 'all 0.3s',
                                    '&:hover fieldset': {
                                        borderColor: '#00AA44',
                                        borderWidth: '2px',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#00FF66',
                                        borderWidth: '2px',
                                        boxShadow: '0 0 0 3px rgba(0, 255, 102, 0.1)',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#00AA44',
                                    fontWeight: 600,
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
                                            sx={{
                                                color: '#00AA44',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 255, 102, 0.1)',
                                                },
                                            }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    transition: 'all 0.3s',
                                    '&:hover fieldset': {
                                        borderColor: '#00AA44',
                                        borderWidth: '2px',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#00FF66',
                                        borderWidth: '2px',
                                        boxShadow: '0 0 0 3px rgba(0, 255, 102, 0.1)',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#00AA44',
                                    fontWeight: 600,
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
                                background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                backgroundSize: '300% 300%',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                py: 2,
                                borderRadius: 2,
                                boxShadow: '0 8px 32px rgba(0, 255, 102, 0.4)',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                textTransform: 'none',
                                '&:hover': {
                                    boxShadow: '0 16px 48px rgba(0, 255, 102, 0.6)',
                                    transform: 'translateY(-3px) scale(1.01)',
                                    animation: 'gradientPulse 2s ease infinite',
                                    border: '2px solid rgba(255, 255, 255, 0.4)',
                                },
                                '&:active': {
                                    transform: 'translateY(-1px) scale(0.99)',
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(135deg, #00AA44 0%, #00DD55 100%)',
                                    opacity: 0.6,
                                    color: 'white',
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            {loading ? 'Вход...' : 'Войти'}
                        </Button>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                flex: 1,
                                height: 2,
                                background: 'linear-gradient(90deg, transparent, #E0EFE5, transparent)'
                            }}
                        />
                        <Typography variant="body2" sx={{ color: '#9CA3AF', fontWeight: 500 }}>
                            или
                        </Typography>
                        <Box
                            sx={{
                                flex: 1,
                                height: 2,
                                background: 'linear-gradient(90deg, transparent, #E0EFE5, transparent)'
                            }}
                        />
                    </Box>

                    {/* Demo Credentials */}
                    <Paper
                        sx={{
                            p: 2.5,
                            background: 'linear-gradient(135deg, rgba(0, 170, 68, 0.05) 0%, rgba(0, 255, 102, 0.08) 100%)',
                            border: '2px solid rgba(0, 255, 102, 0.15)',
                            borderRadius: 2,
                            mb: 3,
                            transition: 'all 0.3s',
                            '&:hover': {
                                border: '2px solid rgba(0, 255, 102, 0.25)',
                                boxShadow: '0 4px 16px rgba(0, 255, 102, 0.1)',
                            },
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{
                                color: '#00AA44',
                                mb: 1.5,
                                fontSize: '0.95rem',
                            }}
                        >
                            📧 Тестовые учетные данные:
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                            ml: 1,
                        }}>
                            <Typography variant="caption" sx={{ color: '#4B5563', fontSize: '0.85rem' }}>
                                Email: <strong style={{ color: '#00AA44' }}>user@example.com</strong>
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#4B5563', fontSize: '0.85rem' }}>
                                Password: <strong style={{ color: '#00AA44' }}>password123</strong>
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Back Link */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#4B5563' }}>
                            Нет аккаунта?{' '}
                            <Link
                                onClick={() => navigate('/register')}
                                sx={{
                                    color: '#00AA44',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        color: '#00FF66',
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Зарегистрироваться
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
