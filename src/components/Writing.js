import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Container, 
  TextField,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';

const writingTasks = [
  {
    id: 1,
    title: "Academic Task 1 - Graph Description",
    description: "The graph below shows the population growth in different regions over 50 years. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    maxWords: 200,
    keyWords: ["trend", "increase", "decrease", "significant", "compare", "overall", "period"],
    sampleAnswer: "The graph illustrates population growth trends across various regions spanning five decades..."
  },
  {
    id: 2,
    title: "Academic Task 1 - Process Diagram",
    description: "The diagram shows the process of photosynthesis in plants. Describe the process and explain its importance.",
    minWords: 150,
    maxWords: 200,
    keyWords: ["process", "stages", "firstly", "finally", "subsequently", "result", "cycle"],
    sampleAnswer: "The diagram demonstrates the step-by-step process of photosynthesis in plants..."
  },
  {
    id: 3,
    title: "Academic Task 2 - Essay",
    description: "Some people believe that students should focus on their best subjects in school, while others think they should study a wide range of subjects. Discuss both views and give your opinion.",
    minWords: 250,
    maxWords: 300,
    keyWords: ["advantage", "disadvantage", "however", "therefore", "conclude", "opinion", "argue"],
    sampleAnswer: "The debate over specialized versus broad education has been ongoing..."
  }
];

const Writing = () => {
  const [currentTask, setCurrentTask] = useState(null);
  const [essay, setEssay] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [usedKeywords, setUsedKeywords] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (currentTask && essay) {
      // Update word count
      const words = essay.trim().split(/\s+/);
      setWordCount(words.length);

      // Check for keywords
      const keywords = currentTask.keyWords;
      const used = keywords.filter(keyword => 
        essay.toLowerCase().includes(keyword.toLowerCase())
      );
      setUsedKeywords(used);

      // Calculate score based on word count and keywords
      const wordCountScore = Math.min(
        50,
        (words.length >= currentTask.minWords && words.length <= currentTask.maxWords) ? 50 : 
        (words.length * 50) / currentTask.minWords
      );
      const keywordScore = (used.length / keywords.length) * 50;
      setScore(Math.round(wordCountScore + keywordScore));
    }
  }, [essay, currentTask]);

  useEffect(() => {
    let timer;
    if (currentTask && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, currentTask]);

  const startTask = (task) => {
    setCurrentTask(task);
    setEssay('');
    setScore(0);
    setFeedback(null);
    setTimeLeft(task.id === 3 ? 2400 : 1200); // 40 mins for Task 2, 20 mins for Task 1
  };

  const submitEssay = () => {
    const newSubmission = {
      id: Date.now(),
      task: currentTask.title,
      essay: essay,
      score: score,
      date: new Date().toISOString(),
      wordCount: wordCount
    };
    setSubmissions([...submissions, newSubmission]);
    setFeedback({
      score: score,
      comments: generateFeedback()
    });
  };

  const generateFeedback = () => {
    const comments = [];
    if (wordCount < currentTask.minWords) {
      comments.push(`Your response is too short. Aim for at least ${currentTask.minWords} words.`);
    }
    if (usedKeywords.length < currentTask.keyWords.length) {
      comments.push('Try to use more academic vocabulary and linking words.');
    }
    return comments;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          IELTS Writing Practice
        </Typography>

        <Grid container spacing={3}>
          {/* Task Selection */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Writing Tasks
              </Typography>
              <List>
                {writingTasks.map((task) => (
                  <ListItem 
                    key={task.id}
                    button
                    onClick={() => startTask(task)}
                  >
                    <ListItemText 
                      primary={task.title}
                      secondary={`${task.minWords}-${task.maxWords} words`}
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

                {timeLeft > 0 && (
                  <Typography variant="h6" color="primary" align="center" gutterBottom>
                    Time Remaining: {formatTime(timeLeft)}
                  </Typography>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  variant="outlined"
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  placeholder="Write your response here..."
                  disabled={timeLeft === 0}
                  sx={{ mt: 2 }}
                />

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Word Count: {wordCount} / {currentTask.minWords}-{currentTask.maxWords}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={score} 
                    sx={{ mt: 1, mb: 1 }}
                  />
                  <Typography variant="h6" align="center">
                    Score: {score}/100
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Keywords Used:
                  </Typography>
                  {currentTask.keyWords.map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      sx={{
                        m: 0.5,
                        bgcolor: usedKeywords.includes(keyword) ? 'success.light' : 'error.light',
                        color: 'white'
                      }}
                    />
                  ))}
                </Box>

                <Button 
                  variant="contained"
                  onClick={submitEssay}
                  disabled={timeLeft > 0}
                  sx={{ mt: 2 }}
                >
                  Submit Essay
                </Button>
              </Paper>
            )}
          </Grid>

          {/* Feedback and Recent Submissions */}
          <Grid item xs={12}>
            {feedback && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Feedback
                </Typography>
                <Typography variant="body1" paragraph>
                  Score: {feedback.score}/100
                </Typography>
                {feedback.comments.map((comment, index) => (
                  <Typography key={index} variant="body1" paragraph>
                    • {comment}
                  </Typography>
                ))}
              </Paper>
            )}

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Submissions
              </Typography>
              <Grid container spacing={2}>
                {submissions.slice(-3).map((submission) => (
                  <Grid item xs={12} md={4} key={submission.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{submission.task}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Score: {submission.score}/100
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Words: {submission.wordCount}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(submission.date).toLocaleString()}
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

export default Writing; 