import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Container, 
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import TestMode from './TestMode';

const practiceTasks = [
  {
    id: 1,
    title: "Quick Response",
    description: "Practice giving quick, accurate responses to common IELTS questions",
    type: "speaking",
    questions: [
      "What do you do in your free time?",
      "Describe your hometown.",
      "What are your future career plans?"
    ],
    expectedWords: ["hobby", "activities", "enjoy", "city", "career", "future", "plan"],
    timeLimit: 60
  },
  {
    id: 2,
    title: "Vocabulary Builder",
    description: "Enhance your vocabulary by describing images with specific terms",
    type: "mixed",
    images: [
      { url: "city.jpg", topic: "Urban Life", keywords: ["metropolitan", "crowded", "infrastructure"] },
      { url: "nature.jpg", topic: "Environment", keywords: ["ecosystem", "sustainable", "conservation"] },
      { url: "technology.jpg", topic: "Modern Tech", keywords: ["innovation", "digital", "advancement"] }
    ],
    timeLimit: 120
  },
  {
    id: 3,
    title: "Grammar Challenge",
    description: "Practice using correct grammar structures in both speaking and writing",
    type: "writing",
    exercises: [
      {
        prompt: "Describe a past experience using perfect tenses",
        example: "I have been studying English for...",
        grammar: ["present perfect", "past perfect", "perfect continuous"]
      },
      {
        prompt: "Use conditional sentences to discuss future possibilities",
        example: "If I pass the IELTS exam, I will...",
        grammar: ["first conditional", "second conditional"]
      },
      {
        prompt: "Practice passive voice structures",
        example: "English is spoken in many countries...",
        grammar: ["passive voice", "reported speech"]
      }
    ],
    timeLimit: 180
  }
];

const Practice = () => {
  const [mode, setMode] = useState('practice'); // 'practice' or 'test'
  const [currentTask, setCurrentTask] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const practiceQuestions = [
    "Describe your hometown.",
    "What do you like to do in your free time?",
    "Do you prefer reading books or watching movies?"
  ];

  const startTask = (task) => {
    setCurrentTask(task);
    setResponse('');
    setScore(0);
    setFeedback(null);
    setTimeLeft(task.timeLimit);
    setCurrentExerciseIndex(0);
    setDialogOpen(true);
  };

  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Initialize speech recognition here
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setResponse(transcript);
      analyzeResponse(transcript);
    };

    recognition.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Stop speech recognition here
  };

  const analyzeResponse = (text) => {
    if (!currentTask) return;

    let newScore = 0;
    const words = text.toLowerCase().split(' ');

    if (currentTask.type === 'speaking') {
      const correctWords = currentTask.expectedWords.filter(word => 
        words.includes(word.toLowerCase())
      );
      newScore = Math.round((correctWords.length / currentTask.expectedWords.length) * 100);
    } else if (currentTask.type === 'writing') {
      // Analyze grammar and vocabulary
      newScore = calculateWritingScore(text);
    }

    setScore(newScore);
  };

  const calculateWritingScore = (text) => {
    // Implement more sophisticated scoring logic here
    return Math.min(100, text.length / 5);
  };

  const handleSubmit = () => {
    const practiceData = {
      date: new Date().toISOString(),
      type: 'practice',
      scores: {
        fluency: 7,
        lexical: 7,
        grammar: 7,
        pronunciation: 7
      }
    };

    // Save to localStorage
    const existingHistory = JSON.parse(localStorage.getItem('practiceHistory') || '[]');
    existingHistory.push(practiceData);
    localStorage.setItem('practiceHistory', JSON.stringify(existingHistory));

    setFeedback({
      message: "Great job! Here's your feedback:",
      scores: practiceData.scores
    });
    setShowFeedback(true);
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          IELTS Speaking Practice
        </Typography>

        {/* Mode Selection */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={mode === 'practice' ? 'contained' : 'outlined'}
                  onClick={() => setMode('practice')}
                >
                  Practice Mode
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={mode === 'test' ? 'contained' : 'outlined'}
                  onClick={() => setMode('test')}
                >
                  Test Mode
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {mode === 'practice' ? (
          <>
            {/* Practice Mode Content */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Practice Question
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {practiceQuestions[0]}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color={isRecording ? "error" : "primary"}
                    onClick={handleRecording}
                    sx={{ mr: 2 }}
                  >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Submit Practice
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Feedback Display */}
            {showFeedback && feedback && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Feedback
                  </Typography>
                  <Typography>{feedback.message}</Typography>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {Object.entries(feedback.scores).map(([criterion, score]) => (
                      <Grid item xs={6} key={criterion}>
                        <Typography>
                          {criterion.charAt(0).toUpperCase() + criterion.slice(1)}: {score}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          // Test Mode Content
          <TestMode />
        )}
      </Box>
    </Container>
  );
};

export default Practice;
