import React from 'react';

import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { WeekStartDay, settingsStore } from '../../stores/SettingsStore';

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
] as const;

export const Settings = observer(() => {
  const handleWeekStartChange = (event: any) => {
    settingsStore.setWeekStartsOn(event.target.value as WeekStartDay);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          Journal Settings
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="week-start-label">Week Starts On</InputLabel>
          <Select
            labelId="week-start-label"
            value={settingsStore.weekStartsOn}
            label="Week Starts On"
            onChange={handleWeekStartChange}
          >
            {DAYS.map((day) => (
              <MenuItem key={day.value} value={day.value}>
                {day.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
    </Box>
  );
});
