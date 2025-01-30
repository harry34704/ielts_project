import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  Grid
} from '@mui/material';
import { useScore } from '../context/ScoreContext';
import { styled } from '@mui/material/styles';

const Word = styled('span')(({ theme, status }) => ({
  padding: '2px 4px',
  margin: '0 2px',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: status === 'correct' ? '#e8f5e9' :
                  status === 'incorrect' ? '#ffebee' :
                  status === 'selected' ? '#e3f2fd' : 'transparent',
  color: status === 'correct' ? '#2e7d32' :
         status === 'incorrect' ? '#c62828' : 'inherit',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const Reading = () => {
  const { addScore } = useScore();
  const [currentTest, setCurrentTest] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [scoredWords, setScoredWords] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [userInput, setUserInput] = useState('');

  const sampleTest = {
    id: 1,
    title: 'Reading Practice Test 1',
    content: `The impact of artificial intelligence on modern society has been profound. 
              Recent developments in machine learning have revolutionized how we approach 
              complex problems. Scientists and researchers continue to push the boundaries 
              of what AI can achieve.`,
    questions: [
      {
        id: 1,
        text: 'What technology has had a profound impact on modern society?',
        answer: 'artificial intelligence'
      },
      {
        id: 2,
        text: 'What has revolutionized our approach to complex problems?',
        answer: 'machine learning'
      }
    ]
  };

  const startTest = () => {
    setCurrentTest(sampleTest);
    setScoredWords({});
    setUserAnswers([]);
  };

  const handleWordClick = (word, index) => {
    setSelectedWord({ word, index });
    setUserInput(word);
  };

  const handleAnswerSubmit = () => {
    if (!selectedWord) return;

    const { word, index } = selectedWord;
    const matchingQuestion = currentTest.questions.find(q => 
      q.answer.toLowerCase().includes(word.toLowerCase())
    );

    const isCorrect = matchingQuestion && userInput.toLowerCase() === matchingQuestion.answer.toLowerCase();

    setScoredWords(prev => ({
      ...prev,
      [index]: isCorrect ? 'correct' : 'incorrect'
    }));

    if (isCorrect) {
      setUserAnswers(prev => [...prev, { 
        questionId: matchingQuestion.id, 
        answer: userInput,
        correct: true
      }]);
    }

    setSelectedWord(null);
    setUserInput('');
  };

  const calculateScore = () => {
    const correctAnswers = userAnswers.filter(a => a.correct).length;
    const totalQuestions = currentTest.questions.length;
    const score = (correctAnswers / totalQuestions) * 9; // IELTS scale
    addScore('reading', score);
    return score;
  };

  const renderContent = () => {
    if (!currentTest) return null;

    return currentTest.content.split(' ').map((word, index) => (
      <Word
        key={index}
        status={scoredWords[index] || (selectedWord?.index === index ? 'selected' : undefined)}
        onClick={() => handleWordClick(word, index)}
      >
        {word}
      </Word>
    ));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          IELTS Reading Practice
        </Typography>
        
        {!currentTest ? (
          <Button
            variant="contained"
            color="primary"
            onClick={startTest}
          >
            Start New Test
          </Button>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {currentTest.title}
                </Typography>
                <Box sx={{ mb: 3, lineHeight: 2 }}>
                  {renderContent()}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Questions
                </Typography>
                {currentTest.questions.map((question, index) => (
                  <Box key={question.id} sx={{ mb: 2 }}>
                    <Typography gutterBottom>
                      {index + 1}. {question.text}
                    </Typography>
                    {selectedWord && (
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          size="small"
                          sx={{ flexGrow: 1 }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleAnswerSubmit}
                        >
                          Submit Answer
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))}
                
                {Object.keys(scoredWords).length === currentTest.questions.length && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">
                      Your Score: {calculateScore().toFixed(1)}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Reading; 