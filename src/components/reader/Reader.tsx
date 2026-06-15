import { useState } from 'react';
import { useVocabStore } from '../../stores/vocabStore';
import { Zap } from 'lucide-react';

export default function Reader() {
  const { entries } = useVocabStore();
  const [mode, setMode] = useState<'input' | 'reading'>('input');
  const [text, setText] = useState('');
  const [tokens, setTokens] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleStartReading = () => {
    const tokenized = text.trim().split(/\s+/);
    setTokens(tokenized);
    setMode('reading');
  };

  const getMasteryColor = (word: string) => {
    const entry = entries.find(e => e.vietnamese === word);
    if (!entry) return 'bg-blue-100 text-blue-800';
    if (entry.mastery === 1) return 'bg-blue-100 text-blue-800';
    if (entry.mastery === 2 || entry.mastery === 3) return 'bg-yellow-100 text-yellow-800';
    if (entry.mastery === 4) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getWord = (word: string) => {
    return entries.find(e => e.vietnamese === word);
  };

  if (mode === 'input') {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">リーダー</h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            ベトナム語テキストを貼り付け
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ベトナム語のテキストをここに貼り付けてください..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white resize-none"
          />

          <button
            onClick={handleStartReading}
            disabled={!text.trim()}
            className="mt-6 w-full bg-vietnamese hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            レッスン開始
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">リーダー</h1>
        <button
          onClick={() => {
            setMode('input');
            setTokens([]);
            setText('');
            setSelectedWord(null);
          }}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg"
        >
          戻る
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 mb-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tokens.map((token, idx) => {
            const isSelected = selectedWord === token;
            return (
              <button
                key={idx}
                onClick={() => setSelectedWord(isSelected ? null : token)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  isSelected ? 'ring-2 ring-vietnamese' : ''
                } ${getMasteryColor(token)}`}
              >
                {token}
              </button>
            );
          })}
        </div>

        {selectedWord && (
          <div className="border-t border-gray-300 dark:border-gray-600 pt-6 mt-6">
            <div className="mb-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                選択中
              </p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedWord}
              </h2>
            </div>

            {getWord(selectedWord) ? (
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {getWord(selectedWord)!.japanese.join(' / ')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {getWord(selectedWord)!.pronunciation}
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  例: {getWord(selectedWord)!.exampleJa}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  この単語は登録されていません
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                  AI翻訳で追加
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">凡例</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">新規</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">学習中</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">定着</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">未登録</span>
          </div>
        </div>
      </div>
    </div>
  );
}
