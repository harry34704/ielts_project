import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useApp } from '../../context/AppContext';

const Notification = () => {
  const { notification, setNotification } = useApp();

  const handleClose = () => {
    setNotification(null);
  };

  if (!notification) return null;

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={notification.type} 
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification; 