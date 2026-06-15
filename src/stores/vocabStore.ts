import { create } from 'zustand';
import type { VocabEntry } from '../types';
import { db } from '../db/database';

interface VocabStore {
  entries: VocabEntry[];
  loading: boolean;
  loadVocab: () => Promise<void>;
  addEntry: (entry: VocabEntry) => Promise<void>;
  updateEntry: (entry: VocabEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntry: (id: string) => VocabEntry | undefined;
  search: (query: string) => VocabEntry[];
}

export const useVocabStore = create<VocabStore>((set, get) => ({
  entries: [],
  loading: false,

  loadVocab: async () => {
    set({ loading: true });
    try {
      const entries = await db.vocab.toArray();
      set({ entries });
    } finally {
      set({ loading: false });
    }
  },

  addEntry: async (entry: VocabEntry) => {
    await db.vocab.add(entry);
    const entries = await db.vocab.toArray();
    set({ entries });
  },

  updateEntry: async (entry: VocabEntry) => {
    await db.vocab.put(entry);
    const entries = await db.vocab.toArray();
    set({ entries });
  },

  deleteEntry: async (id: string) => {
    await db.vocab.delete(id);
    const entries = await db.vocab.toArray();
    set({ entries });
  },

  getEntry: (id: string) => {
    return get().entries.find(e => e.id === id);
  },

  search: (query: string) => {
    const lower = query.toLowerCase();
    return get().entries.filter(e =>
      e.vietnamese.toLowerCase().includes(lower) ||
      e.japanese.some(j => j.toLowerCase().includes(lower))
    );
  },
}));
