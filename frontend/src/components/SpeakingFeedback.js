import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  LinearProgress
} from '@mui/material';

const SpeakingFeedback = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Speaking Analysis
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Overall Score: {feedback.overallScore.toFixed(1)}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={feedback.overallScore} 
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Word Analysis:
      </Typography>
      <List>
        {feedback.scores.map((score, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={score.word}
              secondary={
                <Box>
                  <Typography variant="body2">
                    Accuracy: {score.accuracy.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">
                    Stress: {score.stress.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">
                    Intonation: {score.intonation.toFixed(1)}%
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle1" gutterBottom>
        Suggestions for Improvement:
      </Typography>
      <List>
        {feedback.scores[0].suggestions.map((suggestion, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${index + 1}. ${suggestion}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SpeakingFeedback; 