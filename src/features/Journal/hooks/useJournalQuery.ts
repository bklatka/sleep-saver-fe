import { useQuery } from '@tanstack/react-query';

import { config } from '../../../config';
import { userStore } from '../../../stores/UserStore';

interface JournalEntry {
  _id: string;
  date: string;
  timeGoToBed: string | null;
  timeDecidedToSleep: string | null;
  minutesNeededToSleep: number | null;
  timesWokenUp: number | null;
  totalWokeupDuration: number | null;
  timeWakeupMorning: string | null;
  timeOutOfBedMorning: string | null;
  minutesSpentInBed: number | null;
  minutesSleeping: number | null;
  sleepingEfficiency: number | null;
  minutesFeelingSleepy: number | null;
  sleepingQuality: number | null;
  mood: number | null;
  comment: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const useJournalQuery = () => {
  return useQuery<JournalEntry[]>({
    queryKey: ['journals'],
    queryFn: async () => {
      const token = userStore.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${config.apiUrl}/journal/records`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch journal entries');
      }

      return response.json();
    },
    enabled: userStore.isLoggedIn, // Only run query if user is logged in
  });
};
