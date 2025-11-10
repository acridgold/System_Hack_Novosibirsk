import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    TrendingDown,
    TrendingUp,
    Psychology,
    Assessment as AssessmentIcon,
    LocalFireDepartment,
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const MotionPaper = motion.create(Paper);
const MotionCard = motion.create(Card);

const Dashboard = () => {
    const { burnoutLevel } = useSelector((state) => state.assessment);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get('/dashboard/metrics');
                setMetrics(response.metrics || mockMetrics);
            } catch (error) {
                console.error('Ошибка загрузки метрик:', error);
                setMetrics(mockMetrics);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    // Mock данные для демонстрации
    const mockMetrics = [
        { date: 'Пн', burnout: 45, stress: 50, productivity: 75 },
        { date: 'Вт', burnout: 48, stress: 55, productivity: 70 },
        { date: 'Ср', burnout: 42, stress: 48, productivity: 78 },
        { date: 'Чт', burnout: 40, stress: 45, productivity: 80 },
        { date: 'Пт', burnout: 38, stress: 42, productivity: 82 },
    ];

    const pieData = [
        { name: 'Эмоциональное истощение', value: 35, color: '#FF6B00' },
        { name: 'Деперсонализация', value: 25, color: '#FFA500' },
        { name: 'Редукция достижений', value: 40, color: '#FFD700' },
    ];

    const burnoutLevelData = {
        low: { label: 'Низкий', color: 'success', icon: <TrendingDown />, description: 'Отличное состояние!' },
        medium: { label: 'Средний', color: 'warning', icon: <TrendingUp />, description: 'Будьте внимательны' },
        high: { label: 'Высокий', color: 'error', icon: <LocalFireDepartment />, description: 'Требуется внимание' },
    };

    const currentLevel = burnoutLevel || 'medium';
    const levelInfo = burnoutLevelData[currentLevel];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <MotionPaper
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                elevation={0}
                sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #FF6B00 0%, #FFA500 100%)', color: 'white' }}
            >
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Дашборд выгорания
                </Typography>
                <Typography variant="body1">
                    Отслеживайте ваши показатели и динамику состояния
                </Typography>
            </MotionPaper>

            {/* Metrics Cards */}
            <Grid container spacing={3} mb={4}>
                {[
                    {
                        title: 'Уровень выгорания',
                        value: levelInfo.label,
                        subtitle: levelInfo.description,
                        icon: levelInfo.icon,
                        color: levelInfo.color,
                    },
                    {
                        title: 'Тренд за неделю',
                        value: '-8%',
                        subtitle: 'Снижение выгорания',
                        icon: <TrendingDown />,
                        color: 'success',
                    },
                    {
                        title: 'Пройдено тестов',
                        value: '5',
                        subtitle: 'За последний месяц',
                        icon: <AssessmentIcon />,
                        color: 'info',
                    },
                    {
                        title: 'Рекомендаций выполнено',
                        value: '12 из 15',
                        subtitle: '80% выполнение',
                        icon: <Psychology />,
                        color: 'primary',
                    },
                ].map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <MotionCard
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            elevation={3}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                    <Avatar sx={{ bgcolor: `${metric.color}.main` }}>
                                        {metric.icon}
                                    </Avatar>
                                    <Chip label={metric.title} size="small" />
                                </Box>
                                <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                                    {metric.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {metric.subtitle}
                                </Typography>
                            </CardContent>
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                {/* Line Chart */}
                <Grid item xs={12} md={8}>
                    <MotionPaper
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        elevation={3}
                        sx={{ p: 3 }}
                    >
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Динамика показателей
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mockMetrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="burnout" stroke="#FF6B00" strokeWidth={3} name="Выгорание" />
                                <Line type="monotone" dataKey="stress" stroke="#FFA500" strokeWidth={3} name="Стресс" />
                                <Line type="monotone" dataKey="productivity" stroke="#4caf50" strokeWidth={3} name="Продуктивность" />
                            </LineChart>
                        </ResponsiveContainer>
                    </MotionPaper>
                </Grid>

                {/* Pie Chart */}
                <Grid item xs={12} md={4}>
                    <MotionPaper
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        elevation={3}
                        sx={{ p: 3 }}
                    >
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
                                    <Typography variant="body2">{item.name}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </MotionPaper>
                </Grid>

                {/* Bar Chart */}
                <Grid item xs={12}>
                    <MotionPaper
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        elevation={3}
                        sx={{ p: 3 }}
                    >
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Сравнение показателей
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={mockMetrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="burnout" fill="#FF6B00" name="Выгорание" />
                                <Bar dataKey="stress" fill="#FFA500" name="Стресс" />
                                <Bar dataKey="productivity" fill="#4caf50" name="Продуктивность" />
                            </BarChart>
                        </ResponsiveContainer>
                    </MotionPaper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
