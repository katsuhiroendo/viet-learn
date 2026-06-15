import { useState, useEffect } from 'react';
import type { VocabEntry } from '../../types';
import { useVocabStore } from '../../stores/vocabStore';

interface MultipleChoiceProps {
  entry: VocabEntry;
  onAnswer: (isCorrect: boolean) => void;
}

export default function MultipleChoice({ entry, onAnswer }: MultipleChoiceProps) {
  const { entries } = useVocabStore();
  const [options, setOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // 正解を含む4つの選択肢を作成
    const correctAnswer = entry.japanese[0];
    const otherAnswers = entries
      .filter(e => e.id !== entry.id && e.japanese[0])
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(e => e.japanese[0]);

    const allOptions = [correctAnswer, ...otherAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  }, [entry, entries]);

  const handleSelectAnswer = (answer: string) => {
    const correct = answer === entry.japanese[0];
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">ベトナム語</p>
        <h2 className="text-4xl font-bold text-vietnamese">{entry.vietnamese}</h2>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
        このベトナム語の意味は？
      </p>

      {!showResult ? (
        <div className="space-y-3">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(option)}
              className="w-full p-4 text-left border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-vietnamese hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
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
              正しい答え：<span className="font-bold">{entry.japanese[0]}</span>
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
