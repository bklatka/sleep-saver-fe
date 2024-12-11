import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid,
  Tooltip
} from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import SpeedIcon from '@mui/icons-material/Speed';

interface SleepMetricsProps {
  minutesInBed: number | null;
  minutesSleeping: number | null;
  sleepingEfficiency: number | null;
}

export const SleepMetricsSummary = ({ minutesInBed, minutesSleeping, sleepingEfficiency }: SleepMetricsProps) => {
  const formatHoursAndMinutes = (minutes: number | null) => {
    if (minutes === null) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m (${minutes}m)`;
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Total time spent in bed">
            <Box display="flex" alignItems="center" gap={1}>
              <BedIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">Time in Bed</Typography>
                <Typography variant="h6">{formatHoursAndMinutes(minutesInBed)}</Typography>
              </Box>
            </Box>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Actual time spent sleeping">
            <Box display="flex" alignItems="center" gap={1}>
              <NightsStayIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">Time Sleeping</Typography>
                <Typography variant="h6">{formatHoursAndMinutes(minutesSleeping)}</Typography>
              </Box>
            </Box>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Sleep efficiency percentage">
            <Box display="flex" alignItems="center" gap={1}>
              <SpeedIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">Sleep Efficiency</Typography>
                <Typography variant="h6">
                  {sleepingEfficiency !== null ? `${sleepingEfficiency}%` : '-'}
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  );
}; 