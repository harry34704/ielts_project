import React from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useScore } from '../context/ScoreContext';

const History = () => {
  const { scores } = useScore();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Practice History
        </Typography>
        {Object.entries(scores).map(([type, typeScores]) => (
          <Box key={type} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {type.charAt(0).toUpperCase() + type.slice(1)} Scores
            </Typography>
            <List>
              {typeScores.map((score, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Score: ${score.score}`}
                    secondary={new Date(score.date).toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default History; 