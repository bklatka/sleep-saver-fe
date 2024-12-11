import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Button, Paper, TextField, Typography } from '@mui/material';

import * as styles from './Login.module.css';
import { useLogin } from './useLogin';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: login, isPending: isLoading } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: () => {
          // Redirect to the page they tried to visit or dashboard
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        },
        onError: (error) => {
          console.error('Login failed:', error);
        },
      }
    );
  };

  return (
    <Box className={styles.container}>
      <Paper className={styles.paper}>
        <Typography variant="h4" className={styles.title}>
          Login
        </Typography>
        <form onSubmit={handleLogin} className={styles.form}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
