import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Avatar,
    Alert,
} from '@mui/material';
import {
    Lightbulb,
    SelfImprovement,
    Schedule,
    FitnessCenter,
    CheckCircle,
    ArrowForward,
    Lock,
    Login as LoginIcon,
    Info,
    Restaurant,
    Bedtime,
    Groups,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchRecommendations, localMarkComplete, localClearCompleted } from '../store/slices/recommendationsSlice';
import { MOCK_RECOMMENDATIONS } from '../utils/mockRecommendations.js';

const Recommendations = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tips } = useSelector((state) => state.recommendations);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { answers } = useSelector((state) => state.assessment);
    const [completed, setCompleted] = React.useState({});

    // Есть ли локальные результаты (для гостя)
    const hasLocalResults = answers && Object.keys(answers).length > 0;

    // Ключ в localStorage: для авторизованного пользователя отдельный, иначе общий для гостя
    const getStorageKey = () => (user && user.id) ? `recommendations_completed_${user.id}` : 'recommendations_completed_guest';

    // Загружаем состояние при монтировании / при смене пользователя
    useEffect(() => {
        try {
            const key = getStorageKey();
            const raw = localStorage.getItem(key);
            if (raw) {
                setCompleted(JSON.parse(raw));
            } else {
                setCompleted({});
            }
        } catch (e) {
            // ignore
            setCompleted({});
        }
    }, [user]);

    // Синхронизируем между вкладками — слушаем событие storage
    useEffect(() => {
        const handler = (e) => {
            if (!e.key) return;
            const key = getStorageKey();
            if (e.key === key) {
                try {
                    setCompleted(e.newValue ? JSON.parse(e.newValue) : {});
                } catch (err) {
                    // ignore
                }
            }
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [user]);

    useEffect(() => {
        dispatch(fetchRecommendations());
    }, [dispatch, isAuthenticated]);

    const handleToggleComplete = (id) => {
        setCompleted((prev) => {
            const updated = { ...prev, [id]: !prev[id] };
            try {
                localStorage.setItem(getStorageKey(), JSON.stringify(updated));
            } catch (e) {
                // ignore
            }
            return updated;
        });
        dispatch(localMarkComplete(id));
    };

    const handleClearAll = () => {
        try {
            localStorage.removeItem(getStorageKey());
        } catch (e) {
            // ignore
        }
        setCompleted({});
        dispatch(localClearCompleted());
    };

    // Иконки для категорий
    const categoryIcons = {
        'Медитация': <SelfImprovement />,
        'Тайм-менеджмент': <Schedule />,
        'Физическая активность': <FitnessCenter />,
        'Сон': <Bedtime />,
        'Питание': <Restaurant />,
        'Социальные связи': <Groups />,
    };

    // Цвета для категорий
    const categoryColors = {
        'Медитация': '#9c27b0',
        'Тайм-менеджмент': '#2196f3',
        'Физическая активность': '#4caf50',
        'Сон': '#673ab7',
        'Питание': '#ff9800',
        'Социальные связи': '#e91e63',
    };

    // Маппинг рекомендаций из mockRecommendations с иконками и цветами
    const enrichedRecommendations = MOCK_RECOMMENDATIONS.map(rec => ({
        ...rec,
        icon: categoryIcons[rec.category] || <Lightbulb />,
        color: categoryColors[rec.category] || '#00AA44',
    }));

    // Используем enriched рекомендации или tips из API
    const recommendationsList = tips.length > 0 ? tips : enrichedRecommendations;

    // Вычисляем количество выполненных по текущему списку рекомендаций
    const completedCount = recommendationsList.filter((t) => completed[t.id]).length;

    // Если рекомендации пришли с флагом completed (например, с бэка), мёрджим их в локальное состояние и localStorage
    useEffect(() => {
        if (!recommendationsList || recommendationsList.length === 0) return;
        let changed = false;
        const merged = { ...completed };
        recommendationsList.forEach((t) => {
            if (t.completed && !merged[t.id]) {
                merged[t.id] = true;
                changed = true;
            }
        });
        if (changed) {
            try {
                localStorage.setItem(getStorageKey(), JSON.stringify(merged));
            } catch (e) {
                // ignore
            }
            setCompleted(merged);
        }
    }, [recommendationsList]);

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
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
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
                        Персональные рекомендации
                    </Typography>

                    <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                        Сначала пройдите диагностику выгорания, а затем авторизуйтесь, чтобы получить персональные рекомендации.
                    </Typography>

                    <Alert severity="info" sx={{ mb: 4, justifyContent: 'center' }}>
                        Мы подберем советы на основе вашего уровня выгорания и психологического состояния.
                    </Alert>

                    <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/assessment')}
                            sx={{ minWidth: 200 }}
                        >
                            Пройти диагностику
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/')}
                            sx={{ minWidth: 200 }}
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
                {/* Header */}
                <Paper
                    elevation={0}
                    sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)', color: 'white' }}
                >
                    <Box display="flex" alignItems="center" mb={2}>
                        <Lightbulb sx={{ fontSize: 48, mr: 2 }} />
                        <div>
                            <Typography variant="h3" fontWeight="bold">
                                Общие рекомендации
                            </Typography>
                            <Typography variant="body1">
                                Базовые советы для управления стрессом (авторизуйтесь для персональных)
                            </Typography>
                        </div>
                    </Box>
                </Paper>

                {/* Info Alert */}
                <Alert severity="info" icon={<Info />} sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                            💡 Совет: Авторизуйтесь для получения:
                        </Typography>
                        <Typography variant="body2">
                            ✓ Персональных рекомендаций • ✓ Полного списка советов • ✓ Индивидуального плана действий
                        </Typography>
                    </Box>
                </Alert>

                {/* Progress Stats */}
                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Grid container spacing={3} textAlign="center">
                        <Grid item xs={12} md={4}>
                            <Typography variant="h3" color="primary" fontWeight="bold">
                                {completedCount}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Начали выполнять
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h3" color="warning.main" fontWeight="bold">
                                3
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Базовых советов
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h3" color="success.main" fontWeight="bold">
                                {Math.round((completedCount / 3) * 100) || 0}%
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Прогресс сегодня
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Recommendations Grid - Limited to 3 */}
                <Grid container spacing={3} mb={4}>
                    {enrichedRecommendations.slice(0, 3).map((tip) => (
                        <Grid item xs={12} md={4} key={tip.id}>
                            <Card
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
                                            </div>
                                        </Box>
                                        <Box
                                            onClick={() => handleToggleComplete(tip.id)}
                                            sx={{
                                                cursor: 'pointer',
                                                color: completed[tip.id] ? 'success.main' : 'grey.400',
                                                transition: 'color 0.3s',
                                            }}
                                        >
                                            <CheckCircle sx={{ fontSize: 32 }} />
                                        </Box>
                                    </Box>

                                    {/* Content */}
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {tip.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {tip.description}
                                    </Typography>

                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Upgrade Alert */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        backgroundColor: 'transparent',
                        border: '2px solid #00AA44',
                        borderRadius: 2,
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#00AA44' }}>
                                🔓 Больше рекомендаций
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Авторизованные пользователи получают полный набор персональных рекомендаций, адаптированных под их результаты диагностики.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Typography variant="body2" sx={{ color: '#4B5563' }}>✓ Полный список советов</Typography>
                                <Typography variant="body2" sx={{ color: '#4B5563' }}>✓ Индивидуальный план</Typography>
                                <Typography variant="body2" sx={{ color: '#4B5563' }}>✓ Отслеживание выполнения</Typography>
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
                                    background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                    backgroundSize: '300% 300%',
                                    color: 'white',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 16px rgba(0, 255, 102, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0 8px 24px rgba(0, 255, 102, 0.4)',
                                        animation: 'gradientPulse 2s ease infinite',
                                    },
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

    // ===== ЕСЛИ АВТОРИЗОВАН =====
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)', color: 'white' }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                        <Lightbulb sx={{ fontSize: 48, mr: 2 }} />
                        <div>
                            <Typography variant="h3" fontWeight="bold">
                                Персональные рекомендации
                            </Typography>
                            <Typography variant="body1">
                                Советы для {user?.name}, адаптированные под ваши результаты
                            </Typography>
                        </div>
                    </Box>

                    {/*<Box>*/}
                    {/*    <Button variant="outlined" color="inherit" onClick={handleClearAll} sx={{ borderColor: 'rgba(255,255,255,0.3)' }}>*/}
                    {/*        Сбросить все выполненные*/}
                    {/*    </Button>*/}
                    {/*</Box>*/}

                </Box>
            </Paper>

            {/* Progress Stats */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3} textAlign="center">
                    <Grid item xs={12} md={3}>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                            {completedCount}
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
                            {Math.round((completedCount / recommendationsList.length) * 100) || 0}%
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
            </Paper>

            {/* Recommendations Grid */}
            <Grid container spacing={3} mb={4}>
                {recommendationsList.map((tip) => (
                    <Grid item xs={12} md={6} key={tip.id}>
                        <Card
                            elevation={completed[tip.id] ? 1 : 3}
                            sx={{
                                height: '100%',
                                borderLeft: `6px solid ${tip.color}`,
                                opacity: completed[tip.id] ? 0.7 : 1,
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
                                            <Typography variant="caption" color="text.primary" display="block">
                                                {tip.category}
                                            </Typography>
                                        </div>
                                    </Box>
                                    <Box
                                        onClick={() => handleToggleComplete(tip.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            color: completed[tip.id] ? 'success.main' : 'grey.400',
                                            transition: 'color 0.3s',
                                            '&:hover': { color: 'success.main' },
                                        }}
                                    >
                                        <CheckCircle sx={{ fontSize: 32 }} />
                                    </Box>
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
                                    {tip.link && (
                                        <Button
                                            size="small"
                                            endIcon={<ArrowForward />}
                                            sx={{ color: tip.color }}
                                            onClick={() => {
                                                if (tip.link) {
                                                    window.open(tip.link, '_blank', 'noopener,noreferrer');
                                                }
                                            }}
                                        >
                                            Подробнее
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Action Button */}
            <Box textAlign="center">
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Lightbulb />}
                    onClick={() => dispatch(fetchRecommendations())}
                >
                    Обновить рекомендации
                </Button>
            </Box>
        </Container>
    );
};

export default Recommendations;
