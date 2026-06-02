import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletePodcast, getPodcasts } from "../services/storageService";
import type { LearningPodcast } from "../types";

export default function Library() {
  const [podcasts, setPodcasts] = useState<LearningPodcast[]>([]);

  useEffect(() => {
    setPodcasts(getPodcasts());
  }, []);

  function handleDelete(id: string) {
    deletePodcast(id);
    setPodcasts(getPodcasts());
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-neutral-200 pb-8">
        <h1 className="text-3xl font-semibold text-neutral-950">Library</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          All saved learning podcasts are stored locally in this browser.
        </p>
      </div>

      {podcasts.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-8">
          <p className="text-sm text-neutral-600">No podcasts yet.</p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-md bg-neutral-950 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Create one
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {podcasts.map((podcast) => {
            const practicingCount = podcast.sentences.filter((sentence) => sentence.status === "practicing").length;
            return (
              <article
                key={podcast.id}
                className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h2 className="text-base font-semibold text-neutral-950">{podcast.title}</h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    {formatDate(podcast.createdAt)} · {podcast.sentences.length} sentences · {practicingCount} practicing
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/podcasts/${podcast.id}`}
                    className="rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(podcast.id)}
                    className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-500"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
