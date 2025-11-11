import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    LinearProgress,
    Stack,
    Chip,
    Alert,
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle, Warning } from '@mui/icons-material';
import { setAnswer, submitAssessment } from '../store/slices/assessmentSlice';
import { ASSESSMENT_QUESTIONS } from '../utils/constants';

const Assessment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { answers, loading } = useSelector((state) => state.assessment);
    const { isAuthenticated } = useSelector((state) => state.user);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const handleAnswer = (value) => {
        dispatch(setAnswer({ questionId: currentQuestion, value: parseInt(value) }));
    };

    const handleNext = () => {
        if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        const result = await dispatch(submitAssessment());
        if (result.payload) {
            navigate('/dashboard');
        }
    };

    const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;
    const question = ASSESSMENT_QUESTIONS[currentQuestion];
    const currentAnswer = answers[currentQuestion];

    const options = [
        { value: 1, label: 'Никогда', color: '#4caf50' },
        { value: 2, label: 'Редко', color: '#8bc34a' },
        { value: 3, label: 'Иногда', color: '#ff9800' },
        { value: 4, label: 'Часто', color: '#f44336' },
        { value: 5, label: 'Всегда', color: '#c62828' },
    ];

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                {/* Информация о синхронизации */}
                {!isAuthenticated && (
                    <Alert severity="info" icon={<Warning />} sx={{ mb: 3 }}>
                        Вы не авторизованы. Результаты будут сохранены локально и отправлены на сервер после авторизации.
                    </Alert>
                )}

                {isAuthenticated && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        ✓ Данные будут синхронизированы с базой данных
                    </Alert>
                )}

                {/* Header */}
                <Box mb={4}>
                    <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                        Диагностика выгорания
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Вопрос {currentQuestion + 1} из {ASSESSMENT_QUESTIONS.length}
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>

                {/* Question */}
                <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50', mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        {question.text}
                    </Typography>
                    {question.subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {question.subtitle}
                        </Typography>
                    )}
                </Paper>

                {/* Answers - Только подсвечивающиеся кнопки */}
                <Box sx={{ mb: 4 }}>
                    <Stack spacing={2}>
                        {options.map((option) => (
                            <Paper
                                key={option.value}
                                elevation={currentAnswer === option.value ? 8 : 0}
                                sx={{
                                    p: 2.5,
                                    cursor: 'pointer',
                                    border: currentAnswer === option.value ? `3px solid ${option.color}` : '2px solid transparent',
                                    backgroundColor: currentAnswer === option.value ? `${option.color}15` : 'white',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    '&:hover': {
                                        backgroundColor: `${option.color}25`,
                                        boxShadow: `0 4px 16px ${option.color}40`,
                                    },
                                }}
                                onClick={() => handleAnswer(option.value)}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={currentAnswer === option.value ? 'bold' : '500'}
                                    sx={{
                                        color: currentAnswer === option.value ? option.color : 'text.primary',
                                        transition: 'color 0.3s',
                                    }}
                                >
                                    {option.label}
                                </Typography>
                                <Chip
                                    label={option.value}
                                    sx={{
                                        backgroundColor: currentAnswer === option.value ? option.color : 'grey.300',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                    }}
                                />
                            </Paper>
                        ))}
                    </Stack>
                </Box>

                {/* Navigation */}
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        disabled={currentQuestion === 0}
                        size="large"
                    >
                        Назад
                    </Button>

                    {currentQuestion < ASSESSMENT_QUESTIONS.length - 1 ? (
                        <Button
                            variant="contained"
                            endIcon={<ArrowForward />}
                            onClick={handleNext}
                            disabled={!currentAnswer}
                            size="large"
                        >
                            Далее
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            endIcon={<CheckCircle />}
                            onClick={handleSubmit}
                            disabled={!currentAnswer || loading}
                            size="large"
                        >
                            {loading ? 'Отправка...' : 'Завершить тест'}
                        </Button>
                    )}
                </Stack>
            </Paper>
        </Container>
    );
};

export default Assessment;
