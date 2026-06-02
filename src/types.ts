export type SentenceStatus = "new" | "practicing" | "familiar";

export type PodcastSentence = {
  id: string;
  textEn: string;
  textCn: string;
  chunking: string[];
  stressWords: string[];
  commonMistakes: string[];
  shadowingPrompt: string;
  status: SentenceStatus;
};

export type LearningPodcast = {
  id: string;
  title: string;
  sourceTextCn: string;
  summaryCn: string;
  sentences: PodcastSentence[];
  createdAt: string;
};
