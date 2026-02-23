"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePlayerStore } from "@/lib/store/playerStore";
import type { Track } from "@/lib/types/database";

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SearchContent() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const search = useCallback(async () => {
    if (!debounced) {
      setTracks([]);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("search_tracks", {
      search_query: debounced,
    });
    setLoading(false);
    if (error) {
      setTracks([]);
      return;
    }
    setTracks(data ?? []);
  }, [debounced]);

  useEffect(() => {
    search();
  }, [search]);

  return (
    <>
      <input
        type="search"
        placeholder="Search by title, artist, or album..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md px-4 py-3 rounded bg-surface-600 text-white placeholder:text-[#b3b3b3] border border-surface-500 focus:border-accent focus:outline-none"
      />
      {loading && <p className="text-[#b3b3b3] mt-2">Searching…</p>}
      {!loading && debounced && (
        <ul className="mt-6 space-y-1">
          {tracks.map((track) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <li
                key={track.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-600"
              >
                <button
                  type="button"
                  onClick={() => playTrack(track, tracks)}
                  className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center hover:scale-105 transition shrink-0"
                >
                  {isActive && isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`font-medium truncate ${isActive ? "text-accent" : ""}`}>
                    {track.title}
                  </p>
                  <p className="text-sm text-[#b3b3b3] truncate">
                    {[track.artist, track.album].filter(Boolean).join(" · ") || "Unknown"}
                  </p>
                </div>
                <span className="text-sm text-[#b3b3b3] tabular-nums shrink-0">
                  {formatDuration(track.duration_sec)}
                </span>
              </li>
            );
          })}
          {tracks.length === 0 && <li className="text-[#b3b3b3]">No results.</li>}
        </ul>
      )}
    </>
  );
}
