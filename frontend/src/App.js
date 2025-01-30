import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { ScoreProvider } from './context/ScoreContext';
import { AppProvider } from './context/AppContext';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Reading from './components/Reading';
import Writing from './components/Writing';
import Speaking from './components/Speaking';
import History from './components/History';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <ScoreProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reading" element={<Reading />} />
              <Route path="/writing" element={<Writing />} />
              <Route path="/speaking" element={<Speaking />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Router>
        </ScoreProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;