import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    Button,
    Avatar,
    Stack,
    Checkbox,
    IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    Lightbulb,
    SelfImprovement,
    Schedule,
    FitnessCenter,
    MenuBook,
    Favorite,
    CheckCircle,
    ArrowForward,
} from '@mui/icons-material';
import { fetchRecommendations } from '../store/slices/recommendationsSlice';

const MotionCard = motion.create(Card);
const MotionPaper = motion.create(Paper);

const Recommendations = () => {
    const dispatch = useDispatch();
    const { tips, loading } = useSelector((state) => state.recommendations);
    const [completed, setCompleted] = useState({});

    useEffect(() => {
        dispatch(fetchRecommendations());
    }, [dispatch]);

    const handleToggleComplete = (id) => {
        setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Mock данные для демонстрации
    const mockTips = [
        {
            id: 1,
            category: 'Медитация',
            icon: <SelfImprovement />,
            color: '#9c27b0',
            title: 'Практикуйте осознанность',
            description: 'Уделяйте 10 минут в день медитации или дыхательным упражнениям для снижения стресса',
            priority: 'high',
            duration: '10 мин/день',
        },
        {
            id: 2,
            category: 'Тайм-менеджмент',
            icon: <Schedule />,
            color: '#2196f3',
            title: 'Используйте технику Pomodoro',
            description: 'Работайте 25 минут, затем делайте 5-минутный перерыв для повышения концентрации',
            priority: 'high',
            duration: '30 мин циклы',
        },
        {
            id: 3,
            category: 'Физическая активность',
            icon: <FitnessCenter />,
            color: '#4caf50',
            title: 'Регулярные упражнения',
            description: 'Занимайтесь физической активностью минимум 3 раза в неделю по 30 минут',
            priority: 'medium',
            duration: '3 раза/неделю',
        },
        {
            id: 4,
            category: 'Саморазвитие',
            icon: <MenuBook />,
            color: '#ff9800',
            title: 'Читайте профессиональную литературу',
            description: 'Посвящайте время изучению новых навыков и развитию карьеры',
            priority: 'medium',
            duration: '30 мин/день',
        },
        {
            id: 5,
            category: 'Отдых',
            icon: <Favorite />,
            color: '#e91e63',
            title: 'Качественный сон',
            description: 'Спите не менее 7-8 часов в сутки для восстановления энергии',
            priority: 'high',
            duration: '7-8 часов',
        },
        {
            id: 6,
            category: 'Социальные связи',
            icon: <Lightbulb />,
            color: '#00bcd4',
            title: 'Общайтесь с коллегами',
            description: 'Поддерживайте позитивные отношения на работе и делитесь опытом',
            priority: 'low',
            duration: 'Ежедневно',
        },
    ];

    const recommendationsList = tips.length > 0 ? tips : mockTips;

    const priorityColors = {
        high: 'error',
        medium: 'warning',
        low: 'info',
    };

    const priorityLabels = {
        high: 'Высокий приоритет',
        medium: 'Средний приоритет',
        low: 'Низкий приоритет',
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <MotionPaper
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                elevation={0}
                sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)', color: 'white' }}
            >
                <Box display="flex" alignItems="center" mb={2}>
                    <Lightbulb sx={{ fontSize: 48, mr: 2 }} />
                    <div>
                        <Typography variant="h3" fontWeight="bold">
                            Персональные рекомендации
                        </Typography>
                        <Typography variant="body1">
                            AI-советы для управления стрессом и повышения продуктивности
                        </Typography>
                    </div>
                </Box>
            </MotionPaper>

            {/* Progress Stats */}
            <MotionPaper
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                elevation={3}
                sx={{ p: 3, mb: 4 }}
            >
                <Grid container spacing={3} textAlign="center">
                    <Grid item xs={12} md={3}>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                            {Object.keys(completed).filter((k) => completed[k]).length}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Выполнено
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h3" color="warning.main" fontWeight="bold">
                            {recommendationsList.length}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Всего рекомендаций
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h3" color="success.main" fontWeight="bold">
                            {Math.round((Object.keys(completed).filter((k) => completed[k]).length / recommendationsList.length) * 100)}%
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Прогресс
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h3" color="info.main" fontWeight="bold">
                            7
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Дней подряд
                        </Typography>
                    </Grid>
                </Grid>
            </MotionPaper>

            {/* Recommendations Grid */}
            <Grid container spacing={3}>
                {recommendationsList.map((tip, index) => (
                    <Grid item xs={12} md={6} key={tip.id}>
                        <MotionCard
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            elevation={completed[tip.id] ? 1 : 3}
                            sx={{
                                height: '100%',
                                borderLeft: `6px solid ${tip.color}`,
                                opacity: completed[tip.id] ? 0.7 : 1,
                                position: 'relative',
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                {/* Header */}
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Avatar sx={{ bgcolor: tip.color, width: 48, height: 48 }}>
                                            {tip.icon}
                                        </Avatar>
                                        <div>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                {tip.category}
                                            </Typography>
                                            <Chip
                                                label={priorityLabels[tip.priority]}
                                                color={priorityColors[tip.priority]}
                                                size="small"
                                            />
                                        </div>
                                    </Box>
                                    <Checkbox
                                        checked={completed[tip.id] || false}
                                        onChange={() => handleToggleComplete(tip.id)}
                                        icon={<CheckCircle />}
                                        checkedIcon={<CheckCircle />}
                                        sx={{
                                            color: 'grey.400',
                                            '&.Mui-checked': { color: 'success.main' },
                                        }}
                                    />
                                </Box>

                                {/* Content */}
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {tip.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {tip.description}
                                </Typography>

                                {/* Footer */}
                                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                    <Chip
                                        icon={<Schedule />}
                                        label={tip.duration}
                                        size="small"
                                        variant="outlined"
                                    />
                                    <Button
                                        size="small"
                                        endIcon={<ArrowForward />}
                                        sx={{ color: tip.color }}
                                    >
                                        Подробнее
                                    </Button>
                                </Box>

                                {/* Completed Overlay */}
                                {completed[tip.id] && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            bgcolor: 'success.main',
                                            color: 'white',
                                            borderRadius: '50%',
                                            p: 1,
                                        }}
                                    >
                                        <CheckCircle />
                                    </Box>
                                )}
                            </CardContent>
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>

            {/* Action Button */}
            <Box textAlign="center" mt={6}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Lightbulb />}
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Получить новые рекомендации
                </Button>
            </Box>
        </Container>
    );
};

export default Recommendations;
