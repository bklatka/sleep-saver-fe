import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

import { config } from '../../../config';
import { userStore } from '../../../stores/UserStore';
import { JournalEntry } from '../types';

interface JournalInput {
  date: string;
  timeGoToBed: Date | null;
  timeDecidedToSleep: Date | null;
  minutesNeededToSleep: number | null;
  timesWokenUp: number | null;
  totalWokeupDuration: number | null;
  timeWakeupMorning: Date | null;
  timeOutOfBedMorning: Date | null;
  minutesFeelingSleepy: number | null;
  sleepingQuality: number | null;
  mood: number | null;
  comment: string | null;
}

const formatDateForApi = (date: Date | null): string | null => {
  if (!date) return null;
  return date.toISOString();
};

const transformFormData = (data: JournalInput): Record<string, any> => {
  return {
    date: data.date,
    timeGoToBed: formatDateForApi(data.timeGoToBed),
    timeDecidedToSleep: formatDateForApi(data.timeDecidedToSleep),
    minutesNeededToSleep: data.minutesNeededToSleep,
    timesWokenUp: data.timesWokenUp,
    totalWokeupDuration: data.totalWokeupDuration,
    timeWakeupMorning: formatDateForApi(data.timeWakeupMorning),
    timeOutOfBedMorning: formatDateForApi(data.timeOutOfBedMorning),
    minutesFeelingSleepy: data.minutesFeelingSleepy,
    sleepingQuality: data.sleepingQuality,
    mood: data.mood,
    comment: data.comment,
  };
};

export const useCreateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation<JournalEntry, Error, JournalInput>({
    mutationFn: async (data) => {
      const token = userStore.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${config.apiUrl}/journal/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformFormData(data)),
      });

      if (!response.ok) {
        throw new Error('Failed to create journal entry');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['journals'] });
    },
  });
};

export const useUpdateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation<JournalEntry, Error, { date: string; data: JournalInput }>({
    mutationFn: async ({ date, data }) => {
      const token = userStore.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${config.apiUrl}/journal/record/${date}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformFormData(data)),
      });

      if (!response.ok) {
        throw new Error('Failed to update journal entry');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      queryClient.invalidateQueries({ queryKey: ['journal', variables.date] });
    },
  });
}; 