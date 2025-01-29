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
  const [currentTask, setCurrentTask] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [taskStatus, setTaskStatus] = useState({});

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
    const newFeedback = {
      score,
      comments: generateFeedback(),
      timestamp: new Date().toISOString()
    };
    setFeedback(newFeedback);
    setDialogOpen(false);
  };

  const generateFeedback = () => {
    const comments = [];
    if (score < 50) {
      comments.push("Try to use more topic-specific vocabulary");
    } else if (score < 80) {
      comments.push("Good attempt! Work on sentence structure variety");
    } else {
      comments.push("Excellent use of vocabulary and grammar!");
    }
    return comments;
  };

  const handleAccept = (taskId) => {
    setTaskStatus(prev => ({
      ...prev,
      [taskId]: 'accepted'
    }));
  };

  const handleReject = (taskId) => {
    setTaskStatus(prev => ({
      ...prev,
      [taskId]: 'rejected'
    }));
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          IELTS Practice Mode
        </Typography>

        <Grid container spacing={3}>
          {/* Task Cards */}
          {practiceTasks.map((task) => (
            <Grid item xs={12} md={4} key={task.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {task.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label={task.type.toUpperCase()} 
                      color="primary" 
                      size="small" 
                    />
                    <Chip 
                      icon={<TimerIcon />}
                      label={`${task.timeLimit}s`}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  {!taskStatus[task.id] ? (
                    <>
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => handleAccept(task.id)}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        onClick={() => handleReject(task.id)}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <>
                      <Chip 
                        label={taskStatus[task.id].toUpperCase()}
                        color={taskStatus[task.id] === 'accepted' ? 'success' : 'error'}
                        size="small"
                      />
                      {taskStatus[task.id] === 'accepted' && (
                        <Button 
                          size="small" 
                          color="primary"
                          onClick={() => startTask(task)}
                          sx={{ ml: 1 }}
                        >
                          Start Practice
                        </Button>
                      )}
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Practice Dialog */}
        <Dialog 
          open={dialogOpen} 
          fullWidth 
          maxWidth="md"
          onClose={() => setDialogOpen(false)}
        >
          <DialogTitle>
            {currentTask?.title}
            {timeLeft > 0 && (
              <Typography variant="body2" color="textSecondary">
                Time Remaining: {timeLeft}s
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            {currentTask && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {currentTask.type === 'speaking' 
                    ? currentTask.questions[currentExerciseIndex]
                    : currentTask.type === 'writing'
                      ? currentTask.exercises[currentExerciseIndex].prompt
                      : 'Describe what you see'
                  }
                </Typography>

                {currentTask.type === 'speaking' ? (
                  <Box sx={{ mt: 2 }}>
                    <IconButton 
                      color={isRecording ? "error" : "primary"}
                      onClick={handleRecording}
                    >
                      {isRecording ? <StopIcon /> : <MicIcon />}
                    </IconButton>
                    <Typography variant="body1">
                      {response}
                    </Typography>
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={response}
                    onChange={(e) => {
                      setResponse(e.target.value);
                      analyzeResponse(e.target.value);
                    }}
                    placeholder="Type your response here..."
                    sx={{ mt: 2 }}
                  />
                )}

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Current Score:
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
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Feedback Display */}
        {feedback && (
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Practice Feedback
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h5">
                Score: {feedback.score}/100
              </Typography>
            </Box>
            {feedback.comments.map((comment, index) => (
              <Typography key={index} variant="body1" paragraph>
                • {comment}
              </Typography>
            ))}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Practice;
