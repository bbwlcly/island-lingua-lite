import type { LearningPodcast, PodcastSentence } from "../types";

type LlmPodcastResponse = {
  title: string;
  summaryCn: string;
  sentences: Array<Omit<PodcastSentence, "id" | "status">>;
};

const sentenceSeeds: Array<Omit<PodcastSentence, "id" | "status">> = [
  {
    textEn: "Today, I want to slow down and think about how I learn English.",
    textCn: "今天，我想慢下来，想一想我是如何学习英语的。",
    chunking: ["Today", "I want to slow down", "and think about how I learn English"],
    stressWords: ["today", "slow down", "learn English"],
    commonMistakes: [
      'Keep the /w/ sound clear in "want".',
      'Link "think about" smoothly without adding an extra vowel.',
    ],
    shadowingPrompt: "Listen once, then repeat in three calm chunks.",
  },
  {
    textEn: "I do not need a complicated system before I can begin.",
    textCn: "在开始之前，我并不需要一个复杂的系统。",
    chunking: ["I do not need", "a complicated system", "before I can begin"],
    stressWords: ["need", "complicated system", "begin"],
    commonMistakes: [
      'Do not drop the final /d/ in "need".',
      'Make "complicated" four clear beats: com-pli-ca-ted.',
    ],
    shadowingPrompt: "Repeat slowly first, then try a more natural rhythm.",
  },
  {
    textEn: "What I need most is a short, natural script that I can hear and repeat.",
    textCn: "我最需要的是一段简短自然、可以听也可以跟读的稿子。",
    chunking: ["What I need most", "is a short, natural script", "that I can hear and repeat"],
    stressWords: ["need most", "short", "natural script", "hear", "repeat"],
    commonMistakes: [
      'Keep the /r/ sound in "repeat" relaxed but present.',
      'Do not pronounce "natural" like a Chinese pinyin sound; aim for NAT-chur-al.',
    ],
    shadowingPrompt: "Listen for the rise and fall, then copy the melody.",
  },
  {
    textEn: "When each sentence is clear, shadowing feels lighter and more focused.",
    textCn: "当每个句子都清楚时，跟读会变得更轻松，也更专注。",
    chunking: ["When each sentence is clear", "shadowing feels lighter", "and more focused"],
    stressWords: ["each sentence", "clear", "lighter", "focused"],
    commonMistakes: [
      'Connect "sentence is" gently.',
      'Pay attention to the final /t/ in "light".',
    ],
    shadowingPrompt: "Repeat one chunk at a time, then join the full sentence.",
  },
  {
    textEn: "Little by little, I can build confidence through steady practice.",
    textCn: "一点一点地，我可以通过稳定练习建立信心。",
    chunking: ["Little by little", "I can build confidence", "through steady practice"],
    stressWords: ["little by little", "build confidence", "steady practice"],
    commonMistakes: [
      'The /th/ in "through" needs the tongue lightly between the teeth.',
      'Do not swallow the final sound in "practice".',
    ],
    shadowingPrompt: "Say it softly first, then repeat with clearer stress.",
  },
];

export async function generatePodcastFromLongText(sourceTextCn: string): Promise<LearningPodcast> {
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  const response = buildMockResponse(sourceTextCn);

  return {
    id: crypto.randomUUID(),
    title: response.title,
    sourceTextCn,
    summaryCn: response.summaryCn,
    sentences: response.sentences.map((sentence) => ({
      ...sentence,
      id: crypto.randomUUID(),
      status: "new",
    })),
    createdAt: new Date().toISOString(),
  };
}

function buildMockResponse(sourceTextCn: string): LlmPodcastResponse {
  const trimmed = sourceTextCn.trim();
  const cleanPreview = trimmed.replace(/\s+/g, " ").slice(0, 34);
  const title = cleanPreview ? `A Calm Practice: ${cleanPreview}` : "A Calm English Practice";
  const summaryCn = cleanPreview
    ? `根据这段中文内容生成的英语跟读播客草稿：${cleanPreview}${trimmed.length > 34 ? "..." : ""}`
    : "一段用于英语跟读的自然播客稿。";

  return {
    title,
    summaryCn,
    sentences: sentenceSeeds,
  };
}
