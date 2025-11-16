import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
    Typography, 
    Box, 
    Paper
} from '@mui/material';

const TimeCostsQuestion = ({ question, currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 0);
    const [isDragging, setIsDragging] = useState(false);
    const clockRef = useRef(null);
    const totalRotationRef = useRef(localValue * 360);
    const lastAngleRef = useRef(localValue * 360);

    // Преобразование значения (0-1) в угол (0-360°)
    const valueToAngle = (value) => {
        return value * 360;
    };

    const currentAngle = valueToAngle(localValue);

    // Вычисление угла для минутной стрелки
    const minuteAngle = (localValue * 3.7 * 360) % 360; // 12 часов = 12 оборотов

    // Вычисление координат точки на окружности
    const getPointOnCircle = (angle, radius) => {
        const rad = (angle - 90) * (Math.PI / 180);
        return {
            x: radius * Math.cos(rad),
            y: radius * Math.sin(rad)
        };
    };

    // Получение угла из координат мыши/тача
    const getAngleFromEvent = useCallback((event, rect) => {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        if (!clientX || !clientY) return lastAngleRef.current % 360;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Нормализуем угол от 0 до 360
        angle = (angle + 360) % 360;
        return angle;
    }, []);

    // Обработчик начала вращения
    const handleMouseDown = useCallback((event) => {
        setIsDragging(true);
        const rect = clockRef.current.getBoundingClientRect();
        const startAngle = getAngleFromEvent(event, rect);
        
        // Сохраняем начальное смещение между текущим углом и углом мыши
        const currentClockAngle = totalRotationRef.current;
        const angleOffset = currentClockAngle - startAngle;
        clockRef.current._angleOffset = angleOffset;
        lastAngleRef.current = currentClockAngle;
        
        event.preventDefault();
    }, [getAngleFromEvent]);

    // Обновление угла из события
    const updateAngleFromEvent = useCallback((event) => {
        if (!clockRef.current || !isDragging) return;

        const rect = clockRef.current.getBoundingClientRect();
        const currentAngle = getAngleFromEvent(event, rect);

        // Вычисляем новый угол с учетом смещения
        let newAngle = currentAngle + clockRef.current._angleOffset;
        
        // Плавное ограничение - не позволяем перескакивать через границы
        const lastAngle = lastAngleRef.current;
        let angleDiff = newAngle - lastAngle;
        
        // Корректируем разницу для перехода через 360°
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        
        newAngle = lastAngle + angleDiff;
        
        // Жесткое ограничение от 0 до 359 (не до 360!)
        if (newAngle < 0) {
            newAngle = 0;
        } else if (newAngle >= 360) {
            newAngle = 359.999; // Останавливаемся на 359 градусах
        }

        totalRotationRef.current = newAngle;
        lastAngleRef.current = newAngle;

        // Преобразуем в значение 0-1
        const newValue = newAngle / 360;
        
        setLocalValue(newValue);
        onAnswer(newValue);
    }, [isDragging, onAnswer, getAngleFromEvent]);

    // Обработчик движения
    const handleMouseMove = useCallback((event) => {
        if (!isDragging) return;
        updateAngleFromEvent(event);
    }, [isDragging, updateAngleFromEvent]);

    // Обработчик окончания вращения
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

    // Инициализация при изменении currentAnswer
    useEffect(() => {
        if (currentAnswer !== undefined) {
            setLocalValue(currentAnswer);
            totalRotationRef.current = currentAnswer * 360;
            lastAngleRef.current = currentAnswer * 360;
        }
    }, [currentAnswer]);

    // Точки для сектора заполнения
    const startPoint = getPointOnCircle(0, 190);
    const endPoint = getPointOnCircle(currentAngle, 190);
    const largeArcFlag = currentAngle > 180 ? 1 : 0;

    const pathData = currentAngle > 0 
        ? `M 0 0 L ${startPoint.x} ${startPoint.y} A 190 190 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y} Z`
        : '';

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                border: '2px solid #E0EFE5',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Контейнер с часами */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, mb: 1 }}>

                {/* Часы */}
                <Box sx={{ position: 'relative', width: '400px', height: '400px' }}>
                    
                    {/* SVG для сектора заполнения */}
                    <svg
                        width="400"
                        height="400"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2,
                        }}
                    >
                        {/* Заполненный сектор */}
                        {currentAngle > 0 && (
                            <path
                                d={pathData}
                                fill="#4CAF50"
                                transform="translate(200, 200)"
                            />
                        )}
                    </svg>

                    {/* Изображение циферблата */}
                    <Box
                        component="img"
                        src="questionsAssets/TimeCostsQuestion/clock.png"
                        alt="Циферблат"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '380px',
                            zIndex: 3,
                        }}
                    />

                    {/* Минутная стрелка (изображение) */}
                    <Box
                        component="img"
                        src="questionsAssets/TimeCostsQuestion/minute.png"
                        alt="Минутная стрелка"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${minuteAngle}deg)`,
                            transformOrigin: 'center',
                            width: '360px',
                            zIndex: 4,
                            transition: isDragging ? 'none' : 'transform 0.1s ease',
                        }}
                    />

                    {/* Основная стрелка (изображение) */}
                    <Box
                        ref={clockRef}
                        component="img"
                        src="questionsAssets/TimeCostsQuestion/hour.png"
                        alt="Основная стрелка"
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${currentAngle}deg)`,
                            transformOrigin: 'center',
                            width: '400px',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            zIndex: 5,
                            transition: isDragging ? 'none' : 'transform 0.1s ease',
                            '&:hover': !isDragging ? { 
                                filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))',
                            } : {},
                        }}
                    />

                </Box>

            </Box>

            {/* Единая шкала значения */}
            <Box sx={{ mt: 2, px: 2 }}>
                
                {/* Контейнер шкалы */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mt: 1,
                    position: 'relative'
                }}>
                    {/* Единая шкала */}
                    <Box sx={{ flexGrow: 1, position: 'relative' }}>
                        <Box sx={{
                            height: 16,
                            borderRadius: '8px',
                            backgroundColor: '#E0E0E0',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid #BDBDBD'
                        }}>
                            {/* Заполнение шкалы слева направо */}
                            <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${localValue * 100}%`,
                                backgroundColor: '#4CAF50',
                                transition: 'width 0.1s ease',
                                borderRadius: localValue === 1 ? '8px' : '8px 0 0 8px'
                            }} />
                        </Box>
                        
                        {/* Метки шкалы */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            mt: 0.5
                        }}>
                            <Typography variant="caption" color="#000000" fontWeight="bold" fontSize='1rem'>
                                Я никогда не перерабатываю
                            </Typography>
                            <Typography variant="caption" color="#000000" fontWeight="bold" fontSize='1rem'>
                                Когда требуется, я работаю до изнеможения
                            </Typography>
                        </Box>
                    </Box>

                </Box>

            </Box>

        </Paper>
    );
};

export default TimeCostsQuestion;