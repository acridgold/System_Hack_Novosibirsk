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
    const containerRef = useRef(null);

    const totalObjects = 6;
    const objectSize = 100;
    const maxArrowLength = 350;
    const minArrowLength = 30;

    const imagePaths = Array.from({ length: totalObjects }, (_, i) => 
        `/questionsAssets/AchievementAssessmentQuestion/${(i + 1).toString().padStart(4, '0')}.png`
    );

    const [shelfObjects, setShelfObjects] = useState(
        Array.from({ length: totalObjects }, (_, index) => ({
            id: index,
            visible: false,
            opacity: 0,
            shelf: index < 3 ? 'top' : 'bottom',
            position: index % 3,
            path: imagePaths[index]
        }))
    );

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

    const handleArrowMouseDown = useCallback((event) => {
        setIsDragging(true);
        event.preventDefault();
    }, []);

    const handleMouseMove = useCallback((event) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        
        if (!clientX) return;

        const containerLeft = rect.left;
        const mouseX = clientX;
        
        const maxDragDistance = rect.width - 100;
        const dragDistance = Math.max(0, Math.min(maxDragDistance, mouseX - containerLeft));
        
        const progress = dragDistance / maxDragDistance;
        const newValue = Math.max(0, Math.min(1, progress));
        
        setLocalValue(newValue);
        onAnswer(newValue);
    }, [isDragging, onAnswer]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
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

    const arrowLength = minArrowLength + (maxArrowLength - minArrowLength) * localValue;
    const arrowCurve = 60 * localValue;

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
                <Box sx={{ mb: 3, textAlign: 'center', width: '100%' }}>
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

                <Box sx={{ 
                    width: '100%', 
                    height: '350px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    mb: 3
                }}>
                    <Box sx={{ 
                        position: 'relative',
                        height: '160px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }}>
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

                    <Box sx={{ 
                        position: 'relative',
                        height: '160px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        mt: 2
                    }}>
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

                <Box sx={{ 
                    position: 'relative',
                    width: '100%',
                    height: '100px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
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
                        <path
                            d={`M 30,50 
                                Q ${30 + arrowCurve},50 ${30 + arrowLength},50`}
                            stroke="#e0e0e0"
                            strokeWidth="10"
                            fill="none"
                            strokeLinecap="round"
                        />
                        
                        <path
                            d={`M 30,50 
                                Q ${30 + arrowCurve},50 ${30 + arrowLength},50`}
                            stroke="#4CAF50"
                            strokeWidth="10"
                            fill="none"
                            strokeLinecap="round"
                        />
                        
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