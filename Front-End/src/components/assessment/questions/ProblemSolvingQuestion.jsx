import React, { useState, useCallback, useRef, useEffect } from 'react'; 
import { 
    Typography, 
    Box, 
    Paper
} from '@mui/material'; 

const ProblemSolvingQuestion = ({ question, currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 1);
    const [images, setImages] = useState([]);
    const [draggingImage, setDraggingImage] = useState(null);
    const [isScattered, setIsScattered] = useState(false);
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 500, height: 400 });

    const totalImages = 6;
    const scatterDistance = 70;
    const imageSize = 350;

    const imagePaths = Array.from({ length: totalImages }, (_, i) => 
        `/questionsAssets/ProblemSolvingQuestion/${(i + 1).toString().padStart(4, '0')}.png`
    );

    const generateUniformTrajectories = useCallback((centerX, centerY) => {
        const trajectories = [];
        const angleStep = (2 * Math.PI) / totalImages;
        
        for (let i = 0; i < totalImages; i++) {
            const baseAngle = i * angleStep;
            const randomOffset = (Math.random() - 0.5) * 0.3;
            const angle = baseAngle + randomOffset;
            
            const distance = scatterDistance * (0.9 + Math.random() * 0.2);
            
            trajectories.push({
                angle,
                distance,
                targetX: centerX + Math.cos(angle) * distance,
                targetY: centerY + Math.sin(angle) * distance,
                rotation: (Math.random() - 0.5) * 60,
                scale: 0.7 + Math.random() * 0.2
            });
        }
        
        return trajectories;
    }, [scatterDistance, totalImages]);

    useEffect(() => {
        const updateContainerSize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setContainerSize({ width, height });
            }
        };

        updateContainerSize();
        window.addEventListener('resize', updateContainerSize);
        
        return () => {
            window.removeEventListener('resize', updateContainerSize);
        };
    }, []);

    useEffect(() => {
        if (containerSize.width === 0 || containerSize.height === 0) return;

        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;

        const trajectories = generateUniformTrajectories(centerX, centerY);

        const initialImages = Array.from({ length: totalImages }, (_, index) => {
            const trajectory = trajectories[index];
            return {
                id: index,
                x: centerX,
                y: centerY,
                startX: centerX,
                startY: centerY,
                targetX: trajectory.targetX,
                targetY: trajectory.targetY,
                directionX: Math.cos(trajectory.angle),
                directionY: Math.sin(trajectory.angle),
                maxRotation: trajectory.rotation,
                maxScale: trajectory.scale,
                rotation: 0,
                scale: 1,
                isDragged: false,
                path: imagePaths[index]
            };
        });
        setImages(initialImages);
    }, [containerSize, generateUniformTrajectories]);

    useEffect(() => {
        if (images.length === 0) return;

        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;

        let totalDistance = 0;
        let movedImages = 0;

        images.forEach(image => {
            const distance = Math.sqrt(
                Math.pow(image.x - centerX, 2) + Math.pow(image.y - centerY, 2)
            );
            totalDistance += distance;
            if (distance > 5) movedImages++;
        });

        const averageDistance = totalDistance / images.length;
        
        const newValue = Math.max(0, Math.min(1, 1 - (averageDistance / scatterDistance)));
        
        setLocalValue(newValue);
        onAnswer(newValue);
        
        setIsScattered(movedImages > totalImages / 2);
    }, [images, onAnswer, containerSize, scatterDistance]);

    const handleImageMouseDown = useCallback((imageId, event) => {
        setDraggingImage(imageId);
        event.preventDefault();
    }, []);

    const handleMouseMove = useCallback((event) => {
        if (draggingImage === null || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        if (!clientX || !clientY) return;

        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;

        let dragX = clientX - rect.left;
        let dragY = clientY - rect.top;

        dragX = Math.max(imageSize/2, Math.min(containerSize.width - imageSize/2, dragX));
        dragY = Math.max(imageSize/2, Math.min(containerSize.height - imageSize/2, dragY));

        const dragDistance = Math.sqrt(
            Math.pow(dragX - centerX, 2) + Math.pow(dragY - centerY, 2)
        );
        
        const deadZone = 15;
        let progress = 0;
        
        if (dragDistance > deadZone) {
            progress = Math.min(1, (dragDistance - deadZone) / (scatterDistance - deadZone));
        }

        setImages(prevImages => 
            prevImages.map(image => {
                let newX, newY;
                
                if (progress === 0) {
                    newX = centerX;
                    newY = centerY;
                } else {
                    newX = centerX + (image.targetX - centerX) * progress;
                    newY = centerY + (image.targetY - centerY) * progress;
                }
                
                const rotation = progress * image.maxRotation;
                const scale = 1 - progress * (1 - image.maxScale);
                
                const boundedX = Math.max(imageSize/2, Math.min(containerSize.width - imageSize/2, newX));
                const boundedY = Math.max(imageSize/2, Math.min(containerSize.height - imageSize/2, newY));
                
                return { 
                    ...image, 
                    x: boundedX, 
                    y: boundedY,
                    rotation,
                    scale,
                    isDragged: image.id === draggingImage
                };
            })
        );
    }, [draggingImage, containerSize, scatterDistance, imageSize]);

    const handleMouseUp = useCallback(() => {
        setDraggingImage(null);
    }, []);

    useEffect(() => {
        if (draggingImage !== null) {
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
    }, [draggingImage, handleMouseMove, handleMouseUp]);

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                border: '2px solid #E0EFE5',
                background: ' #FFFFFF',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1,
                width: '100%',
                height: '100%',
            }}>

                {/* Основной контент с шкалой и областью объектов */}
                <Box sx={{ 
                    display: 'flex', 
                    width: '100%', 
                    height: '100%',
                    flex: 1,
                    gap: 3,
                    alignItems: 'stretch'
                }}>
                    
                    {/* Вертикальная шкала слева - УВЕЛИЧЕННАЯ И ЯРКАЯ */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        width: 100, // Увеличил ширину
                        height: '100%',
                        minHeight: '500px',
                        borderRadius: 2,
                        
                    }}>
                        {/* Верхняя надпись */}
                        <Typography 
                            variant="body1" // Увеличил размер шрифта
                            color="text.primary" 
                            sx={{ 
                                fontWeight: 'bold',
                                mb: 2,
                                textAlign: 'center',
                                fontSize: '14px'
                            }}
                        >
                            Я быстро сдаюсь
                        </Typography>
                        
                        {/* Контейнер для шкалы - УВЕЛИЧЕННЫЙ */}
                        <Box sx={{ 
                            position: 'relative',
                            width: 25, // Увеличил ширину
                            height: '500px',
                            backgroundColor: '#e9ecef',
                            borderRadius: 20, // Увеличил скругление
                            overflow: 'hidden',
                            flex: 1,
                            border: '2px solid #adb5bd' // Добавил границу
                        }}>
                            {/* Заполненная часть шкалы */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${100 - localValue * 100}%`,
                                    backgroundColor: '#4CAF50',
                                    borderRadius: '20px 20px 0 0',
                                    transition: 'height 0.3s ease',
                                }}
                            />
                        </Box>
                        
                        {/* Нижняя надпись */}
                        <Typography 
                            variant="body1" // Увеличил размер шрифта
                            color="text.primary" 
                            sx={{ 
                                fontWeight: 'bold',
                                mt: 2,
                                textAlign: 'center',
                                fontSize: '14px'
                            }}
                        >
                            Я иду до конца
                        </Typography>
                    </Box>

                    {/* Контейнер с изображениями */}
                    <Box
                        ref={containerRef}
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            minHeight: '500px',
                            overflow: 'hidden',
                            cursor: draggingImage !== null ? 'grabbing' : 'default',
                            flex: 1,
                        }}
                    >
                        {images.map((image) => (
                            <Box
                                key={image.id}
                                sx={{
                                    position: 'absolute',
                                    left: image.x - imageSize/2,
                                    top: image.y - imageSize/2,
                                    width: `${imageSize}px`,
                                    height: `${imageSize}px`,
                                    cursor: draggingImage !== null ? 'grabbing' : 'grab',
                                    transform: `rotate(${image.rotation}deg) scale(${image.scale})`,
                                    transition: draggingImage !== null ? 'all 0.1s ease' : 'all 0.5s ease',
                                    zIndex: draggingImage === image.id ? 10 : 1,
                                }}
                                onMouseDown={(e) => handleImageMouseDown(image.id, e)}
                                onTouchStart={(e) => handleImageMouseDown(image.id, e)}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'transparent',
                                    }}
                                >
                                    <img
                                        src={image.path}
                                        alt={`Объект ${image.id + 1}`}
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
                        ))}
                    </Box>
                </Box>

            </Box>
        </Paper>
    );
};

export default ProblemSolvingQuestion;