import React, { useState, useCallback, useRef, useEffect } from 'react'; 
import { 
    Typography, 
    Box, 
    Paper,
    LinearProgress
} from '@mui/material'; 

const LifeSatisfactionQuestion = ({ question, currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 0.5);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    // Обработчик начала перетаскивания
    const handleMouseDown = useCallback((event) => {
        setIsDragging(true);
        event.preventDefault();
    }, []);

    // Обработчик движения
    const handleMouseMove = useCallback((event) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        if (!clientY) return;

        // Вычисляем прогресс на основе положения мыши относительно контейнера
        const containerTop = rect.top;
        const containerHeight = rect.height;
        const mouseY = clientY;
        
        // Прогресс от 0 до 1 (0 - вверху, 1 - внизу)
        const progress = Math.max(0, Math.min(1, (mouseY - containerTop) / containerHeight));
        
        // Тянем вниз - лицо становится веселее (value увеличивается)
        // Тянем вверх - лицо становится грустнее (value уменьшается)
        const newValue = progress;
        setLocalValue(newValue);
        onAnswer(newValue);
    }, [isDragging, onAnswer]);

    // Обработчик окончания перетаскивания
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Глобальные обработчики событий
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleMouseMove);
            document.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Расчет параметров лица на основе значения
    const getFaceParameters = (value) => {
        // Рот: от грустного (вниз) до счастливого (вверх)
        const mouthCurvature = -40 + value * 80; // от -40 до +40
        const mouthY = 180 + (1 - value) * 10; // Положение рта
        
        // Брови: грусть - опущены, улыбка - подняты
        const eyeBrowCurvature = 10 - value * 20; // от +10 до -10
        const eyeBrowY = 100 - value * 10; // Положение бровей
        
        // Глаза: от грустных до веселых
        const eyeOpenness = 0.7 + value * 0.3; // Открытость глаз
        
        return {
            mouthCurvature,
            mouthY,
            eyeBrowCurvature,
            eyeBrowY,
            eyeOpenness
        };
    };

    const faceParams = getFaceParameters(localValue);

    // Получение текста состояния
    const getStateText = (value) => {
        if (value === 0) return 'Очень грустно';
        if (value < 0.2) return 'Грустно';
        if (value < 0.4) return 'Немного грустно';
        if (value < 0.6) return 'Нейтрально';
        if (value < 0.8) return 'Довольно хорошо';
        return 'Отлично!';
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                border: '2px solid #E0EFE5',
                background: '#FFFFFF',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
            }}
        >
            {/* Основной контейнер */}
            <Box 
                ref={containerRef}
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center', // Центрирование по вертикали
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    cursor: isDragging ? 'grabbing' : 'default',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >

                {/* Информация о состоянии - перемещена выше */}
                <Box sx={{ 
                    mb: 4, 
                    textAlign: 'center', 
                    width: '100%',
                    maxWidth: '700px' // Ограничение ширины для лучшего вида
                }}>
                    
                    {/* Шкала прогресса */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: 1 
                    }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={localValue * 100} 
                            sx={{ 
                                width: '100%', 
                                height: 10, 
                                borderRadius: 5,
                                backgroundColor: '#f0f0f0',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#4CAF50',
                                    borderRadius: 5,
                                }
                            }} 
                        />
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            width: '100%',
                            mt: 0.5
                        }}>
                            <Typography variant="body2" color="#000000" fontWeight='bold' fontSize='1.1rem'>
                                Меня многое не устраивает
                            </Typography>
                            <Typography variant="body2" color="#000000" fontWeight='bold' fontSize='1.1rem'>
                                Я счастлив и доволен
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Лицо - перемещено ближе к центру */}
                <Box sx={{ 
                    position: 'relative',
                    width: '600px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <svg 
                        width="300" 
                        height="300" 
                        viewBox="0 0 300 300"
                        style={{ 
                            cursor: 'grab',
                            filter: 'grayscale(100%)',
                        }}
                    >
                        {/* Голова */}
                        <circle
                            cx="150"
                            cy="150"
                            r="120"
                            fill="#F5F5F5"
                            stroke="#9E9E9E"
                            strokeWidth="3"
                        />
                        
                        {/* Левый глаз */}
                        <ellipse
                            cx="110"
                            cy="120"
                            rx="15"
                            ry={15 * faceParams.eyeOpenness}
                            fill="#424242"
                        />
                        
                        {/* Правый глаз */}
                        <ellipse
                            cx="190"
                            cy="120"
                            rx="15"
                            ry={15 * faceParams.eyeOpenness}
                            fill="#424242"
                        />
                        
                        {/* Левая бровь (опускается при грусти, поднимается при улыбке) */}
                        <path
                            d={`M 90,${faceParams.eyeBrowY} Q 110,${faceParams.eyeBrowY + faceParams.eyeBrowCurvature} 130,${faceParams.eyeBrowY}`}
                            stroke="#424242"
                            strokeWidth="4"
                            fill="none"
                        />
                        
                        {/* Правая бровь (опускается при грусти, поднимается при улыбке) */}
                        <path
                            d={`M 170,${faceParams.eyeBrowY} Q 190,${faceParams.eyeBrowY + faceParams.eyeBrowCurvature} 210,${faceParams.eyeBrowY}`}
                            stroke="#424242"
                            strokeWidth="4"
                            fill="none"
                        />
                        
                        {/* Рот */}
                        <path
                            d={`M 100,${faceParams.mouthY} Q 150,${faceParams.mouthY + faceParams.mouthCurvature} 200,${faceParams.mouthY}`}
                            stroke="#424242"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                        />
                        
                    </svg>
                </Box>
            </Box>
        </Paper>
    );
};

export default LifeSatisfactionQuestion;