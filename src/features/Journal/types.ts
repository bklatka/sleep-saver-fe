export interface JournalEntry {
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
