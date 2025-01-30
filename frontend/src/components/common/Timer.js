import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const Timer = ({ duration, onComplete, running = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onComplete, running]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / duration) * 100;

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Time Remaining
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${minutes}:${seconds.toString().padStart(2, '0')}`}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress}
        color={
          progress > 50 ? 'success' :
          progress > 20 ? 'warning' :
          'error'
        }
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

export default Timer; 