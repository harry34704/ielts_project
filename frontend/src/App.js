import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Reading from './components/Reading';
import Writing from './components/Writing';
import Speaking from './components/Speaking';
import History from './components/History';
import LoadingOverlay from './components/common/LoadingOverlay';
import Notification from './components/common/Notification';
import { ScoreProvider } from './context/ScoreContext';
import { AppProvider } from './context/AppContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <ScoreProvider>
          <BrowserRouter>
            <Navbar />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/reading" element={<Reading />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/speaking" element={<Speaking />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </Container>
            <LoadingOverlay />
            <Notification />
          </BrowserRouter>
        </ScoreProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;