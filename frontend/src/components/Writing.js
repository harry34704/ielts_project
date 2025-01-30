import React, { useState } from 'react';
import { 
  Container, Box, Typography, Button, Card, CardContent,
  Grid, TextField, LinearProgress, Dialog 
} from '@mui/material';
import { useScore } from '../context/ScoreContext';

const Writing = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [userText, setUserText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const { addScore } = useScore();

  const writingTasks = [
    {
      id: 1,
      title: "Story Comprehension - Beginner",
      text: `Once upon a time, there was a little girl named Sarah. She loved to play 
      in her garden. One day, she found a beautiful butterfly with bright blue wings. 
      The butterfly led her to a patch of colourful flowers she had never seen before.`,
      level: 'beginner',
      timeLimit: 15
    },
    {
      id: 2,
      title: "Story Comprehension - Intermediate",
      text: `The old bookstore on Main Street held many secrets. John discovered this 
      when he found a mysterious letter tucked inside a dusty novel. The letter spoke 
      of a hidden treasure somewhere in the city. He decided to follow the clues and 
      embark on an unexpected adventure.`,
      level: 'intermediate',
      timeLimit: 20
    },
    {
      id: 3,
      title: "Story Comprehension - Advanced",
      text: `The implications of artificial intelligence in modern healthcare have been 
      revolutionary. From diagnostic assistance to personalized treatment plans, AI has 
      transformed how medical professionals approach patient care. However, this 
      integration raises important ethical considerations regarding privacy and 
      decision-making autonomy.`,
      level: 'advanced',
      timeLimit: 30
    }
  ];

  const handleSubmit = async () => {
    try {
      // Send to AI API for analysis
      const response = await fetch('YOUR_AI_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          original: selectedTask.text,
          userText: userText
        })
      });

      const result = await response.json();

      const analysis = {
        grammar: result.grammar || 85,
        vocabulary: result.vocabulary || 80,
        coherence: result.coherence || 75,
        accuracy: result.accuracy || 82
      };

      setFeedback(analysis);
      setShowResults(true);

      // Save score
      addScore('writing', {
        level: selectedTask.level,
        ...analysis,
        task: selectedTask.title
      });
    } catch (error) {
      console.error('Error analyzing writing:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Writing Practice
        </Typography>

        {!selectedTask ? (
          <Grid container spacing={3}>
            {writingTasks.map((task) => (
              <Grid item xs={12} md={4} key={task.id}>
                <Card 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSelectedTask(task)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Level: {task.level}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Time Limit: {task.timeLimit} minutes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedTask.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  Read the following text carefully:
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    backgroundColor: 'rgba(0,0,0,0.05)', 
                    p: 2, 
                    borderRadius: 1 
                  }}
                >
                  {selectedTask.text}
                </Typography>
                <Typography variant="body1" paragraph>
                  Now, write a summary of the text in your own words:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  placeholder="Write your summary here..."
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!userText.trim()}
                >
                  Submit Writing
                </Button>
              </CardContent>
            </Card>

            {showResults && feedback && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Writing Analysis
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography gutterBottom>Grammar</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={feedback.grammar} 
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {feedback.grammar}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography gutterBottom>Vocabulary</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={feedback.vocabulary} 
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {feedback.vocabulary}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography gutterBottom>Coherence</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={feedback.coherence} 
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {feedback.coherence}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography gutterBottom>Accuracy</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={feedback.accuracy} 
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {feedback.accuracy}%
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Writing;