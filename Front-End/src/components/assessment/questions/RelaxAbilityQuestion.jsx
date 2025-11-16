import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
    Typography, 
    Box, 
    Paper,
    Fade
} from '@mui/material';
import { TrendingFlat, ArrowLeft, ArrowRight } from '@mui/icons-material';

const RelaxAbilityQuestion = ({ question, currentAnswer, onAnswer }) => {
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

    const totalFrames = 3; // Количество кадров анимации
    const minValue = 0;
    const maxValue = 1;

    // Генерация путей к кадрам анимации
    const frames = Array.from({ length: totalFrames }, (_, i) => 
        `/questionsAssets/RelaxAbilityQuestion/animation/${(i + 1).toString().padStart(4, '0')}.png`
    );

    // Преобразование значения 0-1 в кадр анимации
    const valueToFrame = (value) => {
        return Math.min(Math.floor(value * totalFrames), totalFrames - 1);
    };

    const currentFrame = valueToFrame(localValue);

    // Предзагрузка изображений
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
                        console.warn(`Failed to load frame: ${framePath}`);
                        // Создаем fallback градиент вместо изображения
                        setLoadedFrames(prev => ({ ...prev, [index]: 'fallback' }));
                        resolve();
                    };
                    img.src = framePath;
                });
            });

            // Предзагрузка изображений для крайних позиций
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

    // Вычисление позиции объекта по горизонтали с учетом границ
    const getObjectPositionX = (value, containerWidth, objectWidth) => {
        const percentage = value * 100;
        // Ограничиваем позицию так, чтобы объект не выходил за границы контейнера
        const objectWidthPercent = (objectWidth / containerWidth) * 100 / 2;
        const boundedPercentage = Math.max(0 + objectWidthPercent, Math.min(100 - objectWidthPercent, percentage));
        return `${boundedPercentage}%`;
    };

    // Вычисление вертикального смещения для дуги (опущена ниже)
    const getArcOffset = (value) => {
        // Опускаем кривую ниже - уменьшаем амплитуду
        return -100 * Math.sin(value * Math.PI) - 20; // Опущено ниже
    };

    // Получение точек для кривой Безье (опущена ниже)
    const getCurvePoints = (containerWidth = 400) => {
        const startX = containerWidth * 0.1; // 10% от ширины контейнера
        const endX = containerWidth * 0.9;   // 90% от ширины контейнера
        const startY = 320; // Нижняя точка кривой (опущена ниже)
        const controlY = 80; // Верхняя контрольная точка (опущена ниже)
        const controlX = containerWidth / 2; // Центр по горизонтали
        
        return `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${startY}`;
    };

    // Расчет заполнения шкалы как в WorkLifeBalanceQuestion
    const getScaleFill = (value) => {
        if (value < 0.5) {
            // Перевес в сторону "постоянно думаю о работе" - заполняется ЛЕВАЯ часть
            return {
                left: ((0.5 - value) / 0.5) * 100, // 0-100%
                right: 0
            };
        } else if (value > 0.5) {
            // Перевес в сторону "забываю о работе" - заполняется ПРАВАЯ часть
            return {
                left: 0,
                right: ((value - 0.5) / 0.5) * 100 // 0-100%
            };
        } else {
            // Баланс - обе части пустые
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

    // Обновление позиции объекта и кривой
    useEffect(() => {
        const updatePositions = () => {
            if (containerRef.current && objectRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const containerHeight = containerRef.current.offsetHeight;
                const objectWidth = objectRef.current.offsetWidth;
                
                // Обновляем кривую
                setCurvePath(getCurvePoints(containerWidth));
                
                // Вычисляем позицию объекта с учетом границ
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

    // Обработчик начала перетаскивания
    const handleMouseDown = useCallback((event) => {
        setIsDragging(true);
        updateValueFromEvent(event);
        event.preventDefault();
    }, []);

    // Обновление значения из события с учетом границ
    const updateValueFromEvent = useCallback((event) => {
        if (!containerRef.current || !objectRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const objectRect = objectRef.current.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        
        if (!clientX) return;

        const relativeX = clientX - rect.left;
        // Учитываем половину ширины объекта для корректного позиционирования центра
        const objectHalfWidth = objectRect.width / 2;
        const adjustedX = Math.max(objectHalfWidth, Math.min(rect.width - objectHalfWidth, relativeX));
        const percentage = Math.max(0, Math.min(1, (adjustedX - objectHalfWidth) / (rect.width - objectRect.width)));
        
        const newValue = percentage;
        setLocalValue(newValue);
        onAnswer(newValue);
    }, [onAnswer]);

    // Обработчик движения
    const handleMouseMove = useCallback((event) => {
        if (!isDragging) return;
        updateValueFromEvent(event);
    }, [isDragging, updateValueFromEvent]);

    // Обработчик окончания перетаскивания
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Обработчик клика по треку
    const handleTrackClick = useCallback((event) => {
        updateValueFromEvent(event);
    }, [updateValueFromEvent]);

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

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                border: '2px solid #E0EFE5',
                background: '#FFFFFF',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '600px', // Еще уменьшена высота
                display: 'flex',
                flexDirection: 'column',
            }}
        >

            {/* Контейнер с слайдером */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0, // Убраны все промежутки
                alignItems: 'center', 
                flex: 1,
            }}>

                {/* Контейнер для трека и объекта */}
                <Box
                    ref={containerRef}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        cursor: isDragging ? 'grabbing' : 'pointer',
                        flex: 1,
                        mt: 0 // Убран отступ сверху
                    }}
                    onClick={handleTrackClick}
                >
                    {/* Полупрозрачная черная кривая линия */}
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

                    {/* Крайние позиции с изображениями - подняты еще выше */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '60px', // Поднято еще выше
                            left: '2%',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {/* Изображение для позиции A */}
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
                            bottom: '60px', // Поднято еще выше
                            right: '2%',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {/* Изображение для позиции B */}
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

                    {/* Перемещаемый объект */}
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
                            // Загрузка
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
                            // Анимированный объект
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
                                        // Fallback когда изображения не загружены
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

                {/* Шкала - поднята вплотную к объектам */}
                <Box sx={{ 
                    mt: 0, // Убран отступ сверху
                    px: 2, 
                    width: '100%', 
                    maxWidth: '600px', 
                    mb: 5 // Уменьшен отступ снизу
                }}>
                    
                    {/* Контейнер шкалы */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        mt: 0, // Убран отступ сверху
                        position: 'relative'
                    }}>
                        {/* Левая часть шкалы (Постоянно думаю о работе) */}
                        <Box sx={{ flexGrow: 1, position: 'relative' }}>
                            <Box sx={{
                                height: 12,
                                borderRadius: '8px 0 0 8px',
                                backgroundColor: '#E0E0E0',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Заполнение левой части */}
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

                        {/* Центральный индикатор баланса */}
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

                        {/* Правая часть шкалы (Забываю о работе) */}
                        <Box sx={{ flexGrow: 1, position: 'relative' }}>
                            <Box sx={{
                                height: 12,
                                borderRadius: '0 8px 8px 0',
                                backgroundColor: '#E0E0E0',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Заполнение правой части */}
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