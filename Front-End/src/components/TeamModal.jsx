import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Close,
    TrendingUp,
    TrendingDown,
    TrendingFlat,
    Warning,
    CheckCircle,
    Error,
    NotificationsActive,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { MOCK_TEAM_MEMBERS } from '../utils/mockUser';

const TeamModal = ({ open, onClose }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.user);

    // Агрегированная статистика
    const stats = {
        critical: MOCK_TEAM_MEMBERS.filter(m => m.status === 'critical').length,
        warning: MOCK_TEAM_MEMBERS.filter(m => m.status === 'warning').length,
        good: MOCK_TEAM_MEMBERS.filter(m => m.status === 'good').length,
        total: MOCK_TEAM_MEMBERS.length,
        avgBurnout: Math.round(MOCK_TEAM_MEMBERS.reduce((sum, m) => sum + m.burnoutScore, 0) / MOCK_TEAM_MEMBERS.length),
    };

    // Helper функции (объявлены ДО использования в map)
    const getActionLabel = (status) => {
        switch (status) {
            case 'critical':
                return 'Требуется срочное действие';
            case 'warning':
                return 'Требуется внимание';
            case 'good':
                return 'Состояние в норме';
            default:
                return 'Статус неизвестен';
        }
    };

    const getActionColor = (status) => {
        switch (status) {
            case 'critical':
                return '#EF4444';
            case 'warning':
                return '#F59E0B';
            case 'good':
                return '#00AA44';
            default:
                return '#9CA3AF';
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'increasing':
                return <TrendingUp sx={{ fontSize: 20, color: '#EF4444' }} />;
            case 'decreasing':
                return <TrendingDown sx={{ fontSize: 20, color: '#00AA44' }} />;
            case 'stable':
                return <TrendingFlat sx={{ fontSize: 20, color: '#F59E0B' }} />;
            default:
                return null;
        }
    };

    // Загрузка AI рекомендаций
    useEffect(() => {
        if (open) {
            fetchAIRecommendations();
        }
    }, [open]);

    const fetchAIRecommendations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Если токен mock - используем fallback
            if (token === 'mock-token-manager' || token === 'mock-token-12345') {
                setRecommendations([
                    'Провести индивидуальные беседы с сотрудниками в критическом состоянии',
                    'Рассмотреть возможность перераспределения нагрузки в команде',
                    'Организовать тренинги по управлению стрессом и эмоциональным выгоранием',
                    'Внедрить программу поддержки психологического здоровья сотрудников',
                    'Провести анонимный опрос для выявления источников стресса',
                ]);
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/ai/manager-recommendations`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        critical: stats.critical,
                        warning: stats.warning,
                        good: stats.good,
                        total: stats.total,
                        avg_burnout: stats.avgBurnout,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setRecommendations(data.recommendations);
            } else {
                // Fallback
                setRecommendations([
                    'Провести индивидуальные беседы с сотрудниками в критическом состоянии',
                    'Рассмотреть возможность перераспределения нагрузки',
                    'Организовать тренинги по управлению стрессом',
                    'Внедрить программу поддержки психологического здоровья',
                ]);
            }
        } catch (error) {
            console.error('Ошибка загрузки AI рекомендаций:', error);
            setRecommendations([
                'Провести индивидуальные беседы с сотрудниками в критическом состоянии',
                'Рассмотреть возможность перераспределения нагрузки',
                'Организовать тренинги по управлению стрессом',
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh',
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 3,
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Мониторинг команды
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                        Агрегированные показатели отдела доставки
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            {/* Content */}
            <DialogContent sx={{ p: 3, backgroundColor: '#F9FAFB' }}>
                {/* Alert */}
                {stats.critical > 0 && (
                    <Alert
                        severity="error"
                        icon={<NotificationsActive />}
                        sx={{ mb: 3, borderRadius: 2 }}
                    >
                        <Typography variant="body2" fontWeight="bold">
                            Обнаружено {stats.critical} сотрудников с критическим уровнем выгорания
                        </Typography>
                        <Typography variant="caption">
                            Рекомендуется провести индивидуальные беседы и пересмотреть нагрузку
                        </Typography>
                    </Alert>
                )}

                {/* Summary Cards */}
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={6} sm={3}>
                        <Card elevation={0} sx={{ border: '1px solid #E0EFE5', textAlign: 'center', backgroundColor: '#FEF2F2' }}>
                            <CardContent>
                                <Error sx={{ fontSize: 32, color: '#EF4444', mb: 1 }} />
                                <Typography variant="h3" fontWeight="bold" color="error.main">
                                    {stats.critical}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Критическое состояние
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card elevation={0} sx={{ border: '1px solid #E0EFE5', textAlign: 'center', backgroundColor: '#FFFBEB' }}>
                            <CardContent>
                                <Warning sx={{ fontSize: 32, color: '#F59E0B', mb: 1 }} />
                                <Typography variant="h3" fontWeight="bold" color="warning.main">
                                    {stats.warning}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Требует внимания
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card elevation={0} sx={{ border: '1px solid #E0EFE5', textAlign: 'center', backgroundColor: '#F0FDF4' }}>
                            <CardContent>
                                <CheckCircle sx={{ fontSize: 32, color: '#00AA44', mb: 1 }} />
                                <Typography variant="h3" fontWeight="bold" color="success.main">
                                    {stats.good}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    В норме
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card elevation={0} sx={{ border: '1px solid #E0EFE5', textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Средний уровень
                                </Typography>
                                <Typography variant="h3" fontWeight="bold" color="primary.main">
                                    {stats.avgBurnout}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Выгорание команды
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Anonymous Team Members List */}
                <Typography variant="h6" fontWeight="bold" mb={2} color="text.primary">
                    Анонимные показатели сотрудников
                </Typography>

                <Box>
                    {MOCK_TEAM_MEMBERS.map((member, index) => (
                        <Card
                            key={member.id}
                            elevation={0}
                            sx={{
                                mb: 2,
                                border: '2px solid',
                                borderColor: member.status === 'critical' ? '#FEE2E2' : member.status === 'warning' ? '#FEF3C7' : '#D1FAE5',
                                backgroundColor: member.status === 'critical' ? '#FEF2F2' : member.status === 'warning' ? '#FFFBEB' : '#F0FDF4',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: '0 4px 16px rgba(0, 170, 68, 0.15)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    {/* Anonymous ID */}
                                    <Grid item xs={12} sm={3}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                #{index + 1}
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" fontWeight="bold">
                                                    Сотрудник {index + 1}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {member.position}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Status & Burnout Score */}
                                    <Grid item xs={12} sm={4}>
                                        <Box>
                                            <Chip
                                                label={getActionLabel(member.status)}
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem',
                                                    backgroundColor: getActionColor(member.status),
                                                    color: 'white',
                                                    mb: 1,
                                                }}
                                            />
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography variant="h5" fontWeight="bold" color={getActionColor(member.status)}>
                                                    {member.burnoutScore}%
                                                </Typography>
                                                {getTrendIcon(member.trend)}
                                                <Typography variant="caption" color="text.secondary">
                                                    {member.trend === 'increasing' ? 'Растёт' : member.trend === 'decreasing' ? 'Снижается' : 'Стабильно'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Progress Indicators */}
                                    <Grid item xs={12} sm={5}>
                                        <Box>
                                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Общий уровень выгорания
                                                </Typography>
                                                <Typography variant="caption" fontWeight="bold">
                                                    {member.burnoutScore}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={member.burnoutScore}
                                                sx={{
                                                    height: 10,
                                                    borderRadius: 5,
                                                    backgroundColor: '#E5E7EB',
                                                    mb: 1.5,
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: getActionColor(member.status),
                                                        borderRadius: 5,
                                                    },
                                                }}
                                            />

                                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Выполнено рекомендаций
                                                </Typography>
                                                <Typography variant="caption" fontWeight="bold">
                                                    {member.recommendationsCompleted}/{member.recommendationsTotal}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(member.recommendationsCompleted / member.recommendationsTotal) * 100}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: '#E5E7EB',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: '#00AA44',
                                                        borderRadius: 4,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* AI Recommendations */}
                <Card elevation={0} sx={{ mt: 3, border: '1px solid #E0EFE5', backgroundColor: '#F0F9F5' }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                                Рекомендации для менеджмента
                            </Typography>
                            {loading && <CircularProgress size={20} sx={{ color: '#00AA44' }} />}
                        </Box>

                        {loading ? (
                            <Typography variant="body2" color="text.secondary">
                                Генерация рекомендаций...
                            </Typography>
                        ) : (
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                {recommendations.map((rec, index) => (
                                    <Typography key={index} component="li" variant="body2" sx={{ mb: 1 }}>
                                        {rec}
                                    </Typography>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default TeamModal;
