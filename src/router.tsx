import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './features/Layout/Layout';
import { Dashboard } from './features/Dashboard/Dashboard';
import { Journal } from './features/Journal/Journal';
import { JournalPage } from './features/Journal/JournalPage';
import { Login } from './features/Login/Login';
import { Settings } from './features/Settings/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';

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
    path: "*",
    element: <Navigate to="/" />,
  }
]); 