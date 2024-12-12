import React from 'react';

import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import pl from 'date-fns/locale/pl';

import { WeekStartDay, settingsStore } from '../../stores/SettingsStore';

const DAYS = [
  { value: 1, label: 'Poniedziałek' },
  { value: 2, label: 'Wtorek' },
  { value: 3, label: 'Środa' },
  { value: 4, label: 'Czwartek' },
  { value: 5, label: 'Piątek' },
  { value: 6, label: 'Sobota' },
  { value: 0, label: 'Niedziela' },
] as const;

export const Settings = observer(() => {
  const handleWeekStartChange = (event: any) => {
    settingsStore.setWeekStartsOn(event.target.value as WeekStartDay);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Ustawienia
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          Ustawienia dziennika
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="week-start-label">Początek tygodnia</InputLabel>
          <Select
            labelId="week-start-label"
            value={settingsStore.weekStartsOn}
            label="Początek tygodnia"
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
