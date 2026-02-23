"use client";

import { createContext, useContext, useRef, type RefObject } from "react";

const AudioRefContext = createContext<RefObject<HTMLAudioElement | null> | null>(null);

export function useAudioRef() {
  const ref = useContext(AudioRefContext);
  return ref;
}

export function AudioRefProvider({
  audioRef,
  children,
}: {
  audioRef: RefObject<HTMLAudioElement | null>;
  children: React.ReactNode;
}) {
  return (
    <AudioRefContext.Provider value={audioRef}>{children}</AudioRefContext.Provider>
  );
}
