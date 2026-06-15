import Dexie, { type Table } from 'dexie';
import type { VocabEntry, Lesson, ReviewSession } from '../types';

export class VietLearnDB extends Dexie {
  vocab!: Table<VocabEntry, string>;
  lessons!: Table<Lesson, string>;
  sessions!: Table<ReviewSession, string>;

  constructor() {
    super('VietLearnDB');
    this.version(1).stores({
      vocab: 'id, vietnamese, mastery, createdAt',
      lessons: 'id, title, createdAt',
      sessions: 'id, date',
    });
  }
}

export const db = new VietLearnDB();
