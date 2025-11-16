import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
    Typography, 
    Box, 
    Paper
} from '@mui/material';
import { Star } from '@mui/icons-material';

const GivingUpQuestion = ({ currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 0.5);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const dragStartValue = useRef(0);

    const START_X = 170;
    const START_Y = 450;
    const END_X = 500;
    const END_Y = 80;
    const MIN_LENGTH = 100;
    const MAX_LENGTH = 450;

    const getLadderDimensions = (value) => {
        const vectorX = END_X - START_X;
        const vectorY = END_Y - START_Y;
        
        const totalLength = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
        const currentLength = MIN_LENGTH + (MAX_LENGTH - MIN_LENGTH) * value;
        const effectiveLength = Math.min(currentLength, totalLength);
        const ratio = effectiveLength / totalLength;
        
        const topX = START_X + vectorX * ratio;
        const topY = START_Y + vectorY * ratio;
        const angle = Math.atan2(vectorY, -vectorX) * (180 / Math.PI);
        
        return {
            height: effectiveLength,
            startX: START_X,
            startY: START_Y,
            endX: END_X,
            endY: END_Y,
            angle,
            topX,
            topY,
            vectorX,
            vectorY,
            totalLength
        };
    };

    const dimensions = getLadderDimensions(localValue);

    const handleMouseDown = useCallback((event) => {
        setIsDragging(true);
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        if (clientX && clientY) {
            dragStartPos.current = { x: clientX, y: clientY };
            dragStartValue.current = localValue;
        }
        
        event.preventDefault();
    }, [localValue]);

    const handleMouseMove = useCallback((event) => {
        if (!isDragging || !containerRef.current) return;

        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        if (!clientX || !clientY) return;

        const deltaX = clientX - dragStartPos.current.x;
        const deltaY = clientY - dragStartPos.current.y;

        const ladderDirX = dimensions.vectorX / dimensions.totalLength;
        const ladderDirY = dimensions.vectorY / dimensions.totalLength;

        const movementAlongLadder = deltaX * ladderDirX + deltaY * ladderDirY;
        const sensitivity = 0.005;
        const newValue = Math.max(0, Math.min(1, dragStartValue.current + movementAlongLadder * sensitivity));
        
        setLocalValue(newValue);
        onAnswer(newValue);

        dragStartPos.current = { x: clientX, y: clientY };
        dragStartValue.current = newValue;

    }, [isDragging, onAnswer, dimensions.vectorX, dimensions.vectorY, dimensions.totalLength]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        const handleGlobalMouseMove = (event) => {
            handleMouseMove(event);
        };

        const handleGlobalMouseUp = () => {
            handleMouseUp();
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
            document.addEventListener('touchmove', handleGlobalMouseMove);
            document.addEventListener('touchend', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('touchmove', handleGlobalMouseMove);
            document.removeEventListener('touchend', handleGlobalMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const getStepCount = (length) => {
        return Math.max(3, Math.floor(length / 20));
    };

    const stepCount = getStepCount(dimensions.height);

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
            }}
        >
            <Box 
                ref={containerRef}
                sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '500px',
                    borderRadius: 2,
                    overflow: 'hidden',
                    userSelect: 'none',
                    touchAction: 'none',
                    display: 'flex',
                }}
            >
                <Box
                    sx={{
                        width: '80px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px 10px',
                        zIndex: 15,
                    }}
                >
                    <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        width: '100%', 
                        my: 2,
                    }}>
                        <Box sx={{ 
                            flex: 1, 
                            width: '24px', 
                            my: 1,
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: '#E0E0E0',
                            border: '1px solid #BDBDBD',
                            borderRadius: '12px',
                        }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: `${localValue * 100}%`,
                                    backgroundColor: '#4CAF50',
                                    borderRadius: '12px',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ flex: 1, position: 'relative' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: dimensions.endY - 40,
                            left: dimensions.endX - 330,
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            padding: '8px 12px',
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            color='#000000'
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            Я преодолею любые трудности
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: dimensions.endY,
                            left: dimensions.endX,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 11,
                        }}
                    >
                        <Star
                            sx={{
                                fontSize: 70,
                                color: localValue > 0.8 ? '#4CAF50' : '#909090ff',
                                filter: localValue > 0.8 ? 'drop-shadow(0 0 8px #4CAF50)' : 'none',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: dimensions.startY + 20,
                            left: dimensions.startX + 40,
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            padding: '8px 12px',
                        }}
                    >
                        <Typography 
                            fontWeight="bold" 
                            color="#000000ff"
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            У меня нет уверенности в своих силах
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: dimensions.startY,
                            left: dimensions.startX,
                            width: '60px',
                            height: `${dimensions.height}px`,
                            transform: `rotate(${dimensions.angle}deg)`,
                            transformOrigin: 'top left',
                            zIndex: 5,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '0px',
                                width: '6px',
                                height: '100%',
                                background: '#4CAF50',
                                borderRadius: '3px',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                right: '0px',
                                width: '6px',
                                height: '100%',
                                background: '#4CAF50',
                                borderRadius: '3px',
                            }}
                        />

                        {Array.from({ length: stepCount }, (_, i) => {
                            const stepPosition = (i / (stepCount - 1)) * dimensions.height;
                            return (
                                <Box
                                    key={i}
                                    sx={{
                                        position: 'absolute',
                                        left: '6px',
                                        right: '6px',
                                        top: `${stepPosition}px`,
                                        height: '4px',
                                        background: '#4CAF50',
                                        borderRadius: '2px',
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                            );
                        })}
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: dimensions.topY+50,
                            left: dimensions.topX-70,
                            transform: 'translate(-50%, -50%)',
                            width: '220px',
                            height: '220px',
                            zIndex: 20,
                            cursor: isDragging ? 'grabbing' : 'grab',
                            '&:hover': {
                                transform: 'translate(-50%, -50%) scale(1.1)',
                            },
                            transition: isDragging ? 'none' : 'all 0.2s ease',
                        }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                    >
                        <img
                            src="/questionsAssets/GivingUpQuestion/climbing.png"
                            alt="Объект на лестнице"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                borderRadius: '8px',
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default GivingUpQuestion;