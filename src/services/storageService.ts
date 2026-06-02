import type { LearningPodcast } from "../types";

const STORAGE_KEY = "island-lingua-lite:podcasts";

export function getPodcasts(): LearningPodcast[] {
  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePodcast(podcast: LearningPodcast): void {
  const podcasts = getPodcasts();
  writePodcasts([podcast, ...podcasts.filter((item) => item.id !== podcast.id)]);
}

export function updatePodcast(podcast: LearningPodcast): void {
  const podcasts = getPodcasts();
  writePodcasts(podcasts.map((item) => (item.id === podcast.id ? podcast : item)));
}

export function deletePodcast(id: string): void {
  writePodcasts(getPodcasts().filter((podcast) => podcast.id !== id));
}

export function getPodcastById(id: string): LearningPodcast | undefined {
  return getPodcasts().find((podcast) => podcast.id === id);
}

function writePodcasts(podcasts: LearningPodcast[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(podcasts));
}
