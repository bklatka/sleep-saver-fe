import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import { userStore } from '../stores/UserStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = observer(({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!userStore.isLoggedIn) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
});
