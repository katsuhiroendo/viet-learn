import { create } from 'zustand';
import type { AppSettings } from '../types';

const defaultSettings: AppSettings = {
  dailyReviewLimit: 30,
  newWordsPerDay: 10,
  claudeApiKey: '',
  darkMode: false,
  migrationDate: new Date('2028-08-01'),
  fontSize: 'normal',
};

interface SettingsStore extends AppSettings {
  loadSettings: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setClaudeApiKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...defaultSettings,

  loadSettings: () => {
    const stored = localStorage.getItem('viet-learn-settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.migrationDate = new Date(parsed.migrationDate);
        set(parsed);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  },

  updateSettings: (updates: Partial<AppSettings>) => {
    set((state) => {
      const newState = { ...state, ...updates };
      localStorage.setItem('viet-learn-settings', JSON.stringify({
        ...newState,
        migrationDate: newState.migrationDate.toISOString(),
      }));
      return newState;
    });
  },

  setClaudeApiKey: (key: string) => {
    set((state) => {
      const newState = { ...state, claudeApiKey: key };
      localStorage.setItem('viet-learn-settings', JSON.stringify({
        ...newState,
        migrationDate: newState.migrationDate.toISOString(),
      }));
      return newState;
    });
  },
}));
