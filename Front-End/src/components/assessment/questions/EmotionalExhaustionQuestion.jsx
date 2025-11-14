import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { MoodBad, Psychology, Favorite } from '@mui/icons-material';
import QuestionWrapper from './QuestionWrapper';

const EmotionalExhaustionQuestion = ({ question, currentAnswer, onAnswer }) => {
  const options = [
    { value: 1, label: 'Никогда', icon: '😊', color: '#4CAF50' },
    { value: 2, label: 'Редко', icon: '🙂', color: '#8BC34A' },
    { value: 3, label: 'Иногда', icon: '😐', color: '#FFC107' },
    { value: 4, label: 'Часто', icon: '😔', color: '#FF9800' },
    { value: 5, label: 'Всегда', icon: '😫', color: '#F44336' },
  ];

  return (
    <QuestionWrapper
      backgroundColor="#FFF5F5"
      borderColor="#FED7D7"
      gradient="linear-gradient(135deg, #FFF5F5 0%, #FED7D7 100%)"
      pattern="radial-gradient(circle at 20% 80%, #FED7D7 0%, transparent 50%)"
    >
      {/* Заголовок с иконками */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #F56565 0%, #E53E3E 100%)',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Psychology sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#C53030">
            Эмоциональное истощение
          </Typography>
          <Typography variant="body2" color="#E53E3E">
            Оцените ваше эмоциональное состояние
          </Typography>
        </Box>
      </Box>

      {/* Вопрос */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #FED7D7',
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom color="#2D3748">
          {question.text}
        </Typography>
        {question.subtitle && (
          <Typography variant="body1" color="#718096">
            {question.subtitle}
          </Typography>
        )}
      </Paper>

      {/* Уникальные опции ответа */}
      <Box display="flex" flexDirection="column" gap={2} flex={1}>
        {options.map((option) => (
          <Paper
            key={option.value}
            elevation={currentAnswer === option.value ? 8 : 2}
            onClick={() => onAnswer(option.value)}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: `2px solid ${currentAnswer === option.value ? option.color : '#FED7D7'}`,
              background: currentAnswer === option.value 
                ? `${option.color}15` 
                : 'rgba(255, 255, 255, 0.8)',
              transform: currentAnswer === option.value ? 'scale(1.02)' : 'scale(1)',
              '&:hover': {
                transform: 'translateX(8px)',
                borderColor: option.color,
                background: `${option.color}10`,
              },
            }}
          >
            <Box
              sx={{
                fontSize: '2rem',
                width: 60,
                textAlign: 'center',
              }}
            >
              {option.icon}
            </Box>
            
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold" color={option.color}>
                {option.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getDescription(option.value)}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: option.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              {option.value}
            </Box>
          </Paper>
        ))}
      </Box>
    </QuestionWrapper>
  );
};

function getDescription(value) {
  const descriptions = {
    1: 'Полностью отсутствует',
    2: 'Очень редко появляется',
    3: 'Периодически возникает',
    4: 'Регулярно беспокоит',
    5: 'Постоянное состояние',
  };
  return descriptions[value];
}

export default EmotionalExhaustionQuestion;