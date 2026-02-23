"use client";

import { PlayerProvider } from "@/components/player/PlayerProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      {children}
    </PlayerProvider>
  );
}
