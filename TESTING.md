# How to test SoundVault

## 1. Check the app builds

From the project root:

```bash
npm install
npm run build
```

- If `npm run build` succeeds, TypeScript and Next.js are fine.
- If it fails, fix the reported errors before testing in the browser.

## 2. Set up Supabase (required for real testing)

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is enough).
2. **Environment variables**: create `.env.local` in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
   Get both from **Project Settings → API** in the Supabase dashboard.
3. **Run the SQL migrations** in the Supabase **SQL Editor** (in order):
   - `supabase/migrations/20240223000001_initial_schema.sql`
   - `supabase/migrations/20240223000002_storage_audio.sql`
   - `supabase/migrations/20240223000003_search_rpc.sql`
4. **Storage**: if the `audio` bucket wasn’t created by the migration, create it in **Storage**: name `audio`, **Private**. Add the storage policies from the second migration.
5. **Auth**: in **Authentication → Providers**, ensure **Email** is enabled.

## 3. Run the app locally

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

## 4. Manual test checklist

### Auth
- [ ] **Sign up**: Go to Sign up, enter email + password (and optional display name). Submit → you should land on Library.
- [ ] **Protected route**: Sign out (sidebar), then try opening `http://localhost:3000/library` → you should be redirected to Login with `?redirect=/library`.
- [ ] **Login**: Log in again → you should land on Library (or the `redirect` path if you had one).
- [ ] **Already logged in**: While logged in, open `/login` or `/signup` → you should be redirected to Library.

### Upload & library
- [ ] **Upload**: Go to **Upload**, choose an MP3/M4A/WAV file, set title (required), optionally artist/album, click Upload. You should see “Uploading…” then be redirected to Library.
- [ ] **Library**: Your new track appears in “Your Library” with a play button.
- [ ] **Play**: Click the play button on a track. The bottom **player bar** appears with that track; it starts playing (if the file is valid). Use play/pause, seek, volume.
- [ ] **Recently played**: After playing a track, the “Recently played” section at the top of Library shows it (up to 20).

### Playlists
- [ ] **Create**: Go to **Playlists**, enter a name, click Create → you land on the new playlist page (empty).
- [ ] **Add tracks**: Click “Add tracks from Library”. You’re on Library with “Add” buttons. Click “Add” on a track → it shows “Added”. Go back to the playlist → the track is listed.
- [ ] **Play from playlist**: Click play on a track in the playlist → it plays and the queue is the playlist order. Use Next/Previous in the player bar to move through the playlist.
- [ ] **Reorder**: Use the up/down arrows on a track → order changes after refresh.
- [ ] **Remove**: Click the trash icon on a track → it’s removed from the playlist.

### Search
- [ ] **Search**: Go to **Search**, type part of a track title (or artist/album). After a short delay, matching tracks appear. Click play on a result → it plays in the player.

### Player bar
- [ ] **Persistent**: Play a track, then navigate to Search or Playlists → the bottom bar stays visible and keeps playing.
- [ ] **Next/Previous**: With multiple tracks in the queue (e.g. from Library or a playlist), Next and Previous change the track and keep playing.
- [ ] **Seek**: Move the progress bar → playback position changes.
- [ ] **Volume**: Change the volume slider → volume changes.

## 5. If something doesn’t work

- **“No track selected”** and nothing plays  
  - Check the browser console (F12) for errors.  
  - Ensure the uploaded file is a valid audio file and the track row was created (check Supabase **Table Editor → tracks**).

- **Upload fails**  
  - Check Supabase **Storage**: bucket `audio` exists and is private, and RLS policies are from the second migration.  
  - Check **Authentication**: you’re logged in (e.g. Table Editor → `profiles` has your user).

- **Search returns nothing**  
  - Run the third migration (`search_tracks` function).  
  - Ensure `tracks` has a `search_vector` (trigger from first migration). New rows get it automatically; for old rows you may need to run an update or re-upload.

- **Redirect loop or “Unauthorized”**  
  - Confirm `.env.local` has the correct Supabase URL and anon key.  
  - Restart the dev server after changing env vars (`Ctrl+C`, then `npm run dev` again).

- **Build fails**  
  - Run `npm run build` and fix any TypeScript or lint errors shown.

Using this flow (build → Supabase setup → dev server → checklist) is how you can verify that the app works end to end.
