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
    const [dragDirection, setDragDirection] = useState(null);
    const containerRef = useRef(null);
    const objectsRef = useRef([
        { id: 1, x: 0, y: 0, baseX: 0 },
        { id: 2, x: 0, y: 0, baseX: 0 }
    ]);

    const objectSize = 350;
    const maxDistance = 300;

    const imagePaths = [
        `/questionsAssets/RelativesSupportQuestion/womanLeft.png`,
        `/questionsAssets/RelativesSupportQuestion/womanRight.png`
    ];

    useEffect(() => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const centerX = containerWidth / 2 - 150;
        const objectSpacing = 50;
        
        objectsRef.current = [
            { 
                id: 1, 
                x: centerX - objectSize/2 - objectSpacing,
                y: 0,
                baseX: centerX - objectSize/2 - objectSpacing,
                isLeft: true
            },
            { 
                id: 2, 
                x: centerX + objectSpacing,
                y: 0,
                baseX: centerX + objectSpacing,
                isLeft: false
            }
        ];
        
        setLocalValue(1);
        onAnswer(1);
    }, []);

    const handleObjectMouseDown = useCallback((objectId, event) => {
        setIsDragging(true);
        const object = objectsRef.current.find(obj => obj.id === objectId);
        setDragDirection(object.isLeft ? 'left' : 'right');
        event.preventDefault();
    }, []);

    const handleMouseMove = useCallback((event) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        
        if (!clientX) return;

        const mouseX = clientX - rect.left;
        const containerWidth = rect.width;
        const centerX = containerWidth / 2;

        let dragDistance;
        if (dragDirection === 'left') {
            dragDistance = Math.max(0, Math.min(maxDistance/2, centerX - mouseX - objectSize/2));
        } else {
            dragDistance = Math.max(0, Math.min(maxDistance/2, mouseX - centerX - objectSize/2));
        }

        const progress = dragDistance / (maxDistance / 2);
        const newValue = Math.max(0, Math.min(1, 1 - progress));

        const leftObject = objectsRef.current.find(obj => obj.isLeft);
        const rightObject = objectsRef.current.find(obj => !obj.isLeft);

        if (leftObject && rightObject) {
            leftObject.x = centerX - objectSize/2 - dragDistance;
            rightObject.x = centerX - objectSize/2 + dragDistance;
        }

        setLocalValue(newValue);
        onAnswer(newValue);
    }, [isDragging, dragDirection, onAnswer, objectSize]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragDirection(null);
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
                            <Typography variant="body2" color="#000000" fontWeight='bold'>
                                Я не чувствую поддержку
                            </Typography>
                            <Typography variant="body2" color="#000000" fontWeight='bold'>
                                Меня поддерживают близкие
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ 
                    position: 'relative',
                    width: '100%',
                    height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2
                }}>
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