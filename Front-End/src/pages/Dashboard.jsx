import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    Alert,
    Button,
    CircularProgress,
} from '@mui/material';
import { TrendingDown, Lock, Login as LoginIcon, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import { fetchAssessmentHistory } from '../store/slices/assessmentSlice';
import { MOCK_DASHBOARD_METRICS } from '../utils/mockUser';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { burnoutLevel, score, history, loading: assessmentLoading, emotionalExhaustion, depersonalization, reducedAccomplishment } = useSelector((state) => state.assessment);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false);

    const { answers } = useSelector((state) => state.assessment);
    const hasLocalResults = Object.keys(answers || {}).length > 0;

    useEffect(() => {
        if (isAuthenticated && user) {
            dispatch(fetchAssessmentHistory());

            if (user.email === 'user@example.com') {
                setMetrics(MOCK_DASHBOARD_METRICS);
            } else {
                fetchMetrics();
            }
        }
    }, [isAuthenticated, user, dispatch]);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const response = await api.get('/dashboard/metrics');
            setMetrics(response.metrics || generateMockMetrics());
        } catch (error) {
            console.error('Error fetching metrics:', error);
            setMetrics(generateMockMetrics());
        } finally {
            setLoading(false);
        }
    };

    const generateMockMetrics = () => {
        const today = new Date().toLocaleDateString('ru-RU', { weekday: 'short' }).replace('.', '');
        return [
            { date: today, burnout: 65, stress: 70, productivity: 45 },
        ];
    };

    // ===== ПРОВЕРКА НАЛИЧИЯ ДАННЫХ =====
    const hasTestResults = history && history.length > 0;
    const hasValidData = hasTestResults && (emotionalExhaustion > 0 || depersonalization > 0 || reducedAccomplishment > 0);

    const pieData = hasValidData ? [
        { name: 'Эмоциональное истощение', value: emotionalExhaustion || 0, color: '#00AA44' },
        { name: 'Деперсонализация', value: depersonalization || 0, color: '#1DB954' },
        { name: 'Редукция достижений', value: reducedAccomplishment || 0, color: '#047857' },
    ] : [];

    const burnoutLevelData = {
        low: { label: 'Низкий', color: 'success', description: 'Отличное состояние!' },
        medium: { label: 'Средний', color: 'warning', description: 'Будьте внимательны' },
        high: { label: 'Высокий', color: 'error', description: 'Требуется внимание' },
    };

    const currentLevel = burnoutLevel || 'medium';
    const levelInfo = burnoutLevelData[currentLevel];

    // ===== ЕСЛИ НЕ АВТОРИЗОВАН И НЕТ ЛОКАЛЬНЫХ РЕЗУЛЬТАТОВ =====
    if (!isAuthenticated && !hasLocalResults) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 6,
                        backgroundColor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #E0EFE5',
                    }}
                >
                    <Box
                        sx={{
                            width: 100,
                            height: 100,
                            mx: 'auto',
                            mb: 3,
                            background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 100%)',
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Lock sx={{ fontSize: '3rem', color: 'white' }} />
                    </Box>

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Дашборд доступен после диагностики
                    </Typography>

                    <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                        Пройдите диагностику выгорания, чтобы увидеть ваши текущие показатели и получить рекомендации.
                    </Typography>

                    <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/assessment')}
                            sx={{
                                minWidth: 200,
                                background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 100%)',
                                backgroundSize: '200% 200%',
                                fontWeight: 700,
                                '&:hover': {
                                    animation: 'gradientPulse 2s ease infinite',
                                },
                            }}
                        >
                            Пройти диагностику
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/')}
                            sx={{
                                minWidth: 200,
                                borderColor: '#00AA44',
                                color: '#00AA44',
                                '&:hover': {
                                    borderColor: '#00FF66',
                                    backgroundColor: 'rgba(0, 255, 102, 0.05)',
                                },
                            }}
                        >
                            На главную
                        </Button>
                    </Box>
                </Box>
            </Container>
        );
    }

    // ===== ЕСЛИ НЕ АВТОРИЗОВАН, НО ЕСТЬ ЛОКАЛЬНЫЕ РЕЗУЛЬТАТЫ =====
    if (!isAuthenticated && hasLocalResults) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 100%)',
                        color: 'white',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Локальные результаты диагностики
                    </Typography>
                    <Typography variant="body1">
                        Результаты сохранены только локально. Авторизуйтесь, чтобы сохранить их в базе данных.
                    </Typography>
                </Paper>

                <Alert severity="info" icon={<Info />} sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                            💡 Совет: Авторизуйтесь, чтобы:
                        </Typography>
                        <Typography variant="body2">
                            ✓ Сохранить результаты в базе данных • ✓ Видеть историю всех диагностик • ✓ Получить полный анализ
                        </Typography>
                    </Box>
                </Alert>

                <Grid container spacing={3} mb={4}>
                    {[
                        {
                            title: 'Уровень выгорания',
                            value: levelInfo.label,
                            subtitle: levelInfo.description,
                            color: 'primary',
                        },
                        {
                            title: 'Показатель выгорания',
                            value: `${score || 0}%`,
                            subtitle: 'От 0 до 100',
                            color: 'primary',
                        },
                        {
                            title: 'Эмоциональное истощение',
                            value: `${emotionalExhaustion || 0}%`,
                            subtitle: 'От 0 до 100',
                            color: 'warning',
                        },
                        {
                            title: 'Продуктивность',
                            value: `${Math.max(0, 100 - (score || 0))}%`,
                            subtitle: 'От 0 до 100',
                            color: 'success',
                        },
                    ].map((metric, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card elevation={0} sx={{ border: '1px solid #E0EFE5' }}>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {metric.title}
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color={`${metric.color}.main`} gutterBottom>
                                        {metric.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {metric.subtitle}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Paper elevation={0} sx={{ p: 4, mb: 4, backgroundColor: '#F0F9F5', borderLeft: '5px solid #00AA44', border: '1px solid #E0EFE5' }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                🔓 Получите полный доступ
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Полная история диагностик, персональные рекомендации, график прогресса и многое другое доступны только авторизованным пользователям.
                            </Typography>
                            <Box display="flex" gap={2}>
                                <Typography variant="body2">✓ История всех тестов</Typography>
                                <Typography variant="body2">✓ Графики прогресса</Typography>
                                <Typography variant="body2">✓ Персональные советы</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<LoginIcon />}
                                onClick={() => navigate('/login')}
                                fullWidth
                                sx={{
                                    background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 100%)',
                                    fontWeight: 700,
                                }}
                            >
                                Авторизоваться
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        );
    }

    if (assessmentLoading || loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress sx={{ color: '#00AA44' }} />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 100%)',
                    color: 'white',
                    borderRadius: 2,
                }}
            >
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Дашборд выгорания
                </Typography>
                <Typography variant="body1">
                    Добро пожаловать, {user?.name}! Отслеживайте ваши показатели и динамику состояния
                </Typography>
            </Paper>

            <Grid container spacing={3} mb={4}>
                {[
                    {
                        title: 'Уровень выгорания',
                        value: hasTestResults ? levelInfo.label : 'Нет данных',
                        subtitle: hasTestResults ? levelInfo.description : 'Пройдите тест',
                        color: hasTestResults ? levelInfo.color : 'default',
                    },
                    {
                        title: 'Текущий показатель',
                        value: hasTestResults ? `${score}%` : '0%',
                        subtitle: 'От 0 до 100',
                        color: 'primary',
                    },
                    {
                        title: 'Пройдено тестов',
                        value: history.length || '0',
                        subtitle: 'За всё время',
                        color: 'info',
                    },
                    {
                        title: 'Рекомендаций выполнено',
                        value: hasTestResults ? '12 из 15' : '0 из 0',
                        subtitle: hasTestResults ? '80% выполнение' : 'Пройдите тест',
                        color: 'success',
                    },
                ].map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card elevation={0} sx={{ border: '1px solid #E0EFE5' }}>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {metric.title}
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" color={`${metric.color}.main`} gutterBottom>
                                    {metric.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {metric.subtitle}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Line Chart */}
                <Grid item xs={12} md={hasValidData ? 8 : 12}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #E0EFE5' }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Динамика показателей
                        </Typography>
                        {metrics.length > 0 && hasTestResults ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={metrics}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E0EFE5" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="burnout" stroke="#00AA44" strokeWidth={3} name="Выгорание" />
                                    <Line type="monotone" dataKey="stress" stroke="#1DB954" strokeWidth={3} name="Стресс" />
                                    <Line type="monotone" dataKey="productivity" stroke="#047857" strokeWidth={3} name="Продуктивность" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Нет данных для отображения. Пройдите диагностику для получения метрик.
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                {/* Pie Chart - ТОЛЬКО ЕСЛИ ЕСТЬ ДАННЫЕ */}
                {hasValidData && (
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E0EFE5' }}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                Структура выгорания
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.value}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <Box mt={2}>
                                {pieData.map((item, index) => (
                                    <Box key={index} display="flex" alignItems="center" mb={1}>
                                        <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: 1, mr: 1 }} />
                                        <Typography variant="body2">{item.name}: {item.value}%</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                )}

                {/* History */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #E0EFE5' }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            История тестов
                        </Typography>
                        {history && history.length > 0 ? (
                            <Grid container spacing={2}>
                                {history.slice(0, 5).map((test, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card elevation={0} sx={{ border: '1px solid #E0EFE5' }}>
                                            <CardContent>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(test.timestamp || test.date).toLocaleDateString('ru-RU')}
                                                </Typography>
                                                <Typography variant="body1" fontWeight="bold">
                                                    Уровень: {test.burnoutLevel}
                                                </Typography>
                                                <Chip
                                                    label={`${test.score || 0}%`}
                                                    color={test.burnoutLevel === 'high' ? 'error' : test.burnoutLevel === 'medium' ? 'warning' : 'success'}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Alert severity="info">
                                История тестов пуста. Пройдите первую диагностику!
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
