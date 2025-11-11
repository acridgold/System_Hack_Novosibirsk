import React from 'react';
import { useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Button,
    Alert,
    Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Login as LoginIcon } from '@mui/icons-material';

const Dashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.user);
    const { answers, burnoutLevel, score } = useSelector((state) => state.assessment);

    console.log('Dashboard - Answers:', answers);
    console.log('Dashboard - BurnoutLevel:', burnoutLevel);
    console.log('Dashboard - Score:', score);
    console.log('Dashboard - isAuthenticated:', isAuthenticated);

    // Проверяем есть ли локальные результаты
    const hasAnswers = Object.keys(answers || {}).length > 0;

    // Если НЕ авторизован И НЕТ результатов
    if (!isAuthenticated && !hasAnswers) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom color="warning.main">
                        🔒 Дашборд пуст
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Пройдите диагностику, чтобы увидеть результаты.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/assessment')}
                        size="large"
                    >
                        Пройти диагностику
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Если НЕ авторизован, НО ЕСТЬ результаты
    if (!isAuthenticated && hasAnswers) {
        const avg = Object.values(answers).reduce((a, b) => a + parseInt(b), 0) / Object.values(answers).length;
        const scoreValue = Math.round((avg / 5) * 100);

        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                        📊 Локальные результаты
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Ваши результаты сохранены локально. Авторизуйтесь для сохранения в БД.
                    </Typography>
                </Box>

                {/* Alert */}
                <Alert severity="info" sx={{ mb: 4 }}>
                    <Typography variant="body2" fontWeight="bold">
                        ✓ Авторизуйтесь чтобы: сохранить результаты • видеть историю • получить полный анализ
                    </Typography>
                </Alert>

                {/* Metrics Cards */}
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                    {burnoutLevel === 'high' ? 'Высокий' : burnoutLevel === 'medium' ? 'Средний' : 'Низкий'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Уровень выгорания
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                    {scoreValue}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Общий показатель
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                    {Object.keys(answers).length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Ответов дано
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                    {new Date().toLocaleDateString('ru-RU')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Дата теста
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Auth Button */}
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<LoginIcon />}
                        onClick={() => navigate('/login')}
                    >
                        Авторизоваться для сохранения
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Если авторизован
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                    📊 Ваш дашборд
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Полная история и анализ
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" color="primary" fontWeight="bold">
                                Авторизованная версия
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                ✓ История всех тестов
                                <br />
                                ✓ Графики прогресса
                                <br />
                                ✓ Персональные рекомендации
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
