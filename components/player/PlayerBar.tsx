"use client";

import { useRef } from "react";
import { usePlayerStore } from "@/lib/store/playerStore";
import { useAudioRef } from "@/lib/context/AudioRefContext";

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const {
    currentTrack,
    queue,
    queueIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    setCurrentTime,
    setVolume,
    play,
    pause,
    next,
    previous,
  } = usePlayerStore();
  const progressRef = useRef<HTMLInputElement>(null);
  const audioRef = useAudioRef();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!Number.isFinite(value)) return;
    const time = (value / 100) * duration;
    setCurrentTime(time);
    if (audioRef?.current) audioRef.current.currentTime = time;
  };

  if (!currentTrack) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-surface-700 border-t border-surface-500 flex items-center justify-center text-[#b3b3b3]">
        <p>No track selected</p>
      </footer>
    );
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-surface-700 border-t border-surface-500">
      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={handleSeek}
        ref={progressRef}
        className="absolute top-0 left-0 right-0 w-full h-1 -translate-y-1/2 cursor-pointer appearance-none bg-surface-500"
      />
      <div className="flex items-center justify-between h-16 px-4 gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 rounded bg-surface-600 flex items-center justify-center shrink-0 text-accent font-bold">
            {currentTrack.title.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{currentTrack.title}</p>
            <p className="text-sm text-[#b3b3b3] truncate">
              {[currentTrack.artist, currentTrack.album].filter(Boolean).join(" · ") || "Unknown"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previous}
              className="p-2 text-white hover:text-accent transition"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={isPlaying ? pause : play}
              className="p-3 rounded-full bg-white text-black hover:scale-105 transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={next}
              className="p-2 text-white hover:text-accent transition"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zm2-10v8l5.25-4L8 8zm13-2v12h-2V6h2z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-32 shrink-0">
          <svg className="w-4 h-4 text-[#b3b3b3]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              if (audioRef?.current) audioRef.current.volume = v;
            }}
            className="w-20 h-1.5 accent-accent cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
}
