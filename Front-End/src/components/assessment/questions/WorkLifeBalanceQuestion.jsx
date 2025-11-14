import React, { useState, useCallback, useRef, useEffect } from 'react'; 
import { 
    Typography, 
    Box, 
    Paper
} from '@mui/material'; 

const WorkLifeBalanceQuestion = ({ question, currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 2.5);
    const [isDragging, setIsDragging] = useState(false);
    const [activeBowl, setActiveBowl] = useState(null);
    const startYRef = useRef(0);
    const startValueRef = useRef(2.5);

    // Преобразование значения 0-5 в угол наклона коромысла (в градусах)
    const getBeamRotation = (value) => {
        // value: 0-5 -> угол: -15° до +15°
        return (value - 2.5) * -6; // 2.5 -> 0°, 0 -> -15°, 5 -> +15°
    };

    const beamRotation = getBeamRotation(localValue);

    // Обработчик начала перетаскивания
    const handleMouseDown = useCallback((bowlType, event) => {
        setIsDragging(true);
        setActiveBowl(bowlType);
        startYRef.current = event.clientY || (event.touches && event.touches[0].clientY);
        startValueRef.current = localValue;
        event.preventDefault();
    }, [localValue]);

    // Обработчик движения
    const handleMouseMove = useCallback((event) => {
        if (!isDragging) return;

        const currentY = event.clientY || (event.touches && event.touches[0].clientY);
        const deltaY = currentY - startYRef.current;
        
        // Чувствительность: 100px движения = изменение на 2.5 единицы
        const sensitivity = 100;
        const deltaValue = (deltaY / sensitivity) * 2.5;

        let newValue;
        if (activeBowl === 'work') {
            // Тянем рабочую чашу вниз -> увеличиваем значение
            newValue = startValueRef.current + deltaValue;
        } else {
            // Тянем жизненную чашу вниз -> уменьшаем значение
            newValue = startValueRef.current - deltaValue;
        }

        newValue = Math.max(0, Math.min(5, newValue));
        
        setLocalValue(newValue);
        onAnswer(newValue);
    }, [isDragging, activeBowl, onAnswer]);

    // Обработчик окончания перетаскивания
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setActiveBowl(null);
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

    // ИНВЕРТИРОВАННЫЙ расчет заполнения шкалы
    const getScaleFill = (value) => {
        if (value < 2.5) {
            // Перевес в сторону жизни - заполняется ПРАВАЯ часть
            return {
                left: 0,
                right: ((2.5 - value) / 2.5) * 100 // 0-100%
            };
        } else if (value > 2.5) {
            // Перевес в сторону работы - заполняется ЛЕВАЯ часть
            return {
                left: ((value - 2.5) / 2.5) * 100, // 0-100%
                right: 0
            };
        } else {
            // Баланс - обе части пустые
            return {
                left: 0,
                right: 0
            };
        }
    };

    const scaleFill = getScaleFill(localValue);

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

            {/* Контейнер с весами - УВЕЛИЧЕН */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, mb: 1 }}>

                {/* Весы с изображениями - УВЕЛИЧЕНЫ */}
                <Box sx={{ position: 'relative', width: '400px', height: '300px' }}>
                    
                    {/* Основание весов (неподвижная часть) - УВЕЛИЧЕНО */}
                    <Box
                        component="img"
                        src="questionsAssets/WorkLifeBalanceQuestion/scalesBase.png"
                        alt="Основание весов"
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '280px', // Увеличено
                            zIndex: 1,
                        }}
                    />

                    {/* Коромысло с чашами (вращающаяся часть) - УВЕЛИЧЕНО */}
                    <Box sx={{
                        position: 'absolute',
                        top: '60px', // Скорректировано
                        left: '50%',
                        transform: `translateX(-50%) rotate(${beamRotation}deg)`,
                        transformOrigin: 'center 35px', // Скорректировано
                        transition: 'transform 0.1s ease',
                        zIndex: 2,
                    }}>
                        
                        {/* Изображение коромысла - УВЕЛИЧЕНО */}
                        <Box
                            component="img"
                            src="questionsAssets/WorkLifeBalanceQuestion/scalesRotate.png"
                            alt="Коромысло весов"
                            sx={{
                                width: '280px', // Увеличено
                            }}
                        />

                        {/* Левая чаша - Работа - УВЕЛИЧЕНА */}
                        <Box
                            component="img"
                            src="questionsAssets/WorkLifeBalanceQuestion/leftBowl.png"
                            alt="Работа"
                            onMouseDown={(e) => handleMouseDown('work', e)}
                            onTouchStart={(e) => handleMouseDown('work', e)}
                            sx={{
                                position: 'absolute',
                                top: '55px', // Скорректировано
                                left: '-20px', // Скорректировано
                                width: '100px', // Увеличено
                                transform: `rotate(${-beamRotation}deg)`,
                                cursor: isDragging && activeBowl === 'work' ? 'grabbing' : 'grab',
                                filter: localValue > 2.5 ? `drop-shadow(0 0 5px #4CAF50)` : 'none',
                                '&:hover': !isDragging ? { filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' } : {},
                            }}
                        />

                        {/* Правая чаша - Жизнь - УВЕЛИЧЕНА */}
                        <Box
                            component="img"
                            src="questionsAssets/WorkLifeBalanceQuestion/rightBowl.png"
                            alt="Жизнь"
                            onMouseDown={(e) => handleMouseDown('life', e)}
                            onTouchStart={(e) => handleMouseDown('life', e)}
                            sx={{
                                position: 'absolute',
                                top: '55px', // Скорректировано
                                right: '-20px', // Скорректировано
                                width: '100px', // Увеличено
                                transform: `rotate(${-beamRotation}deg)`,
                                cursor: isDragging && activeBowl === 'life' ? 'grabbing' : 'grab',
                                filter: localValue < 2.5 ? `drop-shadow(0 0 5px #4CAF50)` : 'none',
                                '&:hover': !isDragging ? { filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' } : {},
                            }}
                        />

                    </Box>

                </Box>

            </Box>

            {/* Новая шкала баланса - ПОНИЖЕНА */}
            <Box sx={{ mt: 2, px: 2 }}> {/* Уменьшен отступ сверху */}
                
                {/* Контейнер шкалы */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mt: 1, // Уменьшен отступ
                    position: 'relative'
                }}>
                    {/* Левая часть шкалы (Работа) - ИНВЕРТИРОВАНА */}
                    <Box sx={{ flexGrow: 1, position: 'relative' }}>
                        <Box sx={{
                            height: 12, // Уменьшена высота
                            borderRadius: '8px 0 0 8px',
                            backgroundColor: '#E0E0E0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Заполнение левой части - ИНВЕРТИРОВАНА */}
                            <Box sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                height: '100%',
                                width: `${scaleFill.left}%`, // Теперь для работы
                                backgroundColor: '#4CAF50',
                                transition: 'width 0.1s ease',
                                borderRadius: scaleFill.left === 100 ? '8px 0 0 8px' : '0'
                            }} />
                        </Box>
                        <Typography variant="caption" color="#000000" fontWeight="bold" fontSize="1.1rem" sx={{ position: 'absolute', top: '100%', left: 0, mt: 0.5 }}>
                            Работа
                        </Typography>
                    </Box>

                    {/* Центральный индикатор баланса */}
                    <Box sx={{ 
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '60px'
                    }}>
                        <Box sx={{
                            width: 3, // Уменьшена ширина
                            height: 20, // Уменьшена высота
                            backgroundColor: '#E0E0E0',
                            borderRadius: 2,
                            mb: 0.5
                        }} />
                        <Typography variant="caption" fontWeight="bold" color={'text.secondary'}>
                            Баланс
                        </Typography>
                    </Box>

                    {/* Правая часть шкалы (Жизнь) - ИНВЕРТИРОВАНА */}
                    <Box sx={{ flexGrow: 1, position: 'relative' }}>
                        <Box sx={{
                            height: 12, // Уменьшена высота
                            borderRadius: '0 8px 8px 0',
                            backgroundColor: '#E0E0E0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Заполнение правой части - ИНВЕРТИРОВАНА */}
                            <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${scaleFill.right}%`, // Теперь для жизни
                                backgroundColor: '#4CAF50',
                                transition: 'width 0.1s ease',
                                borderRadius: scaleFill.right === 100 ? '0 8px 8px 0' : '0'
                            }} />
                        </Box>
                        <Typography variant="caption" color="#000000" fontWeight="bold" fontSize="1.1rem" sx={{ position: 'absolute', top: '100%', right: 0, mt: 0.5 }}>
                            Жизнь
                        </Typography>
                    </Box>
                </Box>

            </Box>

        </Paper>
    );
};

export default WorkLifeBalanceQuestion;