import { create } from "zustand";
import type { Track } from "@/lib/types/database";

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  setQueueIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  playPlaylist: (tracks: Track[], startIndex?: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,

  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  setQueue: (queue, startIndex = 0) =>
    set({ queue, queueIndex: Math.min(startIndex, Math.max(0, queue.length - 1)) }),
  setQueueIndex: (queueIndex) => set({ queueIndex }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  next: () => {
    const { queue, queueIndex } = get();
    if (queue.length === 0) return;
    const nextIndex = queueIndex >= queue.length - 1 ? 0 : queueIndex + 1;
    set({ queueIndex: nextIndex, currentTrack: queue[nextIndex], currentTime: 0 });
  },

  previous: () => {
    const { queue, queueIndex, currentTime } = get();
    if (queue.length === 0) return;
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    const prevIndex = queueIndex <= 0 ? queue.length - 1 : queueIndex - 1;
    set({ queueIndex: prevIndex, currentTrack: queue[prevIndex], currentTime: 0 });
  },

  playTrack: (track, queue) => {
    const list = queue ?? [track];
    const idx = list.findIndex((t) => t.id === track.id);
    set({
      currentTrack: track,
      queue: list,
      queueIndex: idx >= 0 ? idx : 0,
      isPlaying: true,
      currentTime: 0,
    });
  },

  playPlaylist: (tracks, startIndex = 0) => {
    if (tracks.length === 0) return;
    const idx = Math.min(startIndex, tracks.length - 1);
    set({
      currentTrack: tracks[idx],
      queue: tracks,
      queueIndex: idx,
      isPlaying: true,
      currentTime: 0,
    });
  },
}));
