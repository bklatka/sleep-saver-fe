import { makeAutoObservable } from 'mobx';

export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface Settings {
  weekStartsOn: WeekStartDay;
}

class SettingsStore {
  private settings: Settings = {
    weekStartsOn: 1, // Default to Monday
  };

  constructor() {
    makeAutoObservable(this);
    this.loadSettings();
  }

  private loadSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
  }

  private saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
  }

  get weekStartsOn(): WeekStartDay {
    return this.settings.weekStartsOn;
  }

  setWeekStartsOn(day: WeekStartDay) {
    this.settings.weekStartsOn = day;
    this.saveSettings();
  }
}

export const settingsStore = new SettingsStore(); 