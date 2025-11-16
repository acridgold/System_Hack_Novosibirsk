import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
    Typography, 
    Box, 
    Paper,
    Fade
} from '@mui/material';
import { TrendingFlat } from '@mui/icons-material';

const RelaxAbilityQuestion = ({ currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 0.5);
    const [isDragging, setIsDragging] = useState(false);
    const [loadedFrames, setLoadedFrames] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [edgeImagesLoaded, setEdgeImagesLoaded] = useState({
        work: false,
        relax: false
    });
    const containerRef = useRef(null);
    const objectRef = useRef(null);

    const totalFrames = 3;
    const frames = Array.from({ length: totalFrames }, (_, i) => 
        `/questionsAssets/RelaxAbilityQuestion/animation/${(i + 1).toString().padStart(4, '0')}.png`
    );

    const valueToFrame = (value) => {
        return Math.min(Math.floor(value * totalFrames), totalFrames - 1);
    };

    const currentFrame = valueToFrame(localValue);

    useEffect(() => {
        const loadImages = async () => {
            setIsLoading(true);
            const loadPromises = frames.map((framePath, index) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        setLoadedFrames(prev => ({ ...prev, [index]: framePath }));
                        resolve();
                    };
                    img.onerror = () => {
                        setLoadedFrames(prev => ({ ...prev, [index]: 'fallback' }));
                        resolve();
                    };
                    img.src = framePath;
                });
            });

            const workImg = new Image();
            workImg.onload = () => setEdgeImagesLoaded(prev => ({ ...prev, work: true }));
            workImg.src = "/questionsAssets/RelaxAbilityQuestion/work_pic.png";

            const relaxImg = new Image();
            relaxImg.onload = () => setEdgeImagesLoaded(prev => ({ ...prev, relax: true }));
            relaxImg.src = "/questionsAssets/RelaxAbilityQuestion/relax_pic.png";

            await Promise.all(loadPromises);
            setIsLoading(false);
        };

        loadImages();
    }, []);

    const getObjectPositionX = (value, containerWidth, objectWidth) => {
        const percentage = value * 100;
        const objectWidthPercent = (objectWidth / containerWidth) * 100 / 2;
        const boundedPercentage = Math.max(0 + objectWidthPercent, Math.min(100 - objectWidthPercent, percentage));
        return `${boundedPercentage}%`;
    };

    const getArcOffset = (value) => {
        return -100 * Math.sin(value * Math.PI) - 20;
    };

    const getCurvePoints = (containerWidth = 400) => {
        const startX = containerWidth * 0.1;
        const endX = containerWidth * 0.9;
        const startY = 320;
        const controlY = 80;
        const controlX = containerWidth / 2;
        
        return `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${startY}`;
    };

    const getScaleFill = (value) => {
        if (value < 0.5) {
            return {
                left: ((0.5 - value) / 0.5) * 100,
                right: 0
            };
        } else if (value > 0.5) {
            return {
                left: 0,
                right: ((value - 0.5) / 0.5) * 100
            };
        } else {
            return {
                left: 0,
                right: 0
            };
        }
    };

    const [objectPosition, setObjectPosition] = useState({
        x: '50%',
        y: '50%'
    });
    const [curvePath, setCurvePath] = useState('');
    const scaleFill = getScaleFill(localValue);

    useEffect(() => {
        const updatePositions = () => {
            if (containerRef.current && objectRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const objectWidth = objectRef.current.offsetWidth;
                
                setCurvePath(getCurvePoints(containerWidth));
                
                const xPosition = getObjectPositionX(localValue, containerWidth, objectWidth);
                const arcOffset = getArcOffset(localValue);
                const yPosition = `calc(50% + ${arcOffset}px)`;
                
                setObjectPosition({
                    x: xPosition,
                    y: yPosition
                });
            }
        };

        updatePositions();
        window.addEventListener('resize', updatePositions);
        
        return () => {
            window.removeEventListener('resize', updatePositions);
        };
    }, [localValue]);

    const handleMouseDown = useCallback((event) => {
        setIsDragging(true);
        updateValueFromEvent(event);
        event.preventDefault();
    }, []);

    const updateValueFromEvent = useCallback((event) => {
        if (!containerRef.current || !objectRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const objectRect = objectRef.current.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        
        if (!clientX) return;

        const relativeX = clientX - rect.left;
        const objectHalfWidth = objectRect.width / 2;
        const adjustedX = Math.max(objectHalfWidth, Math.min(rect.width - objectHalfWidth, relativeX));
        const percentage = Math.max(0, Math.min(1, (adjustedX - objectHalfWidth) / (rect.width - objectRect.width)));
        
        const newValue = percentage;
        setLocalValue(newValue);
        onAnswer(newValue);
    }, [onAnswer]);

    const handleMouseMove = useCallback((event) => {
        if (!isDragging) return;
        updateValueFromEvent(event);
    }, [isDragging, updateValueFromEvent]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleTrackClick = useCallback((event) => {
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
                overflow: 'hidden',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0,
                alignItems: 'center', 
                flex: 1,
            }}>
                <Box
                    ref={containerRef}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        cursor: isDragging ? 'grabbing' : 'pointer',
                        flex: 1,
                        mt: 0
                    }}
                    onClick={handleTrackClick}
                >
                    <svg
                        width="100%"
                        height="100%"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none',
                        }}
                    >
                        <path
                            d={curvePath}
                            stroke="rgba(0, 0, 0, 0.3)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '60px',
                            left: '2%',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: '180px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'transparent',
                            }}
                        >
                            {edgeImagesLoaded.work ? (
                                <img 
                                    src="/questionsAssets/RelaxAbilityQuestion/work_pic.png" 
                                    alt="Работа"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <TrendingFlat sx={{ color: '#757575', fontSize: 24 }} />
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '60px',
                            right: '2%',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: '220px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'transparent',
                            }}
                        >
                            {edgeImagesLoaded.relax ? (
                                <img 
                                    src="/questionsAssets/RelaxAbilityQuestion/relax_pic.png" 
                                    alt="Отдых"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <TrendingFlat sx={{ color: '#757575', fontSize: 24 }} />
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Box
                        ref={objectRef}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                        sx={{
                            position: 'absolute',
                            top: objectPosition.y,
                            left: objectPosition.x,
                            transform: 'translate(-50%, -50%)',
                            width: '150px',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            transition: isDragging ? 'none' : 'all 0.1s ease',
                            zIndex: 10,
                            '&:hover': {
                                transform: 'translate(-50%, -50%) scale(1.05)',
                            },
                        }}
                    >
                        {isLoading ? (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <TrendingFlat sx={{ color: '#757575', fontSize: 32 }} />
                            </Box>
                        ) : (
                            <Fade in={!isLoading} timeout={300}>
                                <Box
                                    sx={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {loadedFrames[currentFrame] && loadedFrames[currentFrame] !== 'fallback' ? (
                                        <img
                                            src={loadedFrames[currentFrame]}
                                            alt={`Кадр анимации ${currentFrame + 1}`}
                                            style={{
                                                width: '100%',
                                                objectFit: 'contain',
                                                display: 'block',
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                                color: 'white',
                                                borderRadius: '12px',
                                            }}
                                        >
                                            <TrendingFlat sx={{ fontSize: 24, mb: 0.5 }} />
                                            <Typography variant="caption" fontWeight="bold">
                                                {Math.round(localValue * 100)}%
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Fade>
                        )}
                    </Box>
                </Box>

                <Box sx={{ 
                    mt: 0,
                    px: 2, 
                    width: '100%', 
                    maxWidth: '600px', 
                    mb: 5
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        mt: 0,
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
                                    transition: isDragging ? 'none' : 'width 0.1s ease',
                                    borderRadius: scaleFill.left === 100 ? '8px 0 0 8px' : '0'
                                }} />
                            </Box>
                            <Typography variant="caption" color="#000000" fontWeight="bold" fontSize="1.1rem" sx={{ position: 'absolute', top: '100%', left: 0, mt: 0.5 }}>
                                Я постоянно думаю о работе
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
                                    transition: isDragging ? 'none' : 'width 0.1s ease',
                                    borderRadius: scaleFill.right === 100 ? '0 8px 8px 0' : '0'
                                }} />
                            </Box>
                            <Typography variant="caption" color="#000000" fontWeight="bold" fontSize="1.1rem" sx={{ position: 'absolute', top: '100%', right: 0, mt: 0.5 }}>
                                После окончания рабочего дня я забываю о работе
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default RelaxAbilityQuestion;