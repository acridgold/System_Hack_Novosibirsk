import React from 'react';
import { Paper, Box } from '@mui/material';

const QuestionWrapper = ({ 
  children, 
  backgroundColor = '#ffffff',
  borderColor = '#E0EFE5',
  gradient,
  icon,
  pattern
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        border: `2px solid ${borderColor}`,
        background: gradient || backgroundColor,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        '&::before': pattern ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: pattern,
          opacity: 0.1,
          zIndex: 0,
        } : {},
      }}
    >
      <Box position="relative" zIndex={1} flex={1} display="flex" flexDirection="column">
        {children}
      </Box>
    </Paper>
  );
};

export default QuestionWrapper;