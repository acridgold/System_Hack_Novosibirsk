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
    Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, Psychology } from '@mui/icons-material';
import { registerUser } from '../store/slices/userSlice';

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        position: '',
        department: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Валидация
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (formData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const result = await dispatch(registerUser(registerData));

            if (result.payload) {
                navigate('/dashboard');
            } else {
                setError(result.error?.message || 'Ошибка при регистрации');
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
                            Регистрация
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#4B5563', fontWeight: 500 }}>
                            Создайте аккаунт в CDEK Burnout AI
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
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#00AA44', borderWidth: '2px' },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00FF66',
                                                borderWidth: '2px',
                                                boxShadow: '0 0 0 3px rgba(0, 255, 102, 0.1)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#00AA44', fontWeight: 600 },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Полное имя"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#00AA44', borderWidth: '2px' },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00FF66',
                                                borderWidth: '2px',
                                                boxShadow: '0 0 0 3px rgba(0, 255, 102, 0.1)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#00AA44', fontWeight: 600 },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Должность"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#00AA44', borderWidth: '2px' },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00FF66',
                                                borderWidth: '2px',
                                                boxShadow: '0 0 0 3px rgba(0, 255, 102, 0.1)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#00AA44', fontWeight: 600 },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Отдел"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#00AA44', borderWidth: '2px' },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00FF66',
                                                borderWidth: '2px',
                                                boxShadow: '0 0 0 3px rgba(0, 255, 102, 0.1)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#00AA44', fontWeight: 600 },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Пароль"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{
                                                        color: '#00AA44',
                                                        '&:hover': { backgroundColor: 'rgba(0, 255, 102, 0.1)' },
                                                    }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#00AA44', borderWidth: '2px' },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00FF66',
                                                borderWidth: '2px',
                                                boxShadow: '0 0 0 3px rgba(0, 255, 102, 0.1)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#00AA44', fontWeight: 600 },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Подтвердите пароль"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                    sx={{
                                                        color: '#00AA44',
                                                        '&:hover': { backgroundColor: 'rgba(0, 255, 102, 0.1)' },
                                                    }}
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': { borderColor: '#00AA44', borderWidth: '2px' },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00FF66',
                                                borderWidth: '2px',
                                                boxShadow: '0 0 0 3px rgba(0, 255, 102, 0.1)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#00AA44', fontWeight: 600 },
                                    }}
                                />
                            </Grid>
                        </Grid>

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
                                '&:hover': {
                                    boxShadow: '0 16px 48px rgba(0, 255, 102, 0.6)',
                                    transform: 'translateY(-3px) scale(1.01)',
                                    animation: 'gradientPulse 2s ease infinite',
                                },
                                '&:disabled': {
                                    opacity: 0.6,
                                    color: 'white',
                                },
                            }}
                        >
                            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>
                    </Box>

                    {/* Back Link */}
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="body2" sx={{ color: '#4B5563' }}>
                            Уже есть аккаунт?{' '}
                            <Link
                                onClick={() => navigate('/login')}
                                sx={{
                                    color: '#00AA44',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: '#00FF66',
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Войти
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
