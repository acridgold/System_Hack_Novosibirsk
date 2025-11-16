import React, { useState, useCallback, useRef, useEffect } from 'react'; 
import { 
    Typography, 
    Box, 
    Paper,
    LinearProgress
} from '@mui/material'; 

const AchievementAssessmentQuestion = ({ question, currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 0);
    const [isDragging, setIsDragging] = useState(false);
    const arrowRef = useRef(null);
    const containerRef = useRef(null);

    const totalObjects = 6; // Количество объектов
    const objectSize = 100; // Увеличенный размер объектов
    const maxArrowLength = 350; // Увеличенная максимальная длина стрелки
    const minArrowLength = 30; // Минимальная длина стрелки

    // Генерация путей к изображениям
    const imagePaths = Array.from({ length: totalObjects }, (_, i) => 
        `/questionsAssets/AchievementAssessmentQuestion/${(i + 1).toString().padStart(4, '0')}.png`
    );

    // Состояния для объектов на полках
    const [shelfObjects, setShelfObjects] = useState(
        Array.from({ length: totalObjects }, (_, index) => ({
            id: index,
            visible: false,
            opacity: 0,
            shelf: index < 3 ? 'top' : 'bottom', // Первые 3 на верхней полке, остальные на нижней
            position: index % 3, // Позиция на полке (0, 1, 2)
            path: imagePaths[index]
        }))
    );

    // Обновление видимости объектов в зависимости от значения
    useEffect(() => {
        const visibleCount = Math.floor(localValue * totalObjects);
        const newOpacity = localValue > 0 ? 1 : 0;

        setShelfObjects(prev => 
            prev.map((obj, index) => ({
                ...obj,
                visible: index < visibleCount,
                opacity: index < visibleCount ? newOpacity : 0
            }))
        );
    }, [localValue]);

    // Обработчик начала перетаскивания стрелки
    const handleArrowMouseDown = useCallback((event) => {
        setIsDragging(true);
        event.preventDefault();
    }, []);

    // Обработчик движения
    const handleMouseMove = useCallback((event) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        
        if (!clientX) return;

        // Вычисляем прогресс на основе положения мыши относительно контейнера
        const containerLeft = rect.left;
        const mouseX = clientX;
        
        // Максимальное расстояние перетаскивания (от левой границы контейнера)
        const maxDragDistance = rect.width - 100; // Учитываем отступы
        const dragDistance = Math.max(0, Math.min(maxDragDistance, mouseX - containerLeft));
        
        // Преобразуем в значение 0-1
        const progress = dragDistance / maxDragDistance;
        
        const newValue = Math.max(0, Math.min(1, progress));
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

    // Расчет длины и формы стрелки
    const arrowLength = minArrowLength + (maxArrowLength - minArrowLength) * localValue;
    const arrowCurve = 60 * localValue; // Кривизна стрелки

    // Получение текста состояния
    const getStateText = (value) => {
        if (value === 0) return 'Объекты скрыты';
        if (value < 0.2) return 'Почти нет достижений';
        if (value < 0.4) return 'Несколько достижений';
        if (value < 0.6) return 'Умеренные достижения';
        if (value < 0.8) return 'Хорошие достижения';
        return 'Отличные достижения';
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
                minHeight: '650px',
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
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}
            >

                {/* Информация о состоянии */}
                <Box sx={{ mb: 3, textAlign: 'center', width: '100%' }}>
                    
                    
                    {/* Шкала прогресса */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 2 }}>
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
                            <Typography variant="body2" color="text.secondary" fontWeight='bold'>
                                У меня не было каких-либо значимых результатов
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight='bold'>
                                У меня было множество достижений
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Полки с объектами */}
                <Box sx={{ 
                    width: '100%', 
                    height: '350px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    mb: 3
                }}>
                    
                    {/* Верхняя полка */}
                    <Box sx={{ 
                        position: 'relative',
                        height: '160px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }}>
                        {/* Полка */}
                        <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            width: '85%',
                            height: '25px',
                            backgroundColor: '#8B4513',
                            borderRadius: '4px 4px 0 0',
                            border: '2px solid #654321',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        }} />
                        
                        {/* Объекты на верхней полке */}
                        {shelfObjects.filter(obj => obj.shelf === 'top').map((obj) => (
                            <Box
                                key={obj.id}
                                sx={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    left: `calc(7.5% + ${obj.position * 28}%)`,
                                    width: `${objectSize}px`,
                                    height: `${objectSize}px`,
                                    opacity: obj.opacity,
                                    transition: 'all 0.5s ease',
                                    transform: obj.visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src={obj.path}
                                    alt={`Объект ${obj.id + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        filter: obj.visible ? 'none' : 'grayscale(100%) brightness(0.7)',
                                        transition: 'all 0.5s ease',
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>

                    {/* Нижняя полка (под вторым рядом) */}
                    <Box sx={{ 
                        position: 'relative',
                        height: '160px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        mt: 2 // Отступ между полками
                    }}>
                        {/* Полка */}
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            width: '85%',
                            height: '25px',
                            backgroundColor: '#8B4513',
                            borderRadius: '0 0 4px 4px',
                            border: '2px solid #654321',
                            boxShadow: '0 -4px 8px rgba(0,0,0,0.3)',
                        }} />
                        
                        {/* Объекты на нижней полке */}
                        {shelfObjects.filter(obj => obj.shelf === 'bottom').map((obj) => (
                            <Box
                                key={obj.id}
                                sx={{
                                    position: 'absolute',
                                    top: '30px',
                                    left: `calc(7.5% + ${obj.position * 28}%)`,
                                    width: `${objectSize}px`,
                                    height: `${objectSize}px`,
                                    opacity: obj.opacity,
                                    transition: 'all 0.5s ease',
                                    transform: obj.visible ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <img
                                    src={obj.path}
                                    alt={`Объект ${obj.id + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        filter: obj.visible ? 'none' : 'grayscale(100%) brightness(0.7)',
                                        transition: 'all 0.5s ease',
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Стрелка (слева направо, до конца) */}
                <Box sx={{ 
                    position: 'relative',
                    width: '100%',
                    height: '100px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    {/* Полукруглая стрелка слева направо */}
                    <svg 
                        width="100%" 
                        height="100" 
                        style={{ 
                            cursor: isDragging ? 'grabbing' : 'grab',
                            transition: 'all 0.1s ease',
                        }}
                        onMouseDown={handleArrowMouseDown}
                        onTouchStart={handleArrowMouseDown}
                    >
                        {/* Фон стрелки (полупрозрачный) */}
                        <path
                            d={`M 30,50 
                                Q ${30 + arrowCurve},50 ${30 + arrowLength},50`}
                            stroke="#e0e0e0"
                            strokeWidth="10"
                            fill="none"
                            strokeLinecap="round"
                        />
                        
                        {/* Основная стрелка */}
                        <path
                            ref={arrowRef}
                            d={`M 30,50 
                                Q ${30 + arrowCurve},50 ${30 + arrowLength},50`}
                            stroke="#4CAF50"
                            strokeWidth="10"
                            fill="none"
                            strokeLinecap="round"
                        />
                        
                        {/* Наконечник стрелки */}
                        <polygon
                            points={`${50 + arrowLength},50 ${10 + arrowLength},35 ${10 + arrowLength},65`}
                            fill="#4CAF50"
                        />
                    </svg>
                </Box>

            </Box>
        </Paper>
    );
};

export default AchievementAssessmentQuestion;