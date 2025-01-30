import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

const TaskCard = ({ title, description, level, timeLimit, onClick }) => {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.02)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={`Level: ${level}`}
            size="small"
            color={
              level === 'beginner' ? 'success' :
              level === 'intermediate' ? 'warning' :
              'error'
            }
          />
          {timeLimit && (
            <Chip 
              label={`${timeLimit} minutes`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard; 