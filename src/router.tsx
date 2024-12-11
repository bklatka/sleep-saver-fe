import React from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './features/Dashboard/Dashboard';
import { Journal } from './features/Journal/Journal';
import { JournalPage } from './features/Journal/JournalPage';
import { Layout } from './features/Layout/Layout';
import { Login } from './features/Login/Login';
import { Settings } from './features/Settings/Settings';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/journal',
        element: <Journal />,
      },
      {
        path: '/journal/:date',
        element: <JournalPage />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);
