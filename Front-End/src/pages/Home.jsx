import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    Psychology,
    TrendingDown,
    FlashOn,
    CheckCircle,
    ArrowForward,
} from '@mui/icons-material';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

export default function Home() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Psychology sx={{ fontSize: 40 }} />,
            title: 'Умная диагностика',
            description: 'AI-анализ вашего состояния на основе научных методик',
            color: '#00AA44',
            bgGradient: 'linear-gradient(135deg, rgba(0, 170, 68, 0.1) 0%, rgba(51, 204, 119, 0.05) 100%)',
        },
        {
            icon: <TrendingDown sx={{ fontSize: 40 }} />,
            title: 'Отслеживание прогресса',
            description: 'Следите за динамикой изменения показателей в реальном времени',
            color: '#00DD55',
            bgGradient: 'linear-gradient(135deg, rgba(0, 221, 85, 0.1) 0%, rgba(51, 255, 136, 0.05) 100%)',
        },
        {
            icon: <FlashOn sx={{ fontSize: 40 }} />,
            title: 'Персональные советы',
            description: 'Рекомендации, адаптированные под ваш профиль',
            color: '#00FF66',
            bgGradient: 'linear-gradient(135deg, rgba(0, 255, 102, 0.1) 0%, rgba(51, 255, 136, 0.05) 100%)',
        },
    ];

    return (
        <Box sx={{ minHeight: '100vh', background: '#F0F9F5' }}>
            {/* Hero Section */}
            <Box sx={{
                pt: { xs: 8, md: 16 },
                pb: { xs: 8, md: 12 },
                background: 'linear-gradient(135deg, #F0F9F5 0%, #E0F2EA 100%)',
            }}>
                <Container maxWidth="lg">
                    <MotionBox {...fadeInUp} sx={{ textAlign: 'center', mb: 6 }}>
                        <Box sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    mb: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 1.5,
                                        background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                        backgroundSize: '200% 200%',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 24px rgba(0, 255, 102, 0.3)',
                                        animation: 'gradientPulse 3s ease infinite',
                                    }}
                                >
                                    <Psychology
                                        sx={{
                                            fontSize: 48,
                                            color: 'white',
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        letterSpacing: '-0.02em',
                                        background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    CDEK Burnout AI
                                </Typography>
                            </Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    color: '#111827',
                                    fontWeight: 600,
                                    mb: 2,
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                    lineHeight: 1.3,
                                }}
                            >
                                Ваше благополучие — наш приоритет
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#4B5563',
                                    maxWidth: 600,
                                    mx: 'auto',
                                    fontSize: '1.125rem',
                                    lineHeight: 1.6,
                                }}
                            >
                                Определите уровень профессионального выгорания и получите персональный план действий для восстановления баланса
                            </Typography>
                        </Box>

                        {/* CTA Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                            <motion.div
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/assessment')}
                                    sx={{
                                        px: 5,
                                        py: 2,
                                        fontSize: '1.1rem',
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                        backgroundSize: '300% 300%',
                                        color: 'white',
                                        fontWeight: 700,
                                        boxShadow: '0 8px 32px rgba(0, 255, 102, 0.4)',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        '&:hover': {
                                            boxShadow: '0 16px 48px rgba(0, 255, 102, 0.6), 0 0 40px rgba(0, 255, 102, 0.3)',
                                            animation: 'gradientRotate 3s ease infinite',
                                            border: '2px solid rgba(255,255,255,0.4)',
                                        },
                                    }}
                                    endIcon={<ArrowForward />}
                                >
                                    Начать диагностику
                                </Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/dashboard')}
                                    sx={{
                                        px: 5,
                                        py: 2,
                                        fontSize: '1.1rem',
                                        borderRadius: 3,
                                        borderWidth: '2px',
                                        borderColor: '#00AA44',
                                        background: 'linear-gradient(135deg, rgba(0, 170, 68, 0.05) 0%, rgba(0, 255, 102, 0.1) 100%)',
                                        backgroundSize: '200% 200%',
                                        color: '#00AA44',
                                        fontWeight: 700,
                                        '&:hover': {
                                            borderWidth: '2px',
                                            borderColor: '#00FF66',
                                            background: 'linear-gradient(135deg, rgba(0, 255, 102, 0.15) 0%, rgba(0, 221, 85, 0.2) 100%)',
                                            boxShadow: '0 8px 24px rgba(0, 255, 102, 0.3)',
                                            animation: 'gradientShift 2s ease infinite',
                                        },
                                    }}
                                    endIcon={<TrendingDown />}
                                >
                                    Просмотр результатов
                                </Button>
                            </motion.div>
                        </Box>
                    </MotionBox>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#FFFFFF', borderTop: '1px solid #E0EFE5' }}>
                <Container maxWidth="lg">
                    <MotionBox {...fadeInUp} sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="h2"
                            sx={{
                                color: '#111827',
                                fontWeight: 700,
                                mb: 2,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Почему выбирают CDEK Burnout AI
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#4B5563', maxWidth: 500, mx: 'auto' }}>
                            Системный подход к оценке и предотвращению профессионального выгорания
                        </Typography>
                    </MotionBox>

                    <Grid container spacing={3}>
                        {features.map((feature, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <MotionCard
                                    {...fadeInUp}
                                    transition={{ ...fadeInUp.transition, delay: idx * 0.1 }}
                                    component={motion.div}
                                    whileHover={{ y: -8 }}
                                    sx={{
                                        height: '100%',
                                        borderLeft: `4px solid ${feature.color}`,
                                        borderTop: 'none',
                                        borderRight: 'none',
                                        borderBottom: 'none',
                                        background: feature.bgGradient,
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box
                                            sx={{
                                                color: feature.color,
                                                mb: 2,
                                                display: 'inline-block',
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: '#111827',
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#4B5563',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box sx={{
                py: { xs: 10, md: 14 },
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid #E0EFE5',
                mb: { xs: 4, md: 8 },
            }}>
                <Container maxWidth="md">
                    <MotionBox {...fadeInUp} sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h3"
                            sx={{
                                color: '#111827',
                                fontWeight: 700,
                                mb: 3,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Готовы узнать о себе больше?
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#4B5563',
                                mb: 5,
                                fontSize: '1.125rem',
                            }}
                        >
                            Пройдите быструю диагностику и получите персональный анализ
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/assessment')}
                            sx={{
                                px: 6,
                                py: 2.5,
                                fontSize: '1.1rem',
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                backgroundSize: '300% 300%',
                                color: 'white',
                                fontWeight: 700,
                                boxShadow: '0 8px 32px rgba(0, 255, 102, 0.4)',
                                border: '2px solid rgba(255,255,255,0.2)',
                                '&:hover': {
                                    boxShadow: '0 16px 48px rgba(0, 255, 102, 0.6)',
                                    animation: 'gradientPulse 2s ease infinite',
                                },
                            }}
                            endIcon={<CheckCircle />}
                        >
                            Начать диагностику
                        </Button>
                    </MotionBox>
                </Container>
            </Box>
        </Box>
    );
}
