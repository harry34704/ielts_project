import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Container,
  List,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

const speakingTasks = [
  {
    id: 1,
    title: "Personal Introduction",
    description: "Introduce yourself and talk about your hobbies, family, and work/studies.",
    duration: "2-3 minutes",
    expectedWords: ["introduce", "family", "hobbies", "work", "studies", "background"]
  },
  {
    id: 2,
    title: "Describe a Place",
    description: "Talk about a place you've visited that left a strong impression on you.",
    duration: "2-3 minutes",
    expectedWords: ["location", "impression", "visited", "experience", "memorable", "atmosphere"]
  },
  {
    id: 3,
    title: "Future Plans",
    description: "Discuss your future plans and aspirations for the next five years.",
    duration: "2-3 minutes",
    expectedWords: ["future", "plans", "goals", "career", "aspirations", "achieve"]
  }
];

const Speaking = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [score, setScore] = useState(0);
  const [words, setWords] = useState([]);
  const [recordings, setRecordings] = useState([]);

  // Simulated speech recognition (replace with actual implementation)
  useEffect(() => {
    if (isRecording && currentTask) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        setTranscription(transcript);
        analyzeWords(transcript, currentTask.expectedWords);
      };

      recognition.start();

      return () => recognition.stop();
    }
  }, [isRecording, currentTask]);

  const analyzeWords = (text, expectedWords) => {
    const wordsArray = text.toLowerCase().split(' ');
    const analyzedWords = wordsArray.map(word => ({
      text: word,
      correct: expectedWords.includes(word.toLowerCase())
    }));
    setWords(analyzedWords);

    // Calculate score based on word usage
    const correctWords = analyzedWords.filter(w => w.correct).length;
    const newScore = Math.min(100, Math.round((correctWords / expectedWords.length) * 100));
    setScore(newScore);
  };

  const startRecording = (task) => {
    setCurrentTask(task);
    setIsRecording(true);
    setTranscription('');
    setWords([]);
    setScore(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordings([...recordings, {
      id: Date.now(),
      task: currentTask.title,
      transcript: transcription,
      score: score,
      date: new Date().toISOString()
    }]);
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          IELTS Speaking Practice
        </Typography>

        <Grid container spacing={3}>
          {/* Task Selection */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Speaking Tasks
              </Typography>
              <List>
                {speakingTasks.map((task) => (
                  <ListItem 
                    key={task.id}
                    button
                    onClick={() => !isRecording && startRecording(task)}
                    disabled={isRecording}
                  >
                    <ListItemText 
                      primary={task.title}
                      secondary={task.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Active Task */}
          <Grid item xs={12} md={8}>
            {currentTask && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {currentTask.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {currentTask.description}
                </Typography>
                
                {/* Score Display */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Current Score
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={score} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="h6" align="center">
                    {score}/100
                  </Typography>
                </Box>

                {/* Word Display */}
                <Box sx={{ mb: 2 }}>
                  {words.map((word, index) => (
                    <Chip
                      key={index}
                      label={word.text}
                      sx={{
                        m: 0.5,
                        bgcolor: word.correct ? 'success.light' : 'error.light',
                        color: 'white'
                      }}
                    />
                  ))}
                </Box>

                <Button
                  variant="contained"
                  color={isRecording ? "error" : "primary"}
                  startIcon={<MicIcon />}
                  onClick={isRecording ? stopRecording : () => startRecording(currentTask)}
                  sx={{ mt: 2 }}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              </Paper>
            )}
          </Grid>

          {/* Recent Recordings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Recordings
              </Typography>
              <Grid container spacing={2}>
                {recordings.slice(-3).map((recording) => (
                  <Grid item xs={12} md={4} key={recording.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{recording.task}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Score: {recording.score}/100
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(recording.date).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Speaking; 