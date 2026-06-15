import { useState } from 'react';
import type { VocabEntry } from '../../types';

interface FillBlankProps {
  entry: VocabEntry;
  onAnswer: (isCorrect: boolean) => void;
}

export default function FillBlank({ entry, onAnswer }: FillBlankProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 複数の可能な答えを許容
    const correctAnswers = entry.japanese.map(j => j.toLowerCase().trim());
    const userAnswerNormalized = userAnswer.toLowerCase().trim();
    const correct = correctAnswers.includes(userAnswerNormalized);

    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">日本語訳を答える</p>
        <h2 className="text-4xl font-bold text-vietnamese mb-4">{entry.vietnamese}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          例: {entry.exampleJa}
        </p>
      </div>

      {!showResult ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="日本語で答える..."
            autoFocus
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-vietnamese hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg"
          >
            回答する
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div
            className={`p-6 rounded-lg ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700'
            }`}
          >
            <p
              className={`text-lg font-bold ${
                isCorrect
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-red-800 dark:text-red-300'
              }`}
            >
              {isCorrect ? '正解！' : '不正解'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              あなたの答え：<span className="font-semibold">{userAnswer}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              正しい答え：<span className="font-bold">{entry.japanese.join(' / ')}</span>
            </p>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-vietnamese hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
