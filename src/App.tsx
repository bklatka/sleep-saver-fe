import React from 'react';
import { BrowserRouter, Navigate, Route, RouterProvider, Routes } from 'react-router-dom';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { QueryClientProvider } from '@tanstack/react-query';

import { ProtectedRoute } from './components/ProtectedRoute';
import { Toast } from './components/Toast';
import { ServerStatusToast } from './components/ServerStatusToast';
import { Dashboard } from './features/Dashboard/Dashboard';
import { History } from './features/History/History';
import { Journal } from './features/Journal/Journal';
import { JournalPage } from './features/Journal/JournalPage';
import { Layout } from './features/Layout/Layout';
import { Login } from './features/Login/Login';
import { Settings } from './features/Settings/Settings';
import { queryClient } from './queryClient';
import { router } from './router';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <RouterProvider router={router} />
          <Toast />
          <ServerStatusToast />
        </LocalizationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
