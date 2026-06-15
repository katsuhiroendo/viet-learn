import { create } from 'zustand';
import type { MasteryLevel } from '../types';
import { db } from '../db/database';

interface StatsStore {
  totalWords: number;
  streak: number;
  masteryDistribution: Record<MasteryLevel, number>;
  weeklyStats: number[];
  loadStats: () => Promise<void>;
}

export const useStatsStore = create<StatsStore>((set) => ({
  totalWords: 0,
  streak: 0,
  masteryDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  weeklyStats: Array(7).fill(0),

  loadStats: async () => {
    const entries = await db.vocab.toArray();
    const sessions = await db.sessions.toArray();

    const totalWords = entries.length;

    // 習熟度分布
    const distribution: Record<MasteryLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    entries.forEach(e => {
      distribution[e.mastery]++;
    });

    // 連続学習日数
    const sortedSessions = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      if (currentDate.getTime() === sessionDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 週次統計（過去7日）
    const weeklyStats = Array(7).fill(0);
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(now);
      dayDate.setDate(dayDate.getDate() - i);
      dayDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(dayDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const daySessions = sessions.filter(s => {
        const sDate = new Date(s.date);
        return sDate >= dayDate && sDate < nextDay;
      });

      weeklyStats[6 - i] = daySessions.reduce((sum, s) => sum + s.wordsReviewed, 0);
    }

    set({ totalWords, streak, masteryDistribution: distribution, weeklyStats });
  },
}));
