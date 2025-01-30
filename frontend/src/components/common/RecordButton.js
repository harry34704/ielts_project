import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const RecordButton = ({ onStart, onStop, disabled }) => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (recording) {
      setLoading(true);
      await onStop();
      setRecording(false);
      setLoading(false);
    } else {
      await onStart();
      setRecording(true);
    }
  };

  return (
    <Button
      variant="contained"
      color={recording ? "error" : "primary"}
      onClick={handleClick}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} /> : 
                recording ? <StopIcon /> : <MicIcon />}
    >
      {loading ? 'Processing...' : 
       recording ? 'Stop Recording' : 'Start Recording'}
    </Button>
  );
};

export default RecordButton; 