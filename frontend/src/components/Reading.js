import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Grid, Card, CardContent,
  Button, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { useApi } from '../hooks/useApi';
import { useApp } from '../context/AppContext';
import TaskCard from './common/TaskCard';
import Timer from './common/Timer';
import RecordButton from './common/RecordButton';
import ScoreDisplay from './common/ScoreDisplay';
import { aiService } from '../services/aiService';

const Reading = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [recording, setRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { callApi } = useApi();
  const { showNotification } = useApp();

  const readingTasks = [
    {
      id: 1,
      title: "Basic Reading - Beginner",
      text: `The sun rises in the east every morning. Birds sing their sweet songs 
      as they fly through the blue sky. Children walk to school with their colorful 
      backpacks. The world wakes up to a new day full of possibilities.`,
      level: 'beginner',
      timeLimit: 2,
      description: 'Practice basic reading with simple sentences and common vocabulary.'
    },
    {
      id: 2,
      title: "News Article - Intermediate",
      text: `Climate change is affecting our planet in numerous ways. Rising temperatures 
      are causing glaciers to melt, leading to rising sea levels. Scientists warn that 
      immediate action is necessary to prevent irreversible damage to our ecosystem.`,
      level: 'intermediate',
      timeLimit: 3,
      description: 'Read and comprehend news articles with more complex vocabulary.'
    },
    {
      id: 3,
      title: "Academic Text - Advanced",
      text: `The proliferation of artificial intelligence has sparked intense debate 
      about its implications for society. While proponents emphasize its potential 
      to revolutionize industries and improve efficiency, critics warn of potential 
      ethical concerns and socioeconomic impacts that require careful consideration.`,
      level: 'advanced',
      timeLimit: 4,
      description: 'Challenge yourself with academic texts and technical vocabulary.'
    }
  ];

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        setAudioChunks(current => [...current, event.data]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      showNotification('Error accessing microphone', 'error');
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setRecording(false);
      
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach(track => track.stop());

      // Process the recording after a short delay to ensure all data is collected
      setTimeout(async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await processReading(audioBlob);
        setAudioChunks([]);
      }, 100);
    }
  };

  const processReading = async (audioBlob) => {
    await callApi(
      async () => {
        const result = await aiService.analyzeReading(audioBlob, selectedTask.text);
        setShowResults(true);
        return result;
      },
      'Reading analysis completed'
    );
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setShowResults(false);
    setAudioChunks([]);
  };

  const handleTimerComplete = () => {
    if (recording) {
      stopRecording();
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reading Practice
        </Typography>

        {!selectedTask ? (
          <Grid container spacing={3}>
            {readingTasks.map((task) => (
              <Grid item xs={12} md={4} key={task.id}>
                <TaskCard
                  title={task.title}
                  description={task.description}
                  level={task.level}
                  timeLimit={task.timeLimit}
                  onClick={() => handleTaskSelect(task)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    {selectedTask.title}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => setSelectedTask(null)}
                  >
                    Choose Another Task
                  </Button>
                </Box>

                {recording && (
                  <Timer
                    duration={selectedTask.timeLimit * 60}
                    onComplete={handleTimerComplete}
                  />
                )}

                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3, 
                    p: 2, 
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  {selectedTask.text}
                </Typography>

                <RecordButton
                  onStart={startRecording}
                  onStop={stopRecording}
                  disabled={showResults}
                />
              </CardContent>
            </Card>

            {showResults && (
              <Card>
                <CardContent>
                  <ScoreDisplay
                    title="Reading Analysis"
                    scores={{
                      accuracy: 85,
                      pronunciation: 80,
                      fluency: 75,
                      comprehension: 82
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Reading; 