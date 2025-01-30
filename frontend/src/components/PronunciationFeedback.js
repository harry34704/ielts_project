import React from 'react';
import { 
  Box, Typography, Card, CardContent, 
  List, ListItem, ListItemText 
} from '@mui/material';

const PronunciationFeedback = ({ phonemeAnalysis, suggestions }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Pronunciation Analysis
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Phoneme Accuracy
          </Typography>
          {Object.entries(phonemeAnalysis).map(([phoneme, accuracy]) => (
            <Box key={phoneme} sx={{ mb: 1 }}>
              <Typography variant="body2">
                {phoneme}: {accuracy}%
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Improvement Suggestions
          </Typography>
          <List>
            {suggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PronunciationFeedback; 