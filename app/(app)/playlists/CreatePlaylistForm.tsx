"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPlaylist } from "@/app/actions/playlists";

export function CreatePlaylistForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await createPlaylist(name);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setName("");
    router.refresh();
    if (result.data?.id) router.push(`/playlists/${result.data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New playlist name"
        required
        disabled={loading}
        className="px-4 py-2 rounded bg-surface-600 text-white placeholder:text-[#b3b3b3] border border-surface-500 focus:border-accent focus:outline-none w-56"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-full bg-accent hover:bg-accentHover font-medium text-black disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create"}
      </button>
      {error && <p className="text-red-400 text-sm w-full">{error}</p>}
    </form>
  );
}
