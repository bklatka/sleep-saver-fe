import React from 'react';
import ReactDOM from 'react-dom/client';

import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App / >
  </React.StrictMode>
);

// Enable hot module replacement
if (module.hot) {
  module.hot.accept();
}
