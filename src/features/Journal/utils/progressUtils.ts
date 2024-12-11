import { JournalEntry } from '../types';

export const calculateCompletedFields = (entry: JournalEntry): number => {
  const requiredFields: (keyof JournalEntry)[] = [
    'timeGoToBed',
    'timeDecidedToSleep',
    'minutesNeededToSleep',
    'timesWokenUp',
    'totalWokeupDuration',
    'timeWakeupMorning',
    'timeOutOfBedMorning',
    'minutesFeelingSleepy',
    'sleepingQuality',
    'mood'
  ];

  return requiredFields.filter(field => {
    const value = entry[field];
    return value !== null && value !== undefined && value !== '';
  }).length;
};

export const TOTAL_REQUIRED_FIELDS = 10; // All fields except comment 