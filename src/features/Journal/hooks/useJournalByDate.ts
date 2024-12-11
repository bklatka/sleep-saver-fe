import { useQuery } from '@tanstack/react-query';

import { config } from '../../../config';
import { userStore } from '../../../stores/UserStore';
import { JournalEntry } from '../types';

export const useJournalByDate = (date: string) => {
  return useQuery<JournalEntry>({
    queryKey: ['journal', date],
    queryFn: async () => {
      const token = userStore.getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${config.apiUrl}/journal/record/${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch journal entry');
      }

      return response.json();
    },
  });
};
