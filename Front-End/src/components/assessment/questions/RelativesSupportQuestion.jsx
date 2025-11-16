import React, { useState, useCallback, useRef, useEffect } from 'react'; 
import { 
    Typography, 
    Box, 
    Paper,
    LinearProgress
} from '@mui/material'; 

const RelativesSupportQuestion = ({ question, currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragDirection, setDragDirection] = useState(null); // 'left' или 'right'
    const containerRef = useRef(null);
    const objectsRef = useRef([
        { id: 1, x: 0, y: 0, baseX: 0 },
        { id: 2, x: 0, y: 0, baseX: 0 }
    ]);

    const objectSize = 350; // Уменьшенный размер объектов
    const maxDistance = 300; // Максимальное расстояние разъезда
    const minDistance = 0; // Минимальное расстояние (рядом)

    // Генерация путей к изображениям
    const imagePaths = [
        `/questionsAssets/RelativesSupportQuestion/womanLeft.png`,
        `/questionsAssets/RelativesSupportQuestion/womanRight.png`
    ];

    // Инициализация позиций объектов
    useEffect(() => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const centerX = containerWidth / 2 - 150;
        
        // Начальные позиции - объекты ближе друг к другу и выше
        const objectSpacing = 50; // Уменьшенный отступ между объектами
        
        objectsRef.current = [
            { 
                id: 1, 
                x: centerX - objectSize/2 - objectSpacing, // Подвинули ближе к центру
                y: 0, // Подняли выше
                baseX: centerX - objectSize/2 - objectSpacing,
                isLeft: true
            },
            { 
                id: 2, 
                x: centerX + objectSpacing, // Подвинули ближе к центру
                y: 0, // Подняли выше
                baseX: centerX + objectSpacing,
                isLeft: false
            }
        ];
        
        setLocalValue(1);
        onAnswer(1);
    }, []);

    // Обработчик начала перетаскивания
    const handleObjectMouseDown = useCallback((objectId, event) => {
        setIsDragging(true);
        const object = objectsRef.current.find(obj => obj.id === objectId);
        setDragDirection(object.isLeft ? 'left' : 'right');
        event.preventDefault();
    }, []);

    // Обработчик движения
    const handleMouseMove = useCallback((event) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        
        if (!clientX) return;

        const mouseX = clientX - rect.left;
        const containerWidth = rect.width;
        const centerX = containerWidth / 2;

        // Вычисляем расстояние от центра
        let dragDistance;
        if (dragDirection === 'left') {
            dragDistance = Math.max(0, Math.min(maxDistance/2, centerX - mouseX - objectSize/2));
        } else {
            dragDistance = Math.max(0, Math.min(maxDistance/2, mouseX - centerX - objectSize/2));
        }

        // Преобразуем в значение 0-1 (1 - вместе, 0 - далеко)
        const progress = dragDistance / (maxDistance / 2);
        const newValue = Math.max(0, Math.min(1, 1 - progress));

        // Обновляем позиции объектов
        const leftObject = objectsRef.current.find(obj => obj.isLeft);
        const rightObject = objectsRef.current.find(obj => !obj.isLeft);

        if (leftObject && rightObject) {
            // Центрируем объекты по их центру
            leftObject.x = centerX - objectSize/2 - dragDistance;
            rightObject.x = centerX - objectSize/2 + dragDistance;
        }

        setLocalValue(newValue);
        onAnswer(newValue);
    }, [isDragging, dragDirection, onAnswer, objectSize]);

    // Обработчик окончания перетаскивания
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragDirection(null);
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

    // Получение текста состояния
    const getStateText = (value) => {
        if (value === 1) return 'Объекты рядом';
        if (value > 0.8) return 'Объекты близко';
        if (value > 0.6) return 'Объекты на небольшом расстоянии';
        if (value > 0.4) return 'Объекты на среднем расстоянии';
        if (value > 0.2) return 'Объекты далеко';
        return 'Объекты очень далеко';
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
                minHeight: '500px',
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
                            <Typography variant="body2" color="№000000" fontWeight='bold'>
                                Я не чувствую поддержку
                            </Typography>
                            <Typography variant="body2" color="№000000" fontWeight='bold'>
                                Меня поддерживают близкие
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Контейнер для объектов */}
                <Box sx={{ 
                    position: 'relative',
                    width: '100%',
                    height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2
                }}>
                    
                    {/* Левый объект */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: objectsRef.current[0]?.x || 0,
                            top: objectsRef.current[0]?.y || 0,
                            width: `${objectSize}px`,
                            height: `${objectSize}px`,
                            cursor: isDragging ? 'grabbing' : 'grab',
                            transition: isDragging ? 'none' : 'all 0.3s ease',
                            zIndex: dragDirection === 'left' ? 10 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                transform: isDragging ? 'none' : 'scale(1.05)',
                            },
                        }}
                        onMouseDown={(e) => handleObjectMouseDown(1, e)}
                        onTouchStart={(e) => handleObjectMouseDown(1, e)}
                    >
                        <img
                            src={imagePaths[0]}
                            alt="Объект 1"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </Box>

                    {/* Правый объект */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: objectsRef.current[1]?.x || 0,
                            top: objectsRef.current[1]?.y || 0,
                            width: `${objectSize}px`,
                            height: `${objectSize}px`,
                            cursor: isDragging ? 'grabbing' : 'grab',
                            transition: isDragging ? 'none' : 'all 0.3s ease',
                            zIndex: dragDirection === 'right' ? 10 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                transform: isDragging ? 'none' : 'scale(1.05)',
                            },
                        }}
                        onMouseDown={(e) => handleObjectMouseDown(2, e)}
                        onTouchStart={(e) => handleObjectMouseDown(2, e)}
                    >
                        <img
                            src={imagePaths[1]}
                            alt="Объект 2"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </Box>
                </Box>

            </Box>
        </Paper>
    );
};

export default RelativesSupportQuestion;