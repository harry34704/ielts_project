import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useScore } from '../context/ScoreContext';
import { useApi } from '../hooks/useApi';
import { useApp } from '../context/AppContext';
import { RecordingService } from '../services/recordingService';
import AudioPlayer from './AudioPlayer';
import SpeakingFeedback from './SpeakingFeedback';
import { speakingTasks } from '../data/speakingTasks';
import { getPronunciationScore } from '../services/pronunciationService';

const Word = styled('span')(({ theme, status }) => ({
  padding: '2px 4px',
  margin: '0 2px',
  borderRadius: '4px',
  display: 'inline-block',
  backgroundColor: status === 'correct' ? '#e8f5e9' :
                  status === 'incorrect' ? '#ffebee' :
                  status === 'current' ? '#e3f2fd' : 'transparent',
  color: status === 'correct' ? '#2e7d32' :
         status === 'incorrect' ? '#c62828' : 'inherit'
}));

const Speaking = () => {
  const { addScore } = useScore();
  const { loading } = useApp();
  const { callApi } = useApi();
  const [isRecording, setIsRecording] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [spokenWords, setSpokenWords] = useState([]);
  const [scoredWords, setScoredWords] = useState({});
  const recognitionRef = useRef(null);
  const [recordingService] = useState(new RecordingService());
  const [audioUrl, setAudioUrl] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const tasks = [
    {
      id: 1,
      title: 'Describe Your Hometown',
      description: 'Talk about your hometown and what makes it special.',
      parts: [
        'Describe where your hometown is located',
        'Talk about the weather and climate',
        'Discuss what you like most about it',
        'Explain any changes you have seen'
      ],
      expectedKeywords: [
        'located', 'city', 'town', 'weather', 'climate', 'people',
        'community', 'changes', 'development', 'favorite'
      ]
    },
    {
      id: 2,
      title: 'Your Favorite Book',
      description: 'Describe a book that has made an impact on you.',
      parts: [
        'What is the book about',
        'When did you first read it',
        'Why do you like it',
        'Would you recommend it to others'
      ],
      expectedKeywords: [
        'book', 'story', 'author', 'read', 'character', 'plot',
        'interesting', 'favorite', 'recommend', 'impact'
      ]
    }
  ];

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        const words = transcript.toLowerCase().split(' ');
        setSpokenWords(words);
        
        // Score words in real-time
        const newScoredWords = {};
        words.forEach((word, index) => {
          if (currentTask?.expectedKeywords.includes(word)) {
            newScoredWords[index] = 'correct';
          } else {
            newScoredWords[index] = 'incorrect';
          }
        });
        setScoredWords(newScoredWords);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentTask]);

  const startRecording = async () => {
    const started = await recordingService.startRecording();
    if (started) {
      setIsRecording(true);
      if (!currentTask) {
        setCurrentTask(speakingTasks[0]);
      }
      try {
        await callApi(async () => {
          // Start speech recognition
          recognitionRef.current?.start();
        });
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const result = await recordingService.stopRecording();
    if (result) {
      const { audioBlob, audioUrl } = result;
      setAudioUrl(audioUrl);
      
      try {
        // Generate feedback
        const pronunciationFeedback = await getPronunciationScore(spokenWords, audioBlob);
        setFeedback(pronunciationFeedback);
        
        // Calculate and save score
        const score = pronunciationFeedback.overallScore;
        addScore('speaking', score);
        
        await callApi(async () => {
          return { score, feedback: pronunciationFeedback };
        });
      } catch (error) {
        console.error('Error processing speaking test:', error);
      }
    }
  };

  const switchTask = () => {
    const currentIndex = tasks.findIndex(task => task.id === currentTask?.id);
    const nextIndex = (currentIndex + 1) % tasks.length;
    setCurrentTask(tasks[nextIndex]);
    setSpokenWords([]);
    setScoredWords({});
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          IELTS Speaking Practice
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              {currentTask ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    {currentTask.title}
                  </Typography>
                  <Typography paragraph>
                    {currentTask.description}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {currentTask.parts.map((part, index) => (
                      <Typography key={index} sx={{ mb: 1 }}>
                        • {part}
                      </Typography>
                    ))}
                  </Box>
                </>
              ) : (
                <Typography>
                  Click "Start Recording" to begin a speaking task.
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color={isRecording ? "secondary" : "primary"}
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={switchTask}
                      disabled={isRecording}
                    >
                      Next Task
                    </Button>
                  </Box>
                )}
              </Box>

              <Typography variant="h6" gutterBottom>
                Your Speech:
              </Typography>
              <Box sx={{ lineHeight: 2 }}>
                {spokenWords.map((word, index) => (
                  <Word
                    key={index}
                    status={scoredWords[index]}
                  >
                    {word}
                  </Word>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      {feedback && <SpeakingFeedback feedback={feedback} />}
    </Container>
  );
};

export default Speaking; 