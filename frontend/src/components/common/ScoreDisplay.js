import React from 'react';
import { Box, Typography, LinearProgress, Grid } from '@mui/material';

const ScoreDisplay = ({ scores, title }) => {
  return (
    <Box sx={{ mb: 3 }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <Grid container spacing={2}>
        {Object.entries(scores).map(([criterion, score]) => (
          <Grid item xs={6} md={3} key={criterion}>
            <Typography variant="body2" gutterBottom>
              {criterion.charAt(0).toUpperCase() + criterion.slice(1)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={score}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {score.toFixed(1)}%
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ScoreDisplay; 