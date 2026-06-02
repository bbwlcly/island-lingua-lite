import type { PodcastSentence } from "../types";

let activeUtterance: SpeechSynthesisUtterance | null = null;
let stopRequested = false;

export function speakSentence(text: string): Promise<void> {
  stopSpeaking();
  return speakText(text);
}

export async function speakPodcast(
  sentences: PodcastSentence[],
  onSentenceChange: (sentenceId: string) => void,
): Promise<void> {
  stopSpeaking();
  stopRequested = false;

  for (const sentence of sentences) {
    if (stopRequested) {
      break;
    }
    onSentenceChange(sentence.id);
    await speakText(sentence.textEn);
  }

  onSentenceChange("");
}

export function stopSpeaking(): void {
  stopRequested = true;
  activeUtterance = null;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function speakText(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("SpeechSynthesis is not available in this browser."));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.pitch = 1;

    activeUtterance = utterance;

    utterance.onend = () => {
      if (activeUtterance === utterance) {
        activeUtterance = null;
      }
      resolve();
    };

    utterance.onerror = (event) => {
      if (stopRequested) {
        resolve();
        return;
      }
      reject(new Error(event.error));
    };

    window.speechSynthesis.speak(utterance);
  });
}
