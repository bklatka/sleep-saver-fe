import React from 'react';
import { Grid } from '@mui/material';
import { TodayWidget } from '../Journal/components/TodayWidget';
import { WeekProgressWidget } from '../Journal/components/WeekProgressWidget';
import { WeeklyEfficiencyWidget } from '../Journal/components/WeeklyEfficiencyWidget';

import { useJournalQuery } from '../Journal/hooks/useJournalQuery';
import { format, startOfWeek } from 'date-fns';
import { settingsStore } from '../../stores/SettingsStore';
import { JournalEntry } from '../Journal/types';

export const Dashboard = () => {
  const { data: journals } = useJournalQuery();
  const today = format(new Date(), 'yyyy-MM-dd');
  const weekStart = startOfWeek(new Date(), { weekStartsOn: settingsStore.weekStartsOn });
  
  const todayEntry = journals?.find((entry: JournalEntry) => {
    const entryDate = new Date(entry.date);
    const todayDate = new Date(today);
    return entryDate.getTime() === todayDate.getTime();
  }) || null;
  const weekJournals = journals?.filter((entry: JournalEntry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate < new Date();
  }) || [];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TodayWidget todayEntry={todayEntry} />
      </Grid>
      <Grid item xs={12} md={6}>
        <WeekProgressWidget journals={weekJournals} />
      </Grid>
      <Grid item xs={12}>
        <WeeklyEfficiencyWidget />
      </Grid>
    </Grid>
  );
};
