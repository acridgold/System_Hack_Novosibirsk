import React, { useState, useCallback, useRef, useEffect } from 'react'; 
import { 
    Typography, 
    Box, 
    Paper
} from '@mui/material'; 

const WorkLifeBalanceQuestion = ({ question, currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 0.5);
    const [isDragging, setIsDragging] = useState(false);
    const [activeBowl, setActiveBowl] = useState(null);
    const startYRef = useRef(0);
    const startValueRef = useRef(0.5);

    // Преобразование значения 0-1 в угол наклона коромысла (в градусах)
    const getBeamRotation = (value) => {
        return (value - 0.5) * -30; // 0.5 -> 0°, 0 -> -15°, 1 -> +15°
    };

    const beamRotation = getBeamRotation(localValue);

    const handleMouseDown = useCallback((bowlType, event) => {
        setIsDragging(true);
        setActiveBowl(bowlType);
        startYRef.current = event.clientY || (event.touches && event.touches[0].clientY);
        startValueRef.current = localValue;
        event.preventDefault();
    }, [localValue]);

    const handleMouseMove = useCallback((event) => {
        if (!isDragging) return;

        const currentY = event.clientY || (event.touches && event.touches[0].clientY);
        const deltaY = currentY - startYRef.current;
        
        const sensitivity = 100;
        const deltaValue = (deltaY / sensitivity) * 0.5;

        let newValue;
        if (activeBowl === 'work') {
            newValue = startValueRef.current + deltaValue;
        } else {
            newValue = startValueRef.current - deltaValue;
        }

        newValue = Math.max(0, Math.min(1, newValue));
        
        setLocalValue(newValue);
        onAnswer(newValue);
    }, [isDragging, activeBowl, onAnswer]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setActiveBowl(null);
    }, []);

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
        if (value < 0.5) {
            return {
                left: 0,
                right: ((0.5 - value) / 0.5) * 100
            };
        } else if (value > 0.5) {
            return {
                left: ((value - 0.5) / 0.5) * 100,
                right: 0
            };
        } else {
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, mb: 1 }}>
                <Box sx={{ position: 'relative', width: '400px', height: '300px' }}>
                    
                    <Box
                        component="img"
                        src="questionsAssets/WorkLifeBalanceQuestion/scalesBase.png"
                        alt="Основание весов"
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '280px',
                            zIndex: 1,
                        }}
                    />

                    <Box sx={{
                        position: 'absolute',
                        top: '60px',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${beamRotation}deg)`,
                        transformOrigin: 'center 35px',
                        transition: 'transform 0.1s ease',
                        zIndex: 2,
                    }}>
                        
                        <Box
                            component="img"
                            src="questionsAssets/WorkLifeBalanceQuestion/scalesRotate.png"
                            alt="Коромысло весов"
                            sx={{
                                width: '280px',
                            }}
                        />

                        <Box
                            component="img"
                            src="questionsAssets/WorkLifeBalanceQuestion/leftBowl.png"
                            alt="Работа"
                            onMouseDown={(e) => handleMouseDown('work', e)}
                            onTouchStart={(e) => handleMouseDown('work', e)}
                            sx={{
                                position: 'absolute',
                                top: '55px',
                                left: '-20px',
                                width: '100px',
                                transform: `rotate(${-beamRotation}deg)`,
                                cursor: isDragging && activeBowl === 'work' ? 'grabbing' : 'grab',
                                filter: localValue > 0.5 ? `drop-shadow(0 0 5px #4CAF50)` : 'none',
                                '&:hover': !isDragging ? { filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' } : {},
                            }}
                        />

                        <Box
                            component="img"
                            src="questionsAssets/WorkLifeBalanceQuestion/rightBowl.png"
                            alt="Жизнь"
                            onMouseDown={(e) => handleMouseDown('life', e)}
                            onTouchStart={(e) => handleMouseDown('life', e)}
                            sx={{
                                position: 'absolute',
                                top: '55px',
                                right: '-20px',
                                width: '100px',
                                transform: `rotate(${-beamRotation}deg)`,
                                cursor: isDragging && activeBowl === 'life' ? 'grabbing' : 'grab',
                                filter: localValue < 0.5 ? `drop-shadow(0 0 5px #4CAF50)` : 'none',
                                '&:hover': !isDragging ? { filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' } : {},
                            }}
                        />

                    </Box>

                </Box>

            </Box>

            <Box sx={{ mt: 2, px: 2 }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mt: 1,
                    position: 'relative'
                }}>
                    <Box sx={{ flexGrow: 1, position: 'relative' }}>
                        <Box sx={{
                            height: 12,
                            borderRadius: '8px 0 0 8px',
                            backgroundColor: '#E0E0E0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                height: '100%',
                                width: `${scaleFill.left}%`,
                                backgroundColor: '#4CAF50',
                                transition: 'width 0.1s ease',
                                borderRadius: scaleFill.left === 100 ? '8px 0 0 8px' : '0'
                            }} />
                        </Box>
                        <Typography variant="caption" color="#000000" fontWeight="bold" fontSize="1.1rem" sx={{ position: 'absolute', top: '100%', left: 0, mt: 0.5 }}>
                            Работа
                        </Typography>
                    </Box>

                    <Box sx={{ 
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '60px'
                    }}>
                        <Box sx={{
                            width: 3,
                            height: 20,
                            backgroundColor: '#E0E0E0',
                            borderRadius: 2,
                            mb: 0.5
                        }} />
                        <Typography variant="caption" fontWeight="bold" color={'text.secondary'}>
                            Баланс
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, position: 'relative' }}>
                        <Box sx={{
                            height: 12,
                            borderRadius: '0 8px 8px 0',
                            backgroundColor: '#E0E0E0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${scaleFill.right}%`,
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