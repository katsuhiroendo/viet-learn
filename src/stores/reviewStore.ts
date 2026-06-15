import { create } from 'zustand';
import type { VocabEntry, ReviewSession } from '../types';
import { db } from '../db/database';
import { getTodayQueue } from '../services/srs';

interface ReviewStore {
  currentQueue: VocabEntry[];
  currentIndex: number;
  sessionStart: Date | null;
  correct: number;
  loadTodayQueue: (limit: number) => Promise<void>;
  resetSession: () => void;
  nextCard: () => void;
  previousCard: () => void;
  markCorrect: () => void;
  saveSession: () => Promise<void>;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  currentQueue: [],
  currentIndex: 0,
  sessionStart: null,
  correct: 0,

  loadTodayQueue: async (limit: number) => {
    const queue = await getTodayQueue(db, limit);
    // シャッフル
    const shuffled = [...queue].sort(() => Math.random() - 0.5);
    set({ currentQueue: shuffled, currentIndex: 0, sessionStart: new Date(), correct: 0 });
  },

  resetSession: () => {
    set({ currentQueue: [], currentIndex: 0, sessionStart: null, correct: 0 });
  },

  nextCard: () => {
    const state = get();
    if (state.currentIndex < state.currentQueue.length - 1) {
      set({ currentIndex: state.currentIndex + 1 });
    }
  },

  previousCard: () => {
    const state = get();
    if (state.currentIndex > 0) {
      set({ currentIndex: state.currentIndex - 1 });
    }
  },

  markCorrect: () => {
    set({ correct: get().correct + 1 });
  },

  saveSession: async () => {
    const state = get();
    if (state.sessionStart) {
      const session: ReviewSession = {
        id: `session-${Date.now()}`,
        date: state.sessionStart,
        wordsReviewed: state.currentQueue.length,
        correct: state.correct,
        duration: Math.floor((Date.now() - state.sessionStart.getTime()) / 1000),
      };
      await db.sessions.add(session);
      state.resetSession();
    }
  },
}));
