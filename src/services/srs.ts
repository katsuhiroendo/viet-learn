import { VietLearnDB } from '../db/database';
import type { VocabEntry } from '../types';

export interface SM2Input {
  easeFactor: number;    // 現在の難易度係数
  interval: number;      // 現在の間隔（日数）
  repetitions: number;   // 連続正解回数
  grade: number;         // 今回の評価（0〜5）
}

export interface SM2Output {
  easeFactor: number;
  interval: number;
  repetitions: number;
}

/**
 * SM-2アルゴリズム計算
 * grade: 0=完全忘却, 1=難しかった, 2=なんとか正解, 3=正解（少し迷い）, 4=正解, 5=完璧
 */
export function calculateSM2(input: SM2Input): SM2Output {
  const { easeFactor, interval, repetitions, grade } = input;

  let newEF = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  newEF = Math.max(1.3, newEF); // 最小値1.3

  let newInterval: number;
  let newRepetitions: number;

  if (grade < 3) {
    // 不正解 → リセット
    newInterval = 1;
    newRepetitions = 0;
  } else {
    // 正解
    newRepetitions = repetitions + 1;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEF);
    }
  }

  return {
    easeFactor: newEF,
    interval: newInterval,
    repetitions: newRepetitions,
  };
}

/**
 * 本日の復習キューを取得
 */
export async function getTodayQueue(db: VietLearnDB, limit: number): Promise<VocabEntry[]> {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // nextReviewDateがtoday以下の単語を取得
  const allVocab = await db.vocab.toArray();
  const queue = allVocab
    .filter((entry) => new Date(entry.srsData.nextReviewDate) <= today)
    .sort((a, b) => new Date(a.srsData.nextReviewDate).getTime() - new Date(b.srsData.nextReviewDate).getTime())
    .slice(0, limit);

  return queue;
}

/**
 * 次回復習日を計算
 */
export function calculateNextReviewDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date;
}
