import { useEffect, useState } from 'react';
import { useVocabStore } from '../../stores/vocabStore';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function VocabList() {
  const { entries, loadVocab, deleteEntry } = useVocabStore();
  const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVocab();
  }, []);

  const filtered = entries.filter(entry => {
    const matchesSearch =
      entry.vietnamese.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.japanese.some(j => j.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filter === 'all') return matchesSearch;
    if (filter === 'new') return matchesSearch && entry.mastery === 1;
    if (filter === 'learning') return matchesSearch && (entry.mastery === 2 || entry.mastery === 3);
    if (filter === 'mastered') return matchesSearch && (entry.mastery === 4 || entry.mastery === 5);
    return matchesSearch;
  });

  const getMasteryColor = (mastery: number) => {
    if (mastery === 1) return 'bg-blue-100 text-blue-800';
    if (mastery === 2 || mastery === 3) return 'bg-yellow-100 text-yellow-800';
    if (mastery === 4 || mastery === 5) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">単語帳</h1>
        <button className="bg-vietnamese hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          新規追加
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <input
          type="text"
          placeholder="単語を検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-4"
        />

        <div className="flex gap-2">
          {(['all', 'new', 'learning', 'mastered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f
                  ? 'bg-vietnamese text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              {f === 'all' && 'すべて'}
              {f === 'new' && '新規'}
              {f === 'learning' && '学習中'}
              {f === 'mastered' && '習熟'}
            </button>
          ))}
        </div>
      </div>

      {/* Word List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">単語が見つかりません</p>
          </div>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {entry.vietnamese}
                    </h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getMasteryColor(entry.mastery)}`}>
                      習熟度: {entry.mastery}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {entry.pronunciation}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 mb-2">
                    {entry.japanese.join(' / ')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    例: {entry.exampleVi}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Edit2 className="w-5 h-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
