import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreatePlaylistForm } from "./CreatePlaylistForm";

export default async function PlaylistsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: playlists } = await supabase
    .from("playlists")
    .select("id, name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Playlists</h1>
      <CreatePlaylistForm />
      <ul className="mt-6 space-y-2">
        {playlists?.map((p) => (
          <li key={p.id}>
            <Link
              href={`/playlists/${p.id}`}
              className="block p-4 rounded-lg bg-surface-600 hover:bg-surface-500 transition"
            >
              <span className="font-medium">{p.name}</span>
            </Link>
          </li>
        ))}
        {(!playlists || playlists.length === 0) && (
          <li className="text-[#b3b3b3]">No playlists yet. Create one above.</li>
        )}
      </ul>
    </div>
  );
}
