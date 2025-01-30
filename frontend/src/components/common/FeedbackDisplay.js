import React from 'react';
import { 
  Box, Typography, LinearProgress, Grid, Card, 
  CardContent, List, ListItem, ListItemIcon, 
  ListItemText, Chip 
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Info,
  Warning
} from '@mui/icons-material';

const FeedbackDisplay = ({ feedback, type }) => {
  const renderScoreIndicator = (score) => {
    let color = 'error';
    if (score >= 80) color = 'success';
    else if (score >= 60) color = 'warning';
    
    return (
      <LinearProgress
        variant="determinate"
        value={score}
        color={color}
        sx={{ height: 10, borderRadius: 5 }}
      />
    );
  };

  const renderDetailedFeedback = () => {
    if (!feedback.detailedAnalysis) return null;

    switch (type) {
      case 'reading':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Word Accuracy
              </Typography>
              {Object.entries(feedback.detailedAnalysis.wordAccuracy).map(([word, correct]) => (
                <Chip
                  key={word}
                  label={word}
                  color={correct ? 'success' : 'error'}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Grid>
          </Grid>
        );

      case 'writing':
        return (
          <List>
            {feedback.detailedAnalysis.grammarErrors.map((error, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Error color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary={error.message}
                  secondary={error.suggestion}
                />
              </ListItem>
            ))}
          </List>
        );

      case 'speaking':
        return (
          <Grid container spacing={2}>
            {Object.entries(feedback.detailedAnalysis.pronunciationDetails).map(([word, score]) => (
              <Grid item xs={6} md={4} key={word}>
                <Typography variant="body2" gutterBottom>
                  {word}
                </Typography>
                {renderScoreIndicator(score)}
              </Grid>
            ))}
          </Grid>
        );

      default:
        return null;
    }
  };

  const renderImprovements = () => {
    if (!feedback.improvements?.length) return null;

    return (
      <List>
        {feedback.improvements.map((improvement, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <Info color="primary" />
            </ListItemIcon>
            <ListItemText primary={improvement} />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Performance Analysis
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(feedback.scores || {}).map(([criterion, score]) => (
            <Grid item xs={6} md={3} key={criterion}>
              <Typography variant="body2" gutterBottom>
                {criterion.charAt(0).toUpperCase() + criterion.slice(1)}
              </Typography>
              {renderScoreIndicator(score)}
              <Typography variant="body2" sx={{ mt: 1 }}>
                {score.toFixed(1)}%
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Detailed Analysis
          </Typography>
          {renderDetailedFeedback()}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Suggested Improvements
          </Typography>
          {renderImprovements()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay; 