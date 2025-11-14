import React, { useState, useCallback } from 'react';
import { 
    Typography, 
    Box, 
    Paper,
    Fade
} from '@mui/material';
import { Check, TrendingUp } from '@mui/icons-material';

const PerfectWorkQuestion = ({ question, currentAnswer, onAnswer }) => {
    const [localValue, setLocalValue] = useState(currentAnswer !== undefined ? currentAnswer : 0);
    const [checkedTasks, setCheckedTasks] = useState(Array(5).fill(false));
    const totalTasks = 5;

    // Преобразование количества отмеченных галочек в значение 0-5
    const checkedCountToValue = (checkedCount) => {
        return (checkedCount / totalTasks) * 5;
    };

    // Обработчик клика по задаче - переключает только одну задачу
    const handleTaskToggle = useCallback((taskIndex) => {
        const newCheckedTasks = [...checkedTasks];
        newCheckedTasks[taskIndex] = !newCheckedTasks[taskIndex];
        
        setCheckedTasks(newCheckedTasks);
        
        // Считаем количество отмеченных задач
        const checkedCount = newCheckedTasks.filter(Boolean).length;
        const newValue = checkedCountToValue(checkedCount);
        
        setLocalValue(newValue);
        onAnswer(newValue);
    }, [checkedTasks, onAnswer]);

    // Создаем массив задач на основе состояния checkedTasks
    const tasks = Array.from({ length: totalTasks }, (_, index) => ({
        id: index,
        checked: checkedTasks[index]
    }));

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                border: '2px solid #E0EFE5',
                background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >

            {/* Основной контейнер с задачами и шкалой */}
            <Box sx={{ display: 'flex', gap: 2, flex: 1, position: 'relative', zIndex: 1 }}>
                {/* Контейнер с задачами с фоновым изображением */}
                <Box
                    sx={{
                        flex: 1,
                        p: 0,
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Контейнер для задач с позиционированием поверх изображения */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            p: 2,
                            position: 'relative',
                            zIndex: 2,
                            width: '330px',
                            top: '25px'
                        }}
                    >
                        {tasks.map((task) => (
                            <Paper
                                key={task.id}
                                sx={{
                                    p: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    background: task.checked 
                                        ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(69, 160, 73, 0.9) 100%)'
                                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 245, 0.95) 100%)',
                                    border: `2px solid #4CAF50`,
                                    borderRadius: 0.5,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    minHeight: '50px',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        borderColor: '#45a049',
                                        transform: 'translateX(4px) scale(1.02)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    },
                                }}
                                onClick={() => handleTaskToggle(task.id)}
                            >
                                {/* Упрощенный текст задания - только полосочки */}
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    {/* Имитация строк текста */}
                                    <Box
                                        sx={{
                                            height: '6px',
                                            background: task.checked ? 'white' : '#4CAF50',
                                            borderRadius: '3px',
                                            width: '100%',
                                            opacity: task.checked ? 0.9 : 0.7,
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            height: '6px',
                                            background: task.checked ? 'white' : '#4CAF50',
                                            borderRadius: '3px',
                                            width: '85%',
                                            opacity: task.checked ? 0.7 : 0.5,
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            height: '6px',
                                            background: task.checked ? 'white' : '#4CAF50',
                                            borderRadius: '3px',
                                            width: '70%',
                                            opacity: task.checked ? 0.5 : 0.3,
                                        }}
                                    />
                                </Box>

                                {/* Чекбокс */}
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        border: `2px solid #4CAF50`,
                                        borderRadius: 0.5,
                                        backgroundColor: task.checked ? 'white' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    {task.checked && (
                                        <Check 
                                            sx={{ 
                                                fontSize: 36, 
                                                color: '#4CAF50',
                                                fontWeight: 'bold'
                                            }} 
                                        />
                                    )}
                                </Box>
                            </Paper>
                        ))}
                    </Box>

                    {/* Изображение clipboard под задачами */}
                    <Box
                        component="img"
                        src="/questionsAssets/PerfectWorkQuestion/clipboard.png"
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '460px',
                            zIndex: 1,
                        }}
                    />
                </Box>

                {/* Шкала прогресса */}
                <Paper
                    elevation={3}
                    sx={{
                        width: '160px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid #BDBDBD',
                        borderRadius: 2,
                        p: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                        backdropFilter: 'blur(10px)',
                        textAlign: 'center'
                    }}
                >

                    {/* Вертикальная шкала прогресса с текстом */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative',
                            width: '100%',
                        }}
                    >
                        {/* Текст вверху шкалы */}
                        <Typography 
                            variant="body2" 
                            fontWeight="bold" 
                            color="#000000ff"
                            sx={{ mb: 1 }}
                        >
                            Мне важна безупречность работы
                        </Typography>

                        {/* Шкала прогресса */}
                        <Box
                            sx={{
                                flex: 1,
                                width: '28px',
                                background: 'linear-gradient(180deg, #E0E0E0 0%, #F5F5F5 100%)',
                                borderRadius: '14px',
                                position: 'relative',
                                overflow: 'hidden',
                                border: '1px solid #BDBDBD',
                            }}
                        >
                            {/* Заполнение прогресса */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: `${(localValue / 5) * 100}%`,
                                    background: `#4CAF50`,
                                    borderRadius: '14px',
                                    transition: 'height 0.3s ease',
                                }}
                            />
                        </Box>

                        {/* Текст внизу шкалы */}
                        <Typography 
                            variant="body2" 
                            fontWeight="bold" 
                            color="#000000ff"
                            sx={{ mt: 1 }}
                        >
                            Меня устраивает любой результат
                        </Typography>
                    </Box>

                </Paper>
            </Box>
        </Paper>
    );
};

export default PerfectWorkQuestion;