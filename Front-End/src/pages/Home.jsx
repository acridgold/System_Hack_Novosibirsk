import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Box,
    Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RecommendIcon from '@mui/icons-material/Lightbulb';
import PsychologyIcon from '@mui/icons-material/Psychology';

const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <AssessmentIcon sx={{ fontSize: 50 }} />,
            title: 'Диагностика выгорания',
            description: 'Пройдите научно обоснованный опрос для оценки уровня профессионального выгорания',
            action: () => navigate('/assessment'),
            buttonText: 'Начать тест',
            color: '#FF6B00',
        },
        {
            icon: <DashboardIcon sx={{ fontSize: 50 }} />,
            title: 'Дашборд метрик',
            description: 'Отслеживайте динамику вашего состояния и прогресс в реальном времени',
            action: () => navigate('/dashboard'),
            buttonText: 'Открыть дашборд',
            color: '#2196f3',
        },
        {
            icon: <RecommendIcon sx={{ fontSize: 50 }} />,
            title: 'Персональные советы',
            description: 'Получите рекомендации по управлению стрессом на основе AI-анализа',
            action: () => navigate('/recommendations'),
            buttonText: 'Посмотреть советы',
            color: '#4caf50',
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            {/* Hero Section */}
            <MotionBox
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                sx={{ textAlign: 'center', mb: 8 }}
            >
                <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
                    <PsychologyIcon color="primary" sx={{ fontSize: 80, mr: 2 }} />
                    <Typography variant="h1" color="primary">
                        SDEK Burnout AI
                    </Typography>
                </Box>

                <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
                    AI-инструмент для оценки профессионального выгорания сотрудников и партнёров.
                    Вовремя распознайте признаки выгорания и получите персональные рекомендации.
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/assessment')}
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Пройти диагностику
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/dashboard')}
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Открыть дашборд
                    </Button>
                </Stack>
            </MotionBox>

            {/* Features Grid */}
            <Grid container spacing={4}>
                {features.map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <MotionCard
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                borderTop: `4px solid ${feature.color}`,
                            }}
                            onClick={feature.action}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box display="flex" justifyContent="center" mb={2}>
                                    <Box sx={{ color: feature.color }}>{feature.icon}</Box>
                                </Box>
                                <Typography variant="h5" align="center" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" align="center" paragraph>
                                    {feature.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ backgroundColor: feature.color, '&:hover': { backgroundColor: feature.color, filter: 'brightness(0.9)' } }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        feature.action();
                                    }}
                                >
                                    {feature.buttonText}
                                </Button>
                            </CardContent>
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>

            {/* Statistics Section */}
            <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                sx={{ mt: 8, p: 4, backgroundColor: 'primary.main', borderRadius: 3, color: 'white' }}
            >
                <Grid container spacing={4} textAlign="center">
                    <Grid item xs={12} md={4}>
                        <Typography variant="h2" fontWeight="bold">85%</Typography>
                        <Typography variant="h6">Точность диагностики</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h2" fontWeight="bold">500+</Typography>
                        <Typography variant="h6">Пользователей</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h2" fontWeight="bold">4.8/5</Typography>
                        <Typography variant="h6">Средняя оценка</Typography>
                    </Grid>
                </Grid>
            </MotionBox>
        </Container>
    );
};

export default Home;
