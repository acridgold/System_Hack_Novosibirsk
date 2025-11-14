import React, { useState, useCallback, useEffect } from 'react';
import { 
    Typography, 
    Box, 
    Paper, 
    Slider,
    Fade,
    CircularProgress
} from '@mui/material';

const ProfessionalGoalsQuestion = ({ question, currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer || 1);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedFrames, setLoadedFrames] = useState({});

    // Генерация путей к кадрам анимации
    const frameCount = 9;
    const frames = Array.from({ length: frameCount }, (_, i) => 
        `/animations/ProfessionalGoalsQuestion/${(i+1).toString().padStart(4, '0')}.png`
    );

    // Преобразование значения 1-5 в кадр анимации 0-63
    const valueToFrame = (value) => {
        return Math.min(Math.floor(((value - 1) / 4) * frameCount), frameCount - 1);
    };

    const currentFrame = valueToFrame(localValue);

    // Предзагрузка изображений
    useEffect(() => {
        const loadImages = async () => {
            setIsLoading(true);
            const loadPromises = frames.map((framePath, index) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        setLoadedFrames(prev => ({ ...prev, [index]: framePath }));
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn(`Failed to load frame: ${framePath}`);
                        resolve();
                    };
                    img.src = framePath;
                });
            });

            await Promise.all(loadPromises);
            setIsLoading(false);
        };

        loadImages();
    }, []);

    // Обработчик изменения слайдера
    const handleSliderChange = useCallback((event, newValue) => {
        setLocalValue(newValue);
        onAnswer(newValue);
    }, [onAnswer]);

    // Функция для получения цвета (инвертированная интерполяция)
    const getColor = (value) => {
        const baseValue = Math.floor(value);
        const progress = value - baseValue;
        
        // Инвертированная цветовая схема: от красного к зеленому
        const colors = {
            1: '#F44336', // Красный - высокий уровень выгорания
            2: '#FF9800', // Оранжевый
            3: '#FFC107', // Желтый
            4: '#8BC34A', // Светло-зеленый
            5: '#4CAF50', // Зеленый - низкий уровень выгорания
        };

        // Если значение целое, возвращаем соответствующий цвет
        if (progress === 0) {
            return colors[value];
        }

        // Инвертированная интерполяция между цветами
        const currentColor = colors[baseValue];
        const nextColor = colors[baseValue + 1] || currentColor;

        return interpolateColor(currentColor, nextColor, progress);
    };

    // Функция для интерполяции цветов
    const interpolateColor = (color1, color2, factor) => {
        const hex = (color) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        const rgb1 = hex(color1);
        const rgb2 = hex(color2);

        if (!rgb1 || !rgb2) return color1;

        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
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

            {/* Контейнер с анимацией и слайдером */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                {/* Слайдер с подписями */}
                <Box sx={{ 
                    width: '250px', // Увеличил ширину контейнера
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    justifyContent: 'center', // Центрирование по вертикали
                    height: '500px', // Высота контейнера равна высоте анимации
                }}>
                    

                    {/* Подпись в конце слайдера */}
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

                    {/* Контейнер для слайдера с центрированием */}
                    <Box sx={{ 
                        transform: 'rotate(30deg)',
                        transformOrigin: 'center center',
                        height: '200px', // Увеличил высоту для лучшего центрирования
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        margin: '20px 0', // Добавил отступы сверху и снизу
                    }}>
                        <Slider
                            value={localValue}
                            onChange={handleSliderChange}
                            min={1}
                            max={5}
                            step={0.1}
                            orientation="vertical"
                            sx={{
                                color: currentColor,
                                width: 12,
                                '& .MuiSlider-thumb': {
                                    width: 24,
                                    height: 24,
                                    backgroundColor: '#fff',
                                    border: `3px solid ${currentColor}`,
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                    '&:hover, &.Mui-focusVisible': {
                                        boxShadow: `0 0 0 8px ${currentColor}20`,
                                    },
                                    '&.Mui-active': {
                                        boxShadow: `0 0 0 12px ${currentColor}30`,
                                    },
                                },
                                '& .MuiSlider-track': {
                                    background: 'linear-gradient(180deg, #4CAF50 0%, #8BC34A 25%, #FFC107 50%, #FF9800 75%, #F44336 100%)',
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

                    {/* Подпись в начале слайдера */}
                    <Typography 
                        variant="caption" 
                        color="#F44336" 
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

                {/* Контейнер с анимацией */}
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
                    {isLoading ? (
                        // Загрузка
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                color: 'text.secondary',
                            }}
                        >
                            <CircularProgress sx={{ color: '#00AA44', mb: 2 }} />
                            <Typography variant="body2">
                                Загрузка анимации...
                            </Typography>
                        </Box>
                    ) : (
                        // Анимация
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
                                {/* Текущий кадр анимации */}
                                {loadedFrames[currentFrame] && (
                                    <img
                                        src={loadedFrames[currentFrame]}
                                        alt={`Кадр анимации выгорания ${currentFrame + 1}`}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            display: 'block',
                                        }}
                                    />
                                )}
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default ProfessionalGoalsQuestion;