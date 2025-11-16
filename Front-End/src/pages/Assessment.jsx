import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    LinearProgress,
    Alert,
    CircularProgress,
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle, Warning } from '@mui/icons-material';
import { setAnswer, submitAssessment } from '../store/slices/assessmentSlice';
import { ASSESSMENT_QUESTIONS } from '../utils/constants';

const WorkLifeBalanceQuestion = lazy(() => import('../components/assessment/questions/WorkLifeBalanceQuestion'));
const ProfessionalGoalsQuestion = lazy(() => import('../components/assessment/questions/ProfessionalGoalsQuestion'));
const PerfectWorkQuestion = lazy(() => import('../components/assessment/questions/PerfectWorkQuestion'));
const RelaxAbilityQuestion = lazy(() => import('../components/assessment/questions/RelaxAbilityQuestion'));
const TimeCostsQuestion = lazy(() => import('../components/assessment/questions/TimeCostsQuestion'));
const GivingUpQuestion = lazy(() => import('../components/assessment/questions/GivingUpQuestion'));
const ProblemSolvingQuestion = lazy(() => import('../components/assessment/questions/ProblemSolvingQuestion'));
const StressResistanceQuestion = lazy(() => import('../components/assessment/questions/StressResistanceQuestion'));
const AchievementAssessmentQuestion = lazy(() => import('../components/assessment/questions/AchievementAssessmentQuestion'));
const LifeSatisfactionQuestion = lazy(() => import('../components/assessment/questions/LifeSatisfactionQuestion'));
const RelativesSupportQuestion = lazy(() => import('../components/assessment/questions/RelativesSupportQuestion'));

const COMPONENT_MAP = {
    ProfessionalGoalsQuestion,
    PerfectWorkQuestion,
    RelaxAbilityQuestion,
    WorkLifeBalanceQuestion,
    TimeCostsQuestion,
    GivingUpQuestion,
    ProblemSolvingQuestion,
    StressResistanceQuestion,
    AchievementAssessmentQuestion,
    LifeSatisfactionQuestion,
    RelativesSupportQuestion
};

const Assessment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { answers, loading } = useSelector((state) => state.assessment);
    const { isAuthenticated } = useSelector((state) => state.user);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    // ===== АВТОМАТИЧЕСКАЯ ПРОКРУТКА ВВЕРХ =====
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [currentQuestion]);

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
        console.log('Submitting assessment...');
        const result = await dispatch(submitAssessment());
        console.log('Result:', result);
        if (result.payload) {
            setTimeout(() => navigate('/dashboard'), 300);
        }
    };

    const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;
    const question = ASSESSMENT_QUESTIONS[currentQuestion];
    const currentAnswer = answers[currentQuestion];

    const QuestionComponent = COMPONENT_MAP[question.component];

    return (
        <Container
            maxWidth="md"
            sx={{
                py: { xs: 2, sm: 4 },
                px: { xs: 2, sm: 3 },
                // prevent horizontal overflow on very small screens
                overflowX: 'hidden',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 4 },
                    border: '1px solid #E0EFE5',
                    overflow: 'hidden',
                }}
            >
                {!isAuthenticated && (
                    <Alert severity="info" icon={<Warning />} sx={{ mb: 3 }}>
                        Вы не авторизованы. Результаты будут сохранены локально.
                    </Alert>
                )}

                <Box mb={4}>
                    <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                        Диагностика выгорания
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Вопрос {currentQuestion + 1} из {ASSESSMENT_QUESTIONS.length}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: { xs: 6, sm: 8 },
                            borderRadius: 4,
                            backgroundColor: '#E0EFE5',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                            },
                        }}
                    />
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        backgroundColor: 'grey.50',
                        mb: 4,
                        border: '1px solid #E0EFE5',
                        wordBreak: 'break-word',
                    }}
                >
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        {question.text}
                    </Typography>
                    {question.subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {question.subtitle}
                        </Typography>
                    )}
                </Paper>

                <Suspense
                    fallback={
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight={{ xs: 240, sm: 400 }}>
                            <CircularProgress />
                        </Box>
                    }
                >
                    {QuestionComponent && (
                        <Box sx={{ mb: 2, width: '100%', overflow: 'hidden' }}>
                            <QuestionComponent
                                question={question}
                                currentAnswer={currentAnswer}
                                onAnswer={handleAnswer}
                            />
                        </Box>
                    )}
                </Suspense>

                <Box sx={{ mb: 4 }} />

                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        disabled={currentQuestion === 0}
                        size="large"
                        fullWidth={{ xs: true, sm: false }}
                        sx={{
                            borderColor: '#E0EFE5',
                            color: '#4B5563',
                            '&:hover': {
                                borderColor: '#00AA44',
                                backgroundColor: 'rgba(0, 170, 68, 0.05)',
                            },
                            // ensure min width on larger screens
                            minWidth: { sm: 160 },
                        }}
                    >
                        Назад
                    </Button>

                    {currentQuestion < ASSESSMENT_QUESTIONS.length - 1 ? (
                        <Button
                            variant="contained"
                            endIcon={<ArrowForward />}
                            onClick={handleNext}
                            size="large"
                            fullWidth={{ xs: true, sm: false }}
                            sx={{
                                background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                backgroundSize: '300% 300%',
                                color: 'white',
                                fontWeight: 600,
                                boxShadow: '0 4px 16px rgba(0, 255, 102, 0.3)',
                                '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0, 255, 102, 0.4)',
                                    animation: 'gradientPulse 2s ease infinite',
                                },
                                '&:disabled': {
                                    opacity: 0.5,
                                },
                                minWidth: { sm: 160 },
                            }}
                        >
                            Далее
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            endIcon={<CheckCircle />}
                            onClick={handleSubmit}
                            size="large"
                            fullWidth={{ xs: true, sm: false }}
                            sx={{
                                background: 'linear-gradient(135deg, #00AA44 0%, #00FF66 50%, #00DD55 100%)',
                                backgroundSize: '300% 300%',
                                color: 'white',
                                fontWeight: 600,
                                boxShadow: '0 4px 16px rgba(0, 255, 102, 0.3)',
                                '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0, 255, 102, 0.4)',
                                    animation: 'gradientPulse 2s ease infinite',
                                },
                                '&:disabled': {
                                    opacity: 0.5,
                                },
                                minWidth: { sm: 160 },
                            }}
                        >
                            {loading ? 'Отправка...' : 'Завершить тест'}
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Assessment;
