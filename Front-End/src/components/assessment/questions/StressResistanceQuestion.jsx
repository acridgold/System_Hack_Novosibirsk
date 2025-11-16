import React, { useState, useCallback, useRef, useEffect } from 'react'; 
import { 
    Typography, 
    Box, 
    Paper 
} from '@mui/material'; 

const StressResistanceQuestion = ({ currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 0);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const backgroundImage = "/questionsAssets/StressResistanceQuestion/woman.png";
    const objectImage = "/questionsAssets/StressResistanceQuestion/stress.png";

    const getObjectPosition = (value) => {
        const minY = 100;
        const maxY = 0;
        return minY + (maxY - minY) * value;
    };

    const objectY = getObjectPosition(localValue);

    const handleMouseDown = useCallback((event) => {
        setIsDragging(true);
        updateValueFromEvent(event);
        event.preventDefault();
    }, []);

    const updateValueFromEvent = useCallback((event) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        if (!clientY) return;

        const relativeY = clientY - rect.top;
        const percentage = Math.max(0, Math.min(1, 1 - (relativeY / rect.height)));
        
        setLocalValue(percentage);
        onAnswer(percentage);
    }, [onAnswer]);

    const handleMouseMove = useCallback((event) => {
        if (!isDragging) return;
        updateValueFromEvent(event);
    }, [isDragging, updateValueFromEvent]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleContainerClick = useCallback((event) => {
        updateValueFromEvent(event);
    }, [updateValueFromEvent]);

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

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                border: '2px solid #E0EFE5',
                background: '#FFFFFF',
                position: 'relative',
                overflow: 'visible',
                minHeight: '700px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                marginTop: '80px',
            }}>
                <Box
                    ref={containerRef}
                    sx={{
                        position: 'relative',
                        width: '400px',
                        height: '400px',
                        cursor: 'pointer',
                        overflow: 'visible',
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '40px',
                    }}
                    onClick={handleContainerClick}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '60%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '400px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'visible'
                        }}
                    >
                        <img
                            src={backgroundImage}
                            alt="Фон"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block',
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: objectY,
                            left: '30%',
                            transform: 'translate(-50%, -50%)',
                            width: '80px',
                            height: '80px',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            zIndex: 10,
                            transition: isDragging ? 'none' : 'top 0.3s ease',
                            overflow: 'visible'
                        }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                    >
                        <img
                            src={objectImage}
                            alt="Объект"
                            style={{
                                width: '250px',
                                height: 'auto',
                                objectFit: 'contain',
                                display: 'block',
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </Box>
                </Box>
                
                <Box sx={{ 
                    width: '600px', 
                    mt: 4,
                    marginBottom: '40px',
                }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="caption" color="#000000ff" fontWeight="bold" fontSize='1.1rem'>
                            Высокая тревога
                        </Typography>
                        <Typography variant="caption" color="#000000ff" fontWeight="bold" fontSize='1.1rem'>
                            Устойчивость
                        </Typography>
                    </Box>
                    <Box 
                        sx={{ 
                            width: '100%', 
                            height: '8px', 
                            backgroundColor: '#E0E0E0',
                            border: '1px solid #BDBDBD',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                width: `${localValue * 100}%`,
                                height: '100%',
                                background: '#4CAF50',
                                borderRadius: '4px',
                                transition: 'width 0.3s ease',
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default StressResistanceQuestion;