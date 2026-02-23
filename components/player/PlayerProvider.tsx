"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "@/lib/store/playerStore";
import { createClient } from "@/lib/supabase/client";
import { AudioRefProvider } from "@/lib/context/AudioRefContext";
import { recordPlay } from "@/app/actions/play-history";
import { PlayerBar } from "./PlayerBar";

const SIGNED_URL_EXPIRY_SEC = 3600; // 1 hour

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    currentTrack,
    queue,
    queueIndex,
    isPlaying,
    setCurrentTrack,
    setQueueIndex,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    next,
  } = usePlayerStore();

  const getSignedUrl = useCallback(async (path: string): Promise<string | null> => {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("audio")
      .createSignedUrl(path, SIGNED_URL_EXPIRY_SEC);
    if (error) return null;
    return data.signedUrl;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.volume = usePlayerStore.getState().volume;
    audioRef.current = audio;

    const onTimeUpdate = () => usePlayerStore.setState({ currentTime: audio.currentTime });
    const onDurationChange = () => usePlayerStore.setState({ duration: audio.duration });
    const onEnded = () => next();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audio.src = "";
    };
  }, [next, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      return;
    }

    let cancelled = false;
    (async () => {
      const url = await getSignedUrl(currentTrack.storage_path);
      if (cancelled || !audioRef.current) return;
      if (url) {
        audio.src = url;
        recordPlay(currentTrack.id);
        if (usePlayerStore.getState().isPlaying) audio.play();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentTrack?.id, currentTrack?.storage_path, getSignedUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying, setIsPlaying]);

  return (
    <AudioRefProvider audioRef={audioRef}>
      {children}
      <PlayerBar />
    </AudioRefProvider>
  );
}
