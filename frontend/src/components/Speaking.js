import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Grid, Card, CardContent,
  Button, List, ListItem, ListItemText, ListItemIcon,
  Stepper, Step, StepLabel, Paper 
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useApi } from '../hooks/useApi';
import { useApp } from '../context/AppContext';
import TaskCard from './common/TaskCard';
import Timer from './common/Timer';
import RecordButton from './common/RecordButton';
import ScoreDisplay from './common/ScoreDisplay';
import { aiService } from '../services/aiService';

const Speaking = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [recording, setRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { callApi } = useApi();
  const { showNotification } = useApp();

  const speakingTasks = [
    {
      id: 1,
      title: "Basic Conversation - Beginner",
      description: "Practice basic conversation skills with common topics",
      level: 'beginner',
      timeLimit: 5,
      parts: [
        {
          title: "Introduction",
          questions: [
            "What is your name?",
            "Where are you from?",
            "What do you do?",
            "Tell me about your family"
          ],
          duration: 2
        },
        {
          title: "Hobbies",
          questions: [
            "What do you like to do in your free time?",
            "How often do you do these activities?",
            "Who do you usually do these activities with?",
            "Why do you enjoy these activities?"
          ],
          duration: 3
        }
      ]
    },
    {
      id: 2,
      title: "Topic Discussion - Intermediate",
      description: "Discuss various topics with more complex vocabulary",
      level: 'intermediate',
      timeLimit: 8,
      parts: [
        {
          title: "Environmental Issues",
          questions: [
            "What are the main environmental problems in your area?",
            "How can individuals help protect the environment?",
            "What do you think about climate change?",
            "What should governments do to address environmental issues?"
          ],
          duration: 4
        },
        {
          title: "Technology",
          questions: [
            "How has technology changed your life?",
            "What are the advantages and disadvantages of social media?",
            "Do you think people rely too much on technology?",
            "How do you think technology will change in the future?"
          ],
          duration: 4
        }
      ]
    },
    {
      id: 3,
      title: "Academic Discussion - Advanced",
      description: "Engage in complex academic discussions",
      level: 'advanced',
      timeLimit: 11,
      parts: [
        {
          title: "Education Systems",
          questions: [
            "What are the main challenges facing education systems today?",
            "How has online learning impacted education?",
            "Should education focus more on practical skills or theoretical knowledge?",
            "What role should technology play in education?"
          ],
          duration: 5
        },
        {
          title: "Globalization",
          questions: [
            "How has globalization affected your country?",
            "What are the benefits and drawbacks of cultural globalization?",
            "How does globalization impact local businesses?",
            "What is the future of globalization?"
          ],
          duration: 6
        }
      ]
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

      setTimeout(async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await processSpeaking(audioBlob);
        setAudioChunks([]);
      }, 100);
    }
  };

  const processSpeaking = async (audioBlob) => {
    await callApi(
      async () => {
        const result = await aiService.analyzeSpeaking(
          audioBlob, 
          selectedTask.parts[activeStep]
        );
        if (activeStep === selectedTask.parts.length - 1) {
          setShowResults(true);
        } else {
          setActiveStep(prev => prev + 1);
        }
        return result;
      },
      'Speaking analysis completed'
    );
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setActiveStep(0);
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
          Speaking Practice
        </Typography>

        {!selectedTask ? (
          <Grid container spacing={3}>
            {speakingTasks.map((task) => (
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

                <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                  {selectedTask.parts.map((part, index) => (
                    <Step key={part.title}>
                      <StepLabel>{part.title}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {recording && (
                  <Timer
                    duration={selectedTask.parts[activeStep].duration * 60}
                    onComplete={handleTimerComplete}
                  />
                )}

                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedTask.parts[activeStep].title}
                  </Typography>
                  <List>
                    {selectedTask.parts[activeStep].questions.map((question, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <QuestionAnswerIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={question} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>

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
                    title="Speaking Analysis"
                    scores={{
                      pronunciation: 85,
                      fluency: 80,
                      grammar: 75,
                      vocabulary: 82
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

export default Speaking; 