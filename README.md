# SoundVault

A personal music locker: upload and stream your own audio files. Built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

## Features

- **Auth**: Email/password sign up and login (Supabase Auth)
- **Upload**: MP3, M4A, WAV upload with title/artist/album metadata
- **Library**: List all your tracks, play with one click
- **Global player**: Persistent bottom bar with play/pause, next/previous, seek, volume
- **Playlists**: Create playlists, add/remove/reorder tracks, play playlist as queue
- **Search**: Full-text search by title, artist, album (debounced)
- **Recently played**: Last 20 tracks on the Library page

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (dark theme)
- Supabase (Postgres, Auth, Storage)
- HTML5 Audio API
- Zustand (player state)

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

## Setup

### 1. Clone and install

```bash
cd SportifyLookAlikeTry
npm install
```

### 2. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**: copy the **Project URL** and **anon public** key.

### 3. Environment variables

Create `.env.local` in the project root (see `.env.local.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database migrations

In the Supabase dashboard, open **SQL Editor** and run the migrations in order:

1. **Initial schema + RLS**  
   Copy and run the contents of  
   `supabase/migrations/20240223000001_initial_schema.sql`

2. **Storage bucket + RLS**  
   Copy and run the contents of  
   `supabase/migrations/20240223000002_storage_audio.sql`

3. **Search RPC**  
   Copy and run the contents of  
   `supabase/migrations/20240223000003_search_rpc.sql`

### 5. Storage bucket (if not created by migration)

If the `audio` bucket was not created by the migration:

1. Go to **Storage** in the Supabase dashboard.
2. **New bucket**: name `audio`, **Private**.
3. Optionally set file size limit (e.g. 50MB) and allowed MIME types:  
   `audio/mpeg`, `audio/mp4`, `audio/x-m4a`, `audio/wav`, `audio/x-wav`.
4. Add the storage policies from `20240223000002_storage_audio.sql` (RLS for `storage.objects`).

### 6. Auth settings

In **Authentication → Providers**, ensure **Email** is enabled.  
Optionally configure **Site URL** and **Redirect URLs** for production.

### 7. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, then upload and play your tracks.

## Project structure

```
app/
  (app)/              # Protected app routes
    library/          # Your tracks + recently played
    search/           # Full-text search
    playlists/        # List + [id] detail
    upload/           # Upload form
  login/
  signup/
  actions/            # Server actions (tracks, playlists, play-history)
  providers.tsx
components/
  layout/             # Sidebar
  player/             # PlayerProvider, PlayerBar
lib/
  supabase/           # Browser + server clients, middleware
  store/              # Zustand player store
  context/             # Audio ref context
  types/               # DB types
supabase/
  migrations/         # SQL migrations
```

## Security

- **RLS**: All tables use Row Level Security; users only access their own rows (`user_id = auth.uid()`).
- **Storage**: Bucket is private; policies restrict access to `audio/{user_id}/*`.
- **Playback**: Signed URLs (1-hour expiry) are used for streaming; no public bucket URLs.

## Deploy on the web

To run the app online (not just locally), see **[DEPLOYMENT.md](./DEPLOYMENT.md)**. It covers deploying to **Vercel** and configuring Supabase (Site URL, Redirect URLs) so auth and uploads work on your live URL.

## License

MIT
