import React from 'react';

import BedIcon from '@mui/icons-material/Bed';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import SpeedIcon from '@mui/icons-material/Speed';
import { Box, Grid, Paper, Tooltip, Typography } from '@mui/material';

interface SleepMetricsProps {
  minutesInBed: number | null;
  minutesSleeping: number | null;
  sleepingEfficiency: number | null;
}

export const SleepMetricsSummary = ({
  minutesInBed,
  minutesSleeping,
  sleepingEfficiency,
}: SleepMetricsProps) => {
  const formatHoursAndMinutes = (minutes: number | null) => {
    if (minutes === null) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m (${minutes}min)`;
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Całkowity czas spędzony w łóżku">
            <Box display="flex" alignItems="center" gap={1}>
              <BedIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Czas w łóżku
                </Typography>
                <Typography variant="h6">{formatHoursAndMinutes(minutesInBed)}</Typography>
              </Box>
            </Box>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Rzeczywisty czas snu">
            <Box display="flex" alignItems="center" gap={1}>
              <NightsStayIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Czas snu
                </Typography>
                <Typography variant="h6">{formatHoursAndMinutes(minutesSleeping)}</Typography>
              </Box>
            </Box>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Procent efektywności snu">
            <Box display="flex" alignItems="center" gap={1}>
              <SpeedIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Efektywność snu
                </Typography>
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
