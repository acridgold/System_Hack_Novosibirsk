import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff, PersonOutline, LockOutlined } from '@mui/icons-material';
import { loginUser } from '../store/slices/userSlice';

const MotionPaper = motion.create(Paper);

const Login = () => {
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
                setError('Неверный email или пароль');
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
                background: 'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <MotionPaper
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    elevation={10}
                    sx={{ p: 4, borderRadius: 3 }}
                >
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
                            SDEK Burnout AI
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Войдите в свой аккаунт
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutline />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Пароль"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2 }}
                            component={motion.button}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? 'Вход...' : 'Войти'}
                        </Button>

                        <Button
                            variant="text"
                            fullWidth
                            onClick={() => navigate('/')}
                            sx={{ color: 'text.secondary' }}
                        >
                            Вернуться на главную
                        </Button>
                    </form>
                </MotionPaper>
            </Container>
        </Box>
    );
};

export default Login;
