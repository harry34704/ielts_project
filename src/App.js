import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid } from '@mui/material';
import Speaking from './components/Speaking';
import Writing from './components/Writing';
import Practice from './components/Practice';
import History from './components/History';
import './App.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error:', error);
    console.log('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Home component
const Home = () => (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      Welcome to IELTS Practice
    </Typography>
    <Typography variant="body1" paragraph>
      Improve your IELTS score with our AI-powered practice platform
    </Typography>
    <Grid container spacing={3} sx={{ mt: 4 }}>
      <Grid item xs={12} md={4}>
        <Button 
          fullWidth 
          variant="contained" 
          component={Link} 
          to="/speaking"
          sx={{ height: '100px' }}
        >
          Speaking Tasks
        </Button>
      </Grid>
      <Grid item xs={12} md={4}>
        <Button 
          fullWidth 
          variant="contained" 
          component={Link} 
          to="/writing"
          sx={{ height: '100px' }}
        >
          Writing Tasks
        </Button>
      </Grid>
      <Grid item xs={12} md={4}>
        <Button 
          fullWidth 
          variant="contained" 
          component={Link} 
          to="/practice"
          sx={{ height: '100px' }}
        >
          Practice Mode
        </Button>
      </Grid>
    </Grid>
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                IELTS Practice
              </Typography>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/speaking">Speaking</Button>
              <Button color="inherit" component={Link} to="/writing">Writing</Button>
              <Button color="inherit" component={Link} to="/practice">Practice</Button>
              <Button color="inherit" component={Link} to="/history">History</Button>
            </Toolbar>
          </AppBar>

          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/speaking/*" element={<Speaking />} />
              <Route path="/writing/*" element={<Writing />} />
              <Route path="/practice/*" element={<Practice />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;