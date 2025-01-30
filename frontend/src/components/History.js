import React, { useState } from 'react';
import { 
  Container, Box, Typography, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Button, Tabs, Tab, Grid, LinearProgress 
} from '@mui/material';
import { useScore } from '../context/ScoreContext';

const History = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { scores } = useScore();

  const getHistory = () => {
    return JSON.parse(localStorage.getItem('ieltsHistory') || '[]');
  };

  const calculateAverages = (type) => {
    const history = getHistory().filter(item => item.type === type);
    if (history.length === 0) return null;

    const totals = history.reduce((acc, item) => {
      Object.keys(item.score).forEach(key => {
        if (typeof item.score[key] === 'number') {
          acc[key] = (acc[key] || 0) + item.score[key];
        }
      });
      return acc;
    }, {});

    Object.keys(totals).forEach(key => {
      totals[key] = totals[key] / history.length;
    });

    return totals;
  };

  const renderProgressStats = (averages) => {
    if (!averages) return null;

    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(averages).map(([key, value]) => (
          <Grid item xs={6} md={3} key={key}>
            <Typography variant="body2" gutterBottom>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={value} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {value.toFixed(1)}%
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  const generatePDF = (data) => {
    // Implement PDF generation logic
    console.log('Generating PDF for:', data);
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Practice History
        </Typography>

        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Reading" />
          <Tab label="Writing" />
          <Tab label="Speaking" />
        </Tabs>

        {selectedTab === 0 && (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Reading Progress
                </Typography>
                {renderProgressStats(calculateAverages('reading'))}
              </CardContent>
            </Card>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Accuracy</TableCell>
                    <TableCell>Fluency</TableCell>
                    <TableCell>Pronunciation</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getHistory()
                    .filter(item => item.type === 'reading')
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(item.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{item.score.level}</TableCell>
                        <TableCell>{item.score.accuracy}%</TableCell>
                        <TableCell>{item.score.fluency}%</TableCell>
                        <TableCell>{item.score.pronunciation}%</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            onClick={() => generatePDF(item)}
                          >
                            Download Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Writing Progress
                </Typography>
                {renderProgressStats(calculateAverages('writing'))}
              </CardContent>
            </Card>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Grammar</TableCell>
                    <TableCell>Vocabulary</TableCell>
                    <TableCell>Coherence</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getHistory()
                    .filter(item => item.type === 'writing')
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(item.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{item.score.level}</TableCell>
                        <TableCell>{item.score.grammar}%</TableCell>
                        <TableCell>{item.score.vocabulary}%</TableCell>
                        <TableCell>{item.score.coherence}%</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            onClick={() => generatePDF(item)}
                          >
                            Download Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {selectedTab === 2 && (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Speaking Progress
                </Typography>
                {renderProgressStats(calculateAverages('speaking'))}
              </CardContent>
            </Card>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Pronunciation</TableCell>
                    <TableCell>Fluency</TableCell>
                    <TableCell>Grammar</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getHistory()
                    .filter(item => item.type === 'speaking')
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(item.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{item.score.level}</TableCell>
                        <TableCell>{item.score.pronunciation}%</TableCell>
                        <TableCell>{item.score.fluency}%</TableCell>
                        <TableCell>{item.score.grammar}%</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            onClick={() => generatePDF(item)}
                          >
                            Download Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default History; 