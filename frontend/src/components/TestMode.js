import React, { useState } from 'react';
import { 
  Box, Container, Typography, Card, CardContent, 
  Button, Stepper, Step, StepLabel,
  List, ListItem, ListItemText 
} from '@mui/material';
import { calculateScores } from '../services/scoringService';
import { generatePDFReport } from '../services/reportService';

const TestMode = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [recording, setRecording] = useState(false);

  const steps = [
    {
      title: 'Introduction',
      questions: [
        "Tell me about your hometown.",
        "What do you do for work or study?",
        "Do you enjoy reading books?"
      ]
    },
    {
      title: 'Cue Card',
      topic: {
        title: "Describe a memorable journey",
        points: [
          "Where you went",
          "When you went there",
          "Who you went with",
          "Why it was memorable"
        ],
        prepTime: 60,
        speakTime: 120
      }
    },
    {
      title: 'Discussion',
      questions: [
        "How has travel changed in recent years?",
        "What are the benefits of traveling?",
        "How might travel change in the future?"
      ]
    }
  ];

  const handleRecord = () => {
    setRecording(!recording);
    if (!recording) {
      console.log('Started recording');
    } else {
      console.log('Stopped recording');
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleComplete = async () => {
    const testData = {
      date: new Date().toISOString(),
      type: 'test'
    };
    generatePDFReport(testData);
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          IELTS Speaking Test
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.title}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card>
          <CardContent>
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Part 1: Introduction
                </Typography>
                <List>
                  {steps[0].questions.map((q, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={q} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Part 2: Cue Card
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {steps[1].topic.title}
                </Typography>
                <List>
                  {steps[1].topic.points.map((point, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Part 3: Discussion
                </Typography>
                <List>
                  {steps[2].questions.map((q, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={q} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color={recording ? "error" : "primary"}
                onClick={handleRecord}
              >
                {recording ? "Stop Recording" : "Start Recording"}
              </Button>
              
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next Part
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleComplete}
                >
                  Complete Test
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default TestMode; 