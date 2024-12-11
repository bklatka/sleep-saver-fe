import React from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, CircularProgress, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { eachDayOfInterval, endOfWeek, format, isSameDay, startOfWeek } from 'date-fns';

import { settingsStore } from '../../../stores/SettingsStore';
import { JournalEntry } from '../types';
import { TOTAL_REQUIRED_FIELDS, calculateCompletedFields } from '../utils/progressUtils';

interface WeekProgressWidgetProps {
  journals: JournalEntry[] | undefined;
}

export const WeekProgressWidget = ({ journals }: WeekProgressWidgetProps) => {
  const weekStats = React.useMemo(() => {
    if (!journals?.length) return { completedDays: 0, totalDays: 7, completedEntries: [] };

    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: settingsStore.weekStartsOn }); // Start from Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: settingsStore.weekStartsOn });

    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const completedEntries = journals.filter((entry) => {
      const entryDate = new Date(entry.date);
      return daysInWeek.some(
        (day) =>
          isSameDay(day, entryDate) && calculateCompletedFields(entry) === TOTAL_REQUIRED_FIELDS
      );
    });

    return {
      completedDays: completedEntries.length,
      totalDays: 7,
      completedEntries,
    };
  }, [journals]);

  const progress = (weekStats.completedDays / weekStats.totalDays) * 100;
  const isComplete = weekStats.completedDays === weekStats.totalDays;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        minWidth: 250,
        height: '100%',
        minHeight: 300,
      }}
    >
      <Typography variant="h6" color="primary">
        This Week's Progress
      </Typography>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={80}
          thickness={4}
          sx={{
            color: isComplete ? 'success.main' : 'primary.main',
            backgroundColor: 'action.hover',
            borderRadius: '50%',
          }}
        />
        {isComplete ? (
          <CheckCircleIcon
            color="success"
            sx={{
              position: 'absolute',
              fontSize: 40,
            }}
          />
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              position: 'absolute',
            }}
          >
            {weekStats.completedDays}/{weekStats.totalDays}
          </Typography>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" align="center">
        {isComplete
          ? 'All days completed this week!'
          : `${weekStats.completedDays} of ${weekStats.totalDays} days completed`}
      </Typography>

      <Tooltip title="Days are counted as complete when all fields are filled">
        <Typography variant="caption" color="text.secondary" align="center">
          Complete entries required
        </Typography>
      </Tooltip>
    </Paper>
  );
};
