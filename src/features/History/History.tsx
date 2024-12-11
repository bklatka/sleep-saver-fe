import React from 'react';

import { Paper, Typography } from '@mui/material';

import * as styles from './History.module.css';

export const History = () => {
  return (
    <div className={styles.container}>
      <Typography className={styles.title}>History</Typography>
      <Paper className={styles.card}>
        <div className={styles.chart}>{/* Add chart component here */}</div>
      </Paper>
    </div>
  );
};
