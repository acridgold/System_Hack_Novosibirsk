import React, { useState, useCallback, useEffect } from 'react';
import { 
    Typography, 
    Box, 
    Paper, 
    Slider,
    Fade
} from '@mui/material';

const ProfessionalGoalsQuestion = ({ question, currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer || 0);
    const [isLoading, setIsLoading] = useState(true);

    // Конфигурация анимации
    const frameCount = 9;
    const frames = Array.from({ length: frameCount }, (_, i) => 
        `/questionsAssets/ProfessionalGoalsQuestion/${(i+1).toString().padStart(4, '0')}.png`
    );

    // Преобразование значения слайдера в номер кадра анимации
    const valueToFrame = (value) => {
        return Math.min(Math.floor(value * frameCount), frameCount - 1);
    };

    const currentFrame = valueToFrame(localValue);

    // Простая загрузка изображений
    useEffect(() => {
        const loadImages = () => {
            frames.forEach((framePath) => {
                const img = new Image();
                img.src = framePath;
            });
            // Устанавливаем небольшую задержку для имитации загрузки
            setTimeout(() => setIsLoading(false), 500);
        };

        loadImages();
    }, []);

    // Обработчик изменения положения слайдера
    const handleSliderChange = useCallback((event, newValue) => {
        setLocalValue(newValue);
        onAnswer(newValue);
    }, [onAnswer]);

    // Простая цветовая схема без интерполяции
    const getColor = (value) => {
        if (value < 0.25) return '#F44336';      // Красный
        if (value < 0.5) return '#FF9800';       // Оранжевый
        if (value < 0.75) return '#FFC107';      // Желтый
        if (value < 1) return '#8BC34A';         // Светло-зеленый
        return '#4CAF50';                        // Зеленый
    };

    const currentColor = getColor(localValue);

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                border: '2px solid #E0EFE5',
                background: 'linear-gradient(135deg, #FFFFFF 100%)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Основной контейнер с слайдером и анимацией */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                
                {/* Блок слайдера с подписями */}
                <Box sx={{ 
                    width: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    justifyContent: 'center',
                    height: '500px',
                }}>
                    {/* Верхняя подпись - позитивный полюс */}
                    <Typography 
                        variant="caption" 
                        color="#4CAF50" 
                        fontWeight="bold"
                        fontSize="1.1rem"
                        sx={{ 
                            textAlign: 'center',
                            lineHeight: 1.2
                        }}
                    >
                        У меня большие планы на профессиональное будущее
                    </Typography>

                    {/* Вертикальный слайдер с поворотом на 30 градусов */}
                    <Box sx={{ 
                        transform: 'rotate(30deg)',
                        transformOrigin: 'center center',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        margin: '20px 0',
                    }}>
                        <Slider
                            value={localValue}
                            onChange={handleSliderChange}
                            min={0}
                            max={1}
                            step={0.01}
                            orientation="vertical"
                            sx={{
                                color: currentColor,
                                width: 12,
                                '& .MuiSlider-thumb': {
                                    width: 24,
                                    height: 24,
                                    backgroundColor: '#fff',
                                    border: `3px solid #4CAF50`,
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                    '&:hover, &.Mui-focusVisible': {
                                        boxShadow: `0 0 0 8px #4CAF5020`,
                                    },
                                    '&.Mui-active': {
                                        boxShadow: `0 0 0 12px #4CAF5030`,
                                    },
                                },
                                '& .MuiSlider-track': {
                                    background: '#4CAF50',
                                    border: 'none',
                                    width: 6,
                                },
                                '& .MuiSlider-rail': {
                                    backgroundColor: '#E0E0E0',
                                    width: 6,
                                    opacity: 0.7,
                                },
                            }}
                        />
                    </Box>

                    {/* Нижняя подпись - негативный полюс */}
                    <Typography 
                        variant="caption" 
                        color="#4CAF50" 
                        fontWeight="bold"
                        fontSize="1.1rem"
                        sx={{ 
                            textAlign: 'center',
                            lineHeight: 1.2
                        }}
                    >
                        Мне безразличны карьерные достижения
                    </Typography>
                </Box>

                {/* Блок с анимацией */}
                <Box
                    sx={{
                        position: 'relative',
                        flex: 1,
                        height: '500px',
                        background: '#ffffff',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Отображение анимации после загрузки кадров */}
                    {!isLoading && (
                        <Fade in={!isLoading} timeout={500}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {/* Текущий кадр анимации, соответствующий положению слайдера */}
                                <img
                                    src={frames[currentFrame]}
                                    alt={`Кадр анимации выгорания ${currentFrame + 1}`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default ProfessionalGoalsQuestion;