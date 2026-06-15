import type { TranslateResponse, ExampleSentence } from '../types';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

interface TranslateResponseRaw {
  japanese: string[];
  pronunciation: string;
  notes: string;
}

interface ExampleSentenceRaw {
  vietnamese: string;
  japanese: string;
}

/**
 * ベトナム語単語を日本語に翻訳し、発音ガイドと用例を生成
 */
export async function translateWord(
  apiKey: string,
  word: string,
  context?: string
): Promise<TranslateResponse> {
  const prompt = `ベトナム語の単語またはフレーズを分析してください。

単語: ${word}
${context ? `文脈: ${context}` : ''}

以下のJSON形式で回答してください（他のテキストは不要）:
{
  "japanese": ["主な訳1", "訳2（あれば）"],
  "pronunciation": "声調番号付きの読み方（例: xin1 chao4）",
  "notes": "使い方のコツやニュアンスの説明（50文字以内）"
}`;

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json() as any;
  const text = data.content[0].text;
  const result: TranslateResponseRaw = JSON.parse(text);

  return result as TranslateResponse;
}

/**
 * 単語を使った例文を生成
 */
export async function generateExample(
  apiKey: string,
  word: string,
  scene: string
): Promise<ExampleSentence> {
  const prompt = `ベトナム語の「${word}」を使った自然な例文を作成してください。
シーン: ${scene}
難易度: A1〜A2（超初心者向け、短文）

JSON形式で回答:
{
  "vietnamese": "ベトナム語の例文",
  "japanese": "日本語訳"
}`;

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json() as any;
  const result: ExampleSentenceRaw = JSON.parse(data.content[0].text);

  return result as ExampleSentence;
}

/**
 * AI会話練習（ロールプレイ）
 */
export async function chatPractice(
  apiKey: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  scene: string
): Promise<{ reply: string; corrections: string[] }> {
  const systemPrompt = `あなたはベトナム語の会話練習パートナーです。
シーン: ${scene}
ユーザーは日本語話者の60歳男性で、ベトナム移住を2028年に予定しています。
A1〜A2レベルを想定し、以下のルールで会話してください:

1. ベトナム語でロールプレイを進める
2. ユーザーのベトナム語に文法・表現の間違いがあれば、回答の最後に【修正】として指摘
3. 難しい単語は () 内に日本語訳を添える
4. 返答は短くシンプルに保つ

JSON形式で回答:
{
  "reply": "ベトナム語の返答（括弧内に日本語訳）",
  "corrections": ["修正点1（あれば）", "修正点2（あれば）"]
}`;

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json() as any;
  return JSON.parse(data.content[0].text);
}
