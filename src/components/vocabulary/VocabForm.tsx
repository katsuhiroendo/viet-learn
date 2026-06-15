import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabStore } from '../../stores/vocabStore';
import type { VocabEntry, SceneTag } from '../../types';
import { useSettingsStore } from '../../stores/settingsStore';
import { translateWord, generateExample } from '../../services/claudeAPI';
import { Wand2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const SCENE_OPTIONS: { value: SceneTag; label: string }[] = [
  { value: 'greetings', label: '挨拶・自己紹介' },
  { value: 'numbers', label: '数字・時間・日付' },
  { value: 'shopping', label: '買い物' },
  { value: 'restaurant', label: 'レストラン・飲食' },
  { value: 'transport', label: '交通・移動' },
  { value: 'housing', label: '住居・アパート' },
  { value: 'medical', label: '医療・薬局' },
  { value: 'emergency', label: '緊急時' },
];

interface VocabFormProps {
  initialData?: VocabEntry;
  onClose: () => void;
}

export default function VocabForm({ initialData, onClose }: VocabFormProps) {
  const navigate = useNavigate();
  const { addEntry, updateEntry } = useVocabStore();
  const { claudeApiKey } = useSettingsStore();

  const [vietnamese, setVietnamese] = useState(initialData?.vietnamese || '');
  const [pronunciation, setPronunciation] = useState(initialData?.pronunciation || '');
  const [japanese, setJapanese] = useState(initialData?.japanese.join(', ') || '');
  const [exampleVi, setExampleVi] = useState(initialData?.exampleVi || '');
  const [exampleJa, setExampleJa] = useState(initialData?.exampleJa || '');
  const [selectedScenes, setSelectedScenes] = useState<SceneTag[]>(
    initialData?.tags || []
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddScene = (scene: SceneTag) => {
    if (!selectedScenes.includes(scene)) {
      setSelectedScenes([...selectedScenes, scene]);
    }
  };

  const handleRemoveScene = (scene: SceneTag) => {
    setSelectedScenes(selectedScenes.filter(s => s !== scene));
  };

  const handleAutoTranslate = async () => {
    if (!vietnamese.trim()) {
      setError('ベトナム語を入力してください');
      return;
    }

    if (!claudeApiKey) {
      setError('Claude API キーが設定されていません');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [translationResult, exampleResult] = await Promise.all([
        translateWord(claudeApiKey, vietnamese),
        generateExample(claudeApiKey, vietnamese, selectedScenes[0] || 'greetings'),
      ]);

      setJapanese(translationResult.japanese.join(', '));
      setPronunciation(translationResult.pronunciation);
      setNotes(translationResult.notes);
      setExampleVi(exampleResult.vietnamese);
      setExampleJa(exampleResult.japanese);
    } catch (err) {
      setError(`エラー: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vietnamese.trim() || !japanese.trim()) {
      setError('必須項目を入力してください');
      return;
    }

    const entry: VocabEntry = initialData
      ? {
          ...initialData,
          vietnamese,
          pronunciation,
          japanese: japanese.split(',').map(j => j.trim()),
          exampleVi,
          exampleJa,
          tags: selectedScenes,
          notes,
          updatedAt: new Date(),
        }
      : {
          id: uuidv4(),
          vietnamese,
          pronunciation,
          japanese: japanese.split(',').map(j => j.trim()),
          exampleVi,
          exampleJa,
          tags: selectedScenes,
          mastery: 1,
          srsData: {
            interval: 0,
            repetitions: 0,
            easeFactor: 2.5,
            nextReviewDate: new Date(),
          },
          notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

    try {
      if (initialData) {
        await updateEntry(entry);
      } else {
        await addEntry(entry);
      }
      navigate('/vocabulary');
    } catch (err) {
      setError(`保存エラー: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {initialData ? '単語を編集' : '新規単語を追加'}
        </h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Vietnamese */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            ベトナム語 *
          </label>
          <input
            type="text"
            value={vietnamese}
            onChange={(e) => setVietnamese(e.target.value)}
            placeholder="Xin chào"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Pronunciation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            発音ガイド
          </label>
          <input
            type="text"
            value={pronunciation}
            onChange={(e) => setPronunciation(e.target.value)}
            placeholder="xin1 chao4"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Japanese */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            日本語訳 *
          </label>
          <input
            type="text"
            value={japanese}
            onChange={(e) => setJapanese(e.target.value)}
            placeholder="こんにちは, はじめまして"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white mb-2"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">複数の訳はカンマで区切る</p>
        </div>

        {/* Example */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              例文（ベトナム語）
            </label>
            <textarea
              value={exampleVi}
              onChange={(e) => setExampleVi(e.target.value)}
              placeholder="Xin chào, tôi là Katsuhiro."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              例文（日本語訳）
            </label>
            <textarea
              value={exampleJa}
              onChange={(e) => setExampleJa(e.target.value)}
              placeholder="こんにちは、私はカツヒロです。"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              rows={2}
            />
          </div>
        </div>

        {/* Scenes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            シーンタグ
          </label>
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedScenes.map(scene => (
              <span
                key={scene}
                className="bg-vietnamese text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {SCENE_OPTIONS.find(o => o.value === scene)?.label}
                <button
                  type="button"
                  onClick={() => handleRemoveScene(scene)}
                  className="hover:opacity-80"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SCENE_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAddScene(option.value)}
                disabled={selectedScenes.includes(option.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            メモ
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="使い方のコツやニュアンスなど..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={loading || !vietnamese.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
          >
            <Wand2 className="w-5 h-5" />
            {loading ? 'AI翻訳中...' : 'AI翻訳'}
          </button>
          <button
            type="submit"
            className="flex-1 bg-vietnamese hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg"
          >
            {initialData ? '更新' : '保存'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-bold py-3 px-4 rounded-lg"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
