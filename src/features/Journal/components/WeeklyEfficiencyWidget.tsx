import React from 'react';

import { Box, Paper, Typography } from '@mui/material';
import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { settingsStore } from '../../../stores/SettingsStore';
import { useJournalQuery } from '../hooks/useJournalQuery';

interface DataPoint {
  date: string;
  efficiency: number | null;
}

export const WeeklyEfficiencyWidget = observer(() => {
  const { data: journals } = useJournalQuery();
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: settingsStore.weekStartsOn });
  const weekEnd = endOfWeek(today, { weekStartsOn: settingsStore.weekStartsOn });

  const data: DataPoint[] = React.useMemo(() => {
    if (!journals) return [];

    return eachDayOfInterval({ start: weekStart, end: weekEnd }).map((date) => {
      const entry = journals.find(
        (journal) => format(new Date(journal.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );

      return {
        date: format(date, 'EEE'),
        efficiency: entry?.sleepingEfficiency ?? null,
      };
    });
  }, [journals, weekStart, weekEnd]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const efficiency = payload[0].value;
      return (
        <Paper sx={{ p: 1 }}>
          <Typography variant="body2">
            {label}: {efficiency !== null ? `${efficiency}%` : 'No data'}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Sleep Efficiency This Week
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#666" />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              stroke="#666"
              label={{
                value: 'Efficiency %',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#1976d2"
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
});
