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
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Stack,
    Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { setAnswer, submitAssessment } from '../store/slices/assessmentSlice';
import { ASSESSMENT_QUESTIONS } from '../utils/constants';

const MotionPaper = motion.create(Paper);
const MotionBox = motion.create(Box);

const Assessment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { answers, loading } = useSelector((state) => state.assessment);
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
        const result = await dispatch(submitAssessment(answers));
        if (result.payload) {
            navigate('/dashboard');
        }
    };

    const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;
    const question = ASSESSMENT_QUESTIONS[currentQuestion];
    const currentAnswer = answers[currentQuestion];

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                elevation={3}
                sx={{ p: 4 }}
            >
                {/* Header */}
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
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <MotionBox
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50', mb: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                {question.text}
                            </Typography>
                            {question.subtitle && (
                                <Typography variant="body2" color="text.secondary">
                                    {question.subtitle}
                                </Typography>
                            )}
                        </Paper>

                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup value={currentAnswer || ''} onChange={(e) => handleAnswer(e.target.value)}>
                                <Stack spacing={2}>
                                    {[
                                        { value: 1, label: 'Никогда', color: 'success' },
                                        { value: 2, label: 'Редко', color: 'info' },
                                        { value: 3, label: 'Иногда', color: 'warning' },
                                        { value: 4, label: 'Часто', color: 'error' },
                                        { value: 5, label: 'Всегда', color: 'error' },
                                    ].map((option) => (
                                        <MotionPaper
                                            key={option.value}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            elevation={currentAnswer === option.value ? 8 : 1}
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                border: currentAnswer === option.value ? 2 : 0,
                                                borderColor: 'primary.main',
                                                backgroundColor: currentAnswer === option.value ? 'primary.light' : 'white',
                                                transition: 'all 0.3s',
                                            }}
                                            onClick={() => handleAnswer(option.value)}
                                        >
                                            <FormControlLabel
                                                value={option.value}
                                                control={<Radio />}
                                                label={
                                                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                                        <Typography variant="h6">{option.label}</Typography>
                                                        <Chip label={option.value} color={option.color} size="small" />
                                                    </Box>
                                                }
                                                sx={{ m: 0, width: '100%' }}
                                            />
                                        </MotionPaper>
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                    </MotionBox>
                </AnimatePresence>

                {/* Navigation */}
                <Stack direction="row" spacing={2} justifyContent="space-between" mt={4}>
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
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
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
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {loading ? 'Отправка...' : 'Завершить тест'}
                        </Button>
                    )}
                </Stack>
            </MotionPaper>
        </Container>
    );
};

export default Assessment;
