import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { WeekStartDay } from '../../../stores/SettingsStore';
import { JournalEntry } from '../types';

interface WeekDayEntry {
  date: Date;
  entry: JournalEntry | null;
}

export const groupEntriesByWeek = (entries: JournalEntry[], weekStartsOn: WeekStartDay) => {
  if (!entries?.length) return [];

  // Sort entries by date in descending order
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const weeks = new Map<string, { weekStart: Date; entries: JournalEntry[] }>();

  sortedEntries.forEach(entry => {
    const date = new Date(entry.date);
    const weekStart = startOfWeek(date, { weekStartsOn });
    const key = format(weekStart, 'yyyy-MM-dd');

    if (!weeks.has(key)) {
      weeks.set(key, {
        weekStart,
        entries: [],
      });
    }

    weeks.get(key)!.entries.push(entry);
  });

  return Array.from(weeks.values())
    .sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime());
};

export const formatWeekRange = (weekStart: Date, weekStartsOn: WeekStartDay): string => {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn });
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
};

export const getWeekDays = (weekStart: Date, weekStartsOn: WeekStartDay, entries: JournalEntry[]): WeekDayEntry[] => {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  return days.map(day => ({
    date: day,
    entry: entries.find(entry => isSameDay(new Date(entry.date), day)) || null
  }));
}; 