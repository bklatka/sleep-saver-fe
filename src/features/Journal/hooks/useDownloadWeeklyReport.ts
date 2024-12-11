import { useMutation } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';

import { config } from '../../../config';
import { settingsStore } from '../../../stores/SettingsStore';
import { userStore } from '../../../stores/UserStore';

const downloadPDF = async (weekStart: Date) => {
  const from = format(weekStart, 'yyyy-MM-dd');
  const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
  const token = userStore.getAuthToken();

  if (!token) throw new Error('No auth token');

  const response = await fetch(`${config.apiUrl}/journal/report?from=${from}&to=${to}`, {
    headers: {
      Accept: 'application/pdf',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to download PDF: ${errorText}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sleep-journal-${from}-to-${to}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const useDownloadWeeklyReport = () => {
  return useMutation({
    mutationFn: downloadPDF,
  });
};
