import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, Grid, Card, CardContent,
  CardMedia, Button 
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CreateIcon from '@mui/icons-material/Create';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import HistoryIcon from '@mui/icons-material/History';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Reading Practice',
      description: 'Improve your reading skills with real-time pronunciation feedback and comprehension tests.',
      icon: MenuBookIcon,
      path: '/reading',
      color: '#4caf50'
    },
    {
      title: 'Writing Practice',
      description: 'Enhance your writing skills with AI-powered feedback on grammar, vocabulary, and coherence.',
      icon: CreateIcon,
      path: '/writing',
      color: '#2196f3'
    },
    {
      title: 'Speaking Practice',
      description: 'Perfect your speaking skills with interactive conversations and pronunciation analysis.',
      icon: RecordVoiceOverIcon,
      path: '/speaking',
      color: '#f44336'
    },
    {
      title: 'Progress History',
      description: 'Track your improvement over time with detailed statistics and progress reports.',
      icon: HistoryIcon,
      path: '/history',
      color: '#9c27b0'
    }
  ];

  return (
    <Container>
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to IELTS Practice
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Improve your English skills with AI-powered feedback and practice exercises
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Grid item xs={12} md={6} key={feature.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: feature.color,
                    color: 'white'
                  }}
                >
                  <Icon sx={{ fontSize: 40 }} />
                  <Typography variant="h5" component="h2" sx={{ ml: 2 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" paragraph>
                    {feature.description}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate(feature.path)}
                    sx={{ 
                      bgcolor: feature.color,
                      '&:hover': {
                        bgcolor: feature.color,
                        filter: 'brightness(0.9)'
                      }
                    }}
                  >
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              AI-Powered Feedback
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get instant, detailed feedback on your performance using advanced AI technology.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Comprehensive Practice
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Practice all aspects of English: reading, writing, and speaking.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Track Your Progress
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your improvement with detailed statistics and progress reports.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 