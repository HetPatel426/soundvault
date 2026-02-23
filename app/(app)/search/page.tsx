import { createClient } from "@/lib/supabase/server";
import { SearchContent } from "./SearchContent";

export default async function SearchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Search</h1>
      <SearchContent />
    </div>
  );
}
