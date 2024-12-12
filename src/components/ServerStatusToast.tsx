import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Collapse, LinearProgress, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { config } from '../config';

interface ServerStatus {
  isConnected: boolean;
  isChecking: boolean;
  progress: number;
}

export const ServerStatusToast = () => {
  const [status, setStatus] = useState<ServerStatus>({
    isConnected: false,
    isChecking: true,
    progress: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let healthCheckInterval: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    const startChecking = () => {
      setStatus({
        isConnected: false,
        isChecking: true,
        progress: 0,
      });

      // Progress bar that fills up in 60 seconds
      progressInterval = setInterval(() => {
        setStatus((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + (100 / (60 * 10)), 100), // Update every 100ms
        }));
      }, 100);

      // Health check every 10 seconds
      const checkServer = async () => {
        const isHealthy = await checkHealth();
        if (isHealthy) {
          clearInterval(progressInterval);
          clearInterval(healthCheckInterval);
          setStatus({
            isConnected: true,
            isChecking: false,
            progress: 100,
          });
          setShowSuccess(true);
          
          // Hide success message after 3 seconds
          hideTimeout = setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
        }
      };

      checkServer(); // Initial check
      healthCheckInterval = setInterval(checkServer, 10000);

      // If server isn't connected after 60 seconds, stop checking
      setTimeout(() => {
        clearInterval(progressInterval);
        clearInterval(healthCheckInterval);
        setStatus((prev) => ({
          ...prev,
          isChecking: false,
        }));
      }, 60000);
    };

    startChecking();

    return () => {
      clearInterval(progressInterval);
      clearInterval(healthCheckInterval);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (!status.isChecking && status.isConnected && !showSuccess) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        minWidth: 300,
        maxWidth: '90%',
      }}
    >
      <Collapse in={status.isChecking || showSuccess}>
        {status.isConnected ? (
          <Alert
            icon={<CheckCircleIcon fontSize="inherit" />}
            severity="success"
            sx={{ mb: 2 }}
          >
            Połączono z serwerem
          </Alert>
        ) : (
          <Alert
            icon={<CircularProgress size={20} />}
            severity="info"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="body2" gutterBottom>
                Uruchamianie serwera (ok 1min)...
              </Typography>
              <Typography variant="body2" gutterBottom>
                Serwer sie uruchamia, możesz zaczekać lub wrócić za chwilę.
              </Typography>
              <LinearProgress
                variant="determinate"
                value={status.progress}
                sx={{ mt: 1 }}
              />
            </Box>
          </Alert>
        )}
      </Collapse>
    </Box>
  );
}; 