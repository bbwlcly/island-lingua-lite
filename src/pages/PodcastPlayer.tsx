import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { speakPodcast, speakSentence, stopSpeaking } from "../services/ttsService";
import { getPodcastById, updatePodcast } from "../services/storageService";
import type { LearningPodcast, SentenceStatus } from "../types";

const statusOptions: Array<{ value: SentenceStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "practicing", label: "Practicing" },
  { value: "familiar", label: "Familiar" },
];

export default function PodcastPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState<LearningPodcast | null>(null);
  const [activeSentenceId, setActiveSentenceId] = useState("");
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [playbackError, setPlaybackError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }
    const storedPodcast = getPodcastById(id);
    if (!storedPodcast) {
      navigate("/library");
      return;
    }
    setPodcast(storedPodcast);
  }, [id, navigate]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const practicingCount = useMemo(() => {
    return podcast?.sentences.filter((sentence) => sentence.status === "practicing").length ?? 0;
  }, [podcast]);

  async function handlePlayFull() {
    if (!podcast) {
      return;
    }

    setPlaybackError("");
    setIsPlayingFull(true);

    try {
      await speakPodcast(podcast.sentences, setActiveSentenceId);
    } catch (error) {
      setPlaybackError(error instanceof Error ? error.message : "Playback failed.");
    } finally {
      setIsPlayingFull(false);
      setActiveSentenceId("");
    }
  }

  async function handlePlaySentence(sentenceId: string, text: string) {
    setPlaybackError("");
    setIsPlayingFull(false);
    setActiveSentenceId(sentenceId);

    try {
      await speakSentence(text);
    } catch (error) {
      setPlaybackError(error instanceof Error ? error.message : "Playback failed.");
    } finally {
      setActiveSentenceId("");
    }
  }

  function handleStop() {
    stopSpeaking();
    setIsPlayingFull(false);
    setActiveSentenceId("");
  }

  function handleStatusChange(sentenceId: string, status: SentenceStatus) {
    if (!podcast) {
      return;
    }

    const updatedPodcast = {
      ...podcast,
      sentences: podcast.sentences.map((sentence) =>
        sentence.id === sentenceId ? { ...sentence, status } : sentence,
      ),
    };
    setPodcast(updatedPodcast);
    updatePodcast(updatedPodcast);
  }

  if (!podcast) {
    return <p className="text-sm text-neutral-500">Loading podcast...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to="/library" className="text-sm text-neutral-600 underline-offset-4 hover:underline">
          Back to Library
        </Link>
        <div className="mt-5 flex flex-col gap-5 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-neutral-950">{podcast.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{podcast.summaryCn}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-neutral-500">
              {podcast.sentences.length} sentences · {practicingCount} practicing
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePlayFull}
              disabled={isPlayingFull}
              className="rounded-md bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              Play Full Podcast
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-500"
            >
              Pause / Stop
            </button>
          </div>
        </div>
        {playbackError ? <p className="mt-4 text-sm text-neutral-600">{playbackError}</p> : null}
      </div>

      <div className="space-y-4">
        {podcast.sentences.map((sentence, index) => {
          const isActive = activeSentenceId === sentence.id;
          return (
            <article
              key={sentence.id}
              className={[
                "rounded-lg border bg-white p-5 transition-colors",
                isActive ? "border-neutral-700 bg-neutral-100" : "border-neutral-200",
              ].join(" ")}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                    Sentence {index + 1}
                  </p>
                  <p className="mt-3 text-xl leading-8 text-neutral-950">{sentence.textEn}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{sentence.textCn}</p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePlaySentence(sentence.id, sentence.textEn)}
                    className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-500"
                  >
                    Play Sentence
                  </button>
                  <select
                    value={sentence.status}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                      handleStatusChange(sentence.id, event.target.value as SentenceStatus)
                    }
                    className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
                    aria-label={`Status for sentence ${index + 1}`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 border-t border-neutral-200 pt-5">
                <h2 className="text-sm font-semibold text-neutral-950">Pronunciation Guide</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <GuideBlock label="Chunking" items={[sentence.chunking.join(" / ")]} />
                  <GuideBlock label="Stress Tips" items={sentence.stressWords} />
                  <GuideBlock label="Common Mistakes for Chinese Speakers" items={sentence.commonMistakes} />
                  <GuideBlock label="Shadowing Prompt" items={[sentence.shadowingPrompt]} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function GuideBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">{label}</p>
      <ul className="space-y-1 text-sm leading-6 text-neutral-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
