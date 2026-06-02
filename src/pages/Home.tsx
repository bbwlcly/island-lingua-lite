import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generatePodcastFromLongText } from "../services/aiService";
import { getPodcasts, savePodcast } from "../services/storageService";
import type { LearningPodcast } from "../types";

export default function Home() {
  const navigate = useNavigate();
  const [sourceText, setSourceText] = useState("");
  const [recentPodcasts, setRecentPodcasts] = useState<LearningPodcast[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRecentPodcasts(getPodcasts().slice(0, 5));
  }, []);

  async function handleGenerate(event: FormEvent) {
    event.preventDefault();
    const trimmed = sourceText.trim();
    if (!trimmed) {
      setError("Please paste some Chinese text first.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const podcast = await generatePodcastFromLongText(trimmed);
      savePodcast(podcast);
      navigate(`/podcasts/${podcast.id}`);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Failed to generate podcast.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section>
        <p className="mb-3 text-sm uppercase tracking-[0.18em] text-neutral-500">Chinese to shadowing podcast</p>
        <h1 className="mb-6 max-w-3xl text-4xl font-semibold leading-tight text-neutral-950">
          Turn a long Chinese note into a calm English practice script.
        </h1>

        <form onSubmit={handleGenerate} className="space-y-4">
          <textarea
            value={sourceText}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setSourceText(event.target.value)}
            placeholder="Paste your Chinese source text here..."
            className="min-h-[360px] w-full resize-y rounded-lg border border-neutral-300 bg-white px-5 py-4 text-base leading-7 text-neutral-900 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isGenerating}
              className="rounded-md bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {isGenerating ? "Generating..." : "Generate Podcast"}
            </button>
            {error ? <p className="text-sm text-neutral-600">{error}</p> : null}
          </div>
        </form>
      </section>

      <aside className="lg:pt-16">
        <div className="border-t border-neutral-200 pt-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Recent</h2>
            <Link to="/library" className="text-sm text-neutral-700 underline-offset-4 hover:underline">
              View all
            </Link>
          </div>

          {recentPodcasts.length === 0 ? (
            <p className="text-sm leading-6 text-neutral-500">Generated podcasts will appear here.</p>
          ) : (
            <div className="space-y-3">
              {recentPodcasts.map((podcast) => (
                <Link
                  key={podcast.id}
                  to={`/podcasts/${podcast.id}`}
                  className="block rounded-lg border border-neutral-200 bg-white px-4 py-4 transition-colors hover:border-neutral-400"
                >
                  <p className="line-clamp-2 text-sm font-medium text-neutral-950">{podcast.title}</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    {podcast.sentences.length} sentences · {formatDate(podcast.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
