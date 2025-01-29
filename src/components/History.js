import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockHistory = {
  speaking: [
    {
      id: 1,
      date: '2024-03-15',
      task: 'Personal Introduction',
      score: 75,
      duration: '2:30',
      audioUrl: 'recording1.mp3',
      transcript: 'Hello, my name is...',
      keywords: ['introduction', 'family', 'hobbies'],
      feedback: 'Good fluency, work on pronunciation'
    },
    // Add more speaking entries
  ],
  writing: [
    {
      id: 1,
      date: '2024-03-14',
      task: 'Academic Task 1 - Graph',
      score: 68,
      wordCount: 180,
      essay: 'The graph shows...',
      keywords: ['trend', 'increase', 'overall'],
      feedback: 'Good structure, improve vocabulary'
    },
    // Add more writing entries
  ],
  practice: [
    {
      id: 1,
      date: '2024-03-13',
      task: 'Quick Response',
      score: 82,
      type: 'speaking',
      duration: '1:45',
      audioUrl: 'practice1.mp3',
      feedback: 'Excellent response time'
    },
    // Add more practice entries
  ]
};

const History = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [detailDialog, setDetailDialog] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    stopAudio();
  };

  const playAudio = (url) => {
    if (audioElement) {
      audioElement.pause();
    }
    const audio = new Audio(url);
    setAudioElement(audio);
    audio.play();
    setPlayingAudio(url);
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
    }
    setPlayingAudio(null);
  };

  const getProgressData = () => {
    const data = [];
    const types = ['speaking', 'writing', 'practice'];
    types.forEach(type => {
      mockHistory[type].forEach(entry => {
        data.push({
          date: entry.date,
          score: entry.score,
          type: type
        });
      });
    });
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const renderDetailDialog = () => {
    if (!detailDialog) return null;

    return (
      <Dialog 
        open={true} 
        onClose={() => setDetailDialog(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {detailDialog.task}
          <Typography variant="subtitle2" color="textSecondary">
            {new Date(detailDialog.date).toLocaleDateString()}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Score: {detailDialog.score}/100
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={detailDialog.score} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          {detailDialog.audioUrl && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recording
              </Typography>
              <IconButton 
                onClick={() => playingAudio ? stopAudio() : playAudio(detailDialog.audioUrl)}
              >
                {playingAudio === detailDialog.audioUrl ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <Typography variant="body2" color="textSecondary">
                Duration: {detailDialog.duration}
              </Typography>
            </Box>
          )}

          {detailDialog.transcript && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Transcript
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="body1">
                  {detailDialog.transcript}
                </Typography>
              </Paper>
            </Box>
          )}

          {detailDialog.essay && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Essay
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="body1">
                  {detailDialog.essay}
                </Typography>
              </Paper>
            </Box>
          )}

          {detailDialog.keywords && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Keywords Used
              </Typography>
              {detailDialog.keywords.map((keyword, index) => (
                <Chip 
                  key={index}
                  label={keyword}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          )}

          <Box>
            <Typography variant="h6" gutterBottom>
              Feedback
            </Typography>
            <Typography variant="body1">
              {detailDialog.feedback}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Practice History
        </Typography>

        {/* Progress Chart */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Progress Overview
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getProgressData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* History Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Speaking" />
            <Tab label="Writing" />
            <Tab label="Practice" />
          </Tabs>
        </Paper>

        {/* History Content */}
        <Grid container spacing={3}>
          {currentTab === 0 && mockHistory.speaking.map(entry => (
            <Grid item xs={12} key={entry.id}>
              <Card>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h6">{entry.task}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(entry.date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body1">
                        Score: {entry.score}/100
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Duration: {entry.duration}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          onClick={() => playingAudio ? stopAudio() : playAudio(entry.audioUrl)}
                        >
                          {playingAudio === entry.audioUrl ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => setDetailDialog(entry)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {currentTab === 1 && mockHistory.writing.map(entry => (
            <Grid item xs={12} key={entry.id}>
              <Card>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h6">{entry.task}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(entry.date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body1">
                        Score: {entry.score}/100
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Words: {entry.wordCount}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setDetailDialog(entry)}
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {currentTab === 2 && mockHistory.practice.map(entry => (
            <Grid item xs={12} key={entry.id}>
              <Card>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h6">{entry.task}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(entry.date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body1">
                        Score: {entry.score}/100
                      </Typography>
                      <Chip 
                        label={entry.type} 
                        size="small" 
                        color="primary"
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {entry.audioUrl && (
                          <IconButton 
                            onClick={() => playingAudio ? stopAudio() : playAudio(entry.audioUrl)}
                          >
                            {playingAudio === entry.audioUrl ? <PauseIcon /> : <PlayArrowIcon />}
                          </IconButton>
                        )}
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => setDetailDialog(entry)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {renderDetailDialog()}
      </Box>
    </Container>
  );
};

export default History; 