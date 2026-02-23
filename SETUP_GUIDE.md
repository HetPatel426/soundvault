# In-depth step-by-step: Run SoundVault locally

This guide walks you through every step in detail so you can run the app on your Windows machine without missing anything.

---

## Part 1: Prepare your computer

### Step 1.1: Install Node.js (if you don’t have it)

1. **Check if Node.js is already installed**
   - Press **Win + R**, type `cmd`, press Enter to open Command Prompt.
   - Type: `node -v` and press Enter.
   - If you see a version like `v20.10.0`, Node.js is installed. Skip to Step 1.2.
   - If you see “'node' is not recognized” or an error, continue below.

2. **Download Node.js**
   - Open your browser and go to **https://nodejs.org**.
   - You should see two buttons: **LTS** (recommended) and **Current**.
   - Click the **LTS** version (e.g. “20.x.x LTS”).
   - The download should start (e.g. `node-v20.x.x-x64.msi` for 64-bit Windows).

3. **Run the installer**
   - Double-click the downloaded `.msi` file.
   - Click **Next** through the wizard. Keep the default options (including “Add to PATH”).
   - Click **Install**, then **Finish**.

4. **Verify the installation**
   - **Close any open Command Prompt or PowerShell windows** (so they pick up the new PATH).
   - Open a **new** Command Prompt or PowerShell.
   - Type: `node -v` → you should see something like `v20.10.0`.
   - Type: `npm -v` → you should see a number like `10.2.0`.
   - If both commands work, Node.js and npm are ready.

---

### Step 1.2: Open the project folder in a terminal

1. **Open PowerShell or Command Prompt**
   - Option A: Press **Win + X**, then choose **Windows PowerShell** or **Terminal**.
   - Option B: Press **Win + R**, type `powershell`, press Enter.
   - **Do not** type `powershell` again after it opens — that starts a second session and can be confusing.

2. **Go to the project folder**
   - In the terminal, type or paste **only** this line (adjust the path if your project is somewhere else) and press Enter:
   ```powershell
   cd c:\Users\danci\OneDrive\Desktop\SportifyLookAlikeTry
   ```
   - The prompt should change to something like: `PS C:\Users\danci\OneDrive\Desktop\SportifyLookAlikeTry>`. If you still see `PS C:\Users\danci>`, the `cd` didn’t run — paste the `cd` command again and press Enter once.

3. **Confirm you’re in the right place**
   - Type: `dir` (or `ls` in PowerShell) and press Enter.
   - You should see folders like `app`, `components`, `lib`, and files like `package.json`, `README.md`. If you see these, you’re in the SoundVault project folder.

---

### Step 1.3: Install project dependencies

1. **If you use PowerShell and see “running scripts is disabled”**
   - Run this **once** (it allows scripts for your user only; needed for `npm` to work):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   - When prompted, type `Y` and press Enter. Then run `npm install` below.

2. **Run the install command**
   ```powershell
   npm install
   ```
   Press Enter.

3. **What this does**
   - npm reads `package.json` and downloads all required packages (Next.js, React, Supabase, Tailwind, etc.) into a `node_modules` folder. This can take one to several minutes.

4. **What to expect**
   - You’ll see a lot of lines scrolling. When it finishes successfully, you’ll see something like “added XXX packages” and the prompt will return. There should be **no red error messages**.
   - If you see **ERESOLVE** or **peer dependency** warnings in yellow, you can usually ignore them for this project.
   - If the command **fails** (e.g. “npm ERR!” in red), check that you’re in the correct folder and that you have internet. Try again. If it still fails, copy the full error and search for it or ask for help.

5. **Optional: verify the build**
   - You can run: `npm run build`
   - This compiles the app. When it finishes with “Compiled successfully”, the project is ready to run. If the build fails, fix the reported errors before continuing.

---

## Part 2: Set up Supabase (database and auth)

SoundVault uses Supabase for user accounts, storing track metadata, and file storage. You need one free Supabase project.

### Step 2.1: Create a Supabase account and project

1. **Open Supabase**
   - In your browser go to **https://supabase.com**.
   - Click **Start your project** (or **Sign in** if you have an account).

2. **Sign in or sign up**
   - You can sign in with **GitHub** or **Email**. Create an account if you don’t have one.

3. **Create a new project**
   - After logging in you should see the Supabase dashboard (list of projects or “New project”).
   - Click **New project** (or **New** → **Project** depending on the UI).
   - **Organization**: If asked, select your organization or create one (e.g. “Personal” or your name).
   - **Name**: Enter a name like `soundvault` or `my-music-app`. This is only for you.
   - **Database Password**: Create a **strong password** and **save it somewhere safe**. You need it to connect to the database directly (e.g. with external tools). You won’t need it for this guide.
   - **Region**: Choose a region close to you (e.g. “East US” or “West Europe”) for better speed.
   - Click **Create new project**.

4. **Wait for the project to be ready**
   - Supabase will set up the database and APIs. This usually takes 1–2 minutes.
   - You’ll see a loading screen. When it’s done, you’ll see the project dashboard (left sidebar with Table Editor, SQL Editor, etc.). Do not close this tab; you’ll use it in the next steps.

---

### Step 2.2: Get your API URL and anon key

The app needs two values from Supabase: the project URL and the “anon” (public) API key.

1. **Open Project Settings**
   - In the **left sidebar** of the Supabase dashboard, click the **gear icon** (⚙️) at the bottom. Its label is usually **Project Settings**.

2. **Open the API section**
   - In the settings menu, click **API** (under “Project settings” or “Configuration”).
   - You’ll see **Project URL**, **Project API keys**, and possibly **JWT settings**.

3. **Copy the Project URL**
   - Find **Project URL**. It looks like: `https://abcdefghijk.supabase.co` (your part will be different).
   - Click the copy icon next to it (or select the text and copy). Paste it into a Notepad or keep it in the clipboard for the next step.

4. **Copy the anon public key**
   - Under **Project API keys** you’ll see at least two keys: **anon** (public) and **service_role** (secret).
   - Use only the **anon** / **public** key. It’s a long string (e.g. `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`).
   - Click the copy icon for the **anon** key. **Do not** use or expose the **service_role** key in the app.

You’ll paste both values into `.env.local` in Part 2.4.

---

### Step 2.3: Enable Email auth (so sign up / login work)

1. **Open Authentication settings**
   - In the left sidebar click **Authentication** (person icon).
   - Then click **Providers** (or **Auth** → **Providers**).

2. **Enable Email**
   - Find **Email** in the list of providers.
   - Make sure it’s **enabled** (toggle on). By default it usually is.
   - You can leave “Confirm email” off for local testing so you don’t need to verify email. For production you’d typically enable it.

3. **Save** if there’s a Save button. Then go back to the dashboard or SQL Editor for the next part.

---

### Step 2.4: Create the `.env.local` file

This file tells the Next.js app how to connect to your Supabase project. It must be in the project root and named exactly `.env.local`.

**Option A: Using VS Code or Cursor**

1. Open the folder `c:\Users\danci\OneDrive\Desktop\SportifyLookAlikeTry` in VS Code/Cursor (File → Open Folder).
2. In the file explorer (left sidebar), right-click in the empty space under the file list → **New File**.
3. Type the name: `.env.local` (including the dot at the start). Press Enter.
4. Open the file and paste the following, then **replace** the two placeholders with your real values from Step 2.2:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_long_anon_key_here
```

5. Example (with fake values):
   - `NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...`
6. Save the file (Ctrl+S).

**Option B: Using Notepad**

1. Open Notepad. Paste the two lines above and replace the placeholders with your URL and anon key.
2. Click **File** → **Save As**.
3. **Navigate** to: `c:\Users\danci\OneDrive\Desktop\SportifyLookAlikeTry`.
4. In “File name” type: `.env.local` (including the dot).
5. In “Save as type” choose **All Files (*.*)** so it doesn’t add `.txt`.
6. Click **Save**.

**Important**

- No spaces around the `=` sign.
- No quotes around the URL or key.
- The file must be named `.env.local` (not `env.local` or `.env.local.txt`).
- This file is in `.gitignore` and should **never** be committed to Git (it contains secrets).

---

## Part 3: Create the database and storage (migrations)

The app expects specific tables and storage rules. You create them by running three SQL scripts in Supabase.

### Step 3.1: Open the SQL Editor

1. In the Supabase dashboard (left sidebar), click **SQL Editor**.
2. Click **New query** (or the “+” button). You’ll see a large text area where you can paste SQL.

---

### Step 3.2: Run Migration 1 (tables and RLS)

This creates: `profiles`, `tracks`, `playlists`, `playlist_tracks`, `play_history`, indexes, full-text search on tracks, and Row Level Security so each user only sees their own data. It also adds a trigger to create a profile when a user signs up.

1. **Open the migration file on your computer**
   - Path: `c:\Users\danci\OneDrive\Desktop\SportifyLookAlikeTry\supabase\migrations\20240223000001_initial_schema.sql`
   - Open it with Notepad, VS Code, or any editor. Select **all** (Ctrl+A) and copy (Ctrl+C).

2. **Paste into the SQL Editor**
   - Click inside the Supabase SQL Editor text area and paste (Ctrl+V). The entire script should appear.

3. **Run the query**
   - Click the **Run** button (or press Ctrl+Enter).
   - Wait a few seconds.

4. **Check the result**
   - At the bottom you should see something like **Success. No rows returned** (green). That’s correct.
   - If you see **Error**, read the message. Common issues:
     - “relation already exists”: you may have run this before; you can skip to Migration 2 or drop the objects and run again if you know what you’re doing.
     - Syntax error: make sure you copied the **entire** file with no missing lines.

5. **Verify (optional)**  
   - In the left sidebar click **Table Editor**. You should see tables: `profiles`, `tracks`, `playlists`, `playlist_tracks`, `play_history`. They can be empty.

---

### Step 3.3: Run Migration 2 (storage bucket and RLS)

This creates the private `audio` bucket (or updates it) and adds storage policies so users can only read/write files under their own folder (`audio/{user_id}/...`).

1. **New query**
   - In the SQL Editor, click **New query** so the editor is cleared (or use a new tab if available).

2. **Open and copy the second migration**
   - File: `supabase\migrations\20240223000002_storage_audio.sql`
   - Copy the entire file and paste into the SQL Editor.

3. **Run**
   - Click **Run** (or Ctrl+Enter).

4. **Result**
   - **Success** is what you want.  
   - If you get an error like “bucket already exists” or about `storage.buckets`, the bucket might already exist. Go to **Storage** in the sidebar and check if **audio** is there. If it is, you can still add the policies: open the migration file, remove or comment out the `INSERT INTO storage.buckets` part, keep only the `CREATE POLICY` lines, and run that. Or create the bucket manually in Step 3.5 and then run only the policy part.

---

### Step 3.4: Run Migration 3 (search function)

This adds a PostgreSQL function `search_tracks` that the app uses for full-text search on title, artist, and album.

1. **New query** again in the SQL Editor.
2. **Open and copy**: `supabase\migrations\20240223000003_search_rpc.sql`
3. Paste and **Run**.
4. You should see **Success**. If you see “function already exists”, that’s fine; it means it was run before.

---

### Step 3.5: Ensure the `audio` storage bucket exists

1. In the Supabase left sidebar, click **Storage**.
2. Look for a bucket named **audio**.
   - **If you see “audio”**: You’re done. The migration (or a previous run) created it.
   - **If you don’t see it**: Click **New bucket**. Name: `audio`. Leave it **Private**. Click **Create bucket**. The RLS policies from Migration 2 apply to this bucket so users can only access their own folder.

---

## Part 4: Run the app

### Step 4.1: Start the development server

1. **Use the same terminal** where you ran `npm install`, and make sure you’re in the project folder:
   ```powershell
   cd c:\Users\danci\OneDrive\Desktop\SportifyLookAlikeTry
   ```
   (Run this if you’re not sure.)

2. **Start the app**
   ```powershell
   npm run dev
   ```
   Press Enter.

3. **What you should see**
   - Next.js compiles the app. After a few seconds you’ll see something like:
   ```text
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Ready in 2.3s
   ```
   - The process keeps running; don’t close the terminal. You’ll use the browser for the next steps.

4. **If the port is in use**
   - If you see “Port 3000 is in use”, either close the other app using 3000 or run on another port:
   ```powershell
   npm run dev -- -p 3001
   ```
   Then use **http://localhost:3001** instead of 3000 in the next step.

---

### Step 4.2: Open the app in your browser

1. Open **Chrome**, **Edge**, or **Firefox**.
2. In the address bar type: **http://localhost:3000** (or **http://localhost:3001** if you used `-p 3001`). Press Enter.

3. **What you should see**
   - A dark-themed page with “SoundVault” at the top and “Your personal music locker” (or similar).
   - A form with **Email** and **Password** and a **Log in** button.
   - A link like “Don’t have an account? Sign up”.

---

### Step 4.3: Create an account and use the app

1. **Sign up**
   - Click **Sign up**.
   - Enter an **email** (can be real or a test like `test@test.com` if you didn’t enable email confirmation).
   - Enter a **password** (at least 6 characters). Optionally add a display name.
   - Click **Sign up** (or **Create account**).

2. **After sign up**
   - You should be redirected to the **Library** page. You’ll see a sidebar on the left (Library, Search, Playlists, Upload, Sign out) and the main area saying something like “No tracks yet” or “Your Library”.

3. **Upload a track**
   - Click **Upload** in the sidebar.
   - Click **Choose File** (or “Select file”) and pick an **MP3**, **M4A**, or **WAV** file from your computer.
   - Enter a **Title** (required). Optionally fill **Artist** and **Album**.
   - Click **Upload**. You should see “Uploading…” then be redirected to **Library** with your track listed.

4. **Play a track**
   - On the Library page, click the **green play button** next to a track. The **bottom player bar** should appear with the track title and play/pause, next/previous, seek bar, and volume. The track should start playing (if the file is valid).

5. **Try other features**
   - **Search**: Click **Search** in the sidebar, type part of a title or artist; results should appear after a short delay. Click play on a result.
   - **Playlists**: Click **Playlists** → enter a name → **Create**. Open the playlist → **Add tracks from Library** → add a track, then play from the playlist.
   - **Recently played**: After playing something, go back to **Library**; “Recently played” at the top should list the track.

---

## Part 5: Troubleshooting

### App won’t start or shows a blank page

- **Check `.env.local`**
  - It must be in the project root: `SportifyLookAlikeTry\.env.local`.
  - Names must be exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Values: your real Project URL and anon key, no extra spaces or quotes.
- **Restart the dev server**
  - In the terminal press **Ctrl+C** to stop it, then run `npm run dev` again. Next.js only reads `.env.local` at startup.

### “Invalid API key” or auth errors in the browser console

- Confirm the **anon** key (not service_role) is in `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- In Supabase: **Project Settings** → **API** → copy the anon key again and update `.env.local`, then restart the app.

### Sign up or login does nothing / error

- In Supabase go to **Authentication** → **Providers** → **Email** and ensure it’s **enabled**.
- Open the browser **Developer Tools** (F12) → **Console** tab. Try sign up again and see if a red error appears; that message often tells you what’s wrong (e.g. “Email not confirmed” if you enabled confirmation).

### Upload fails (e.g. “new row violates row-level security”)

- **Storage**: In Supabase **Storage**, ensure the **audio** bucket exists and is **Private**. Run Migration 2 again if needed so the storage policies exist.
- **Tables**: Ensure Migration 1 ran successfully so the `tracks` table and RLS exist.

### Search returns no results

- Migration 3 must be run so the `search_tracks` function exists.
- New tracks get a search vector automatically (trigger from Migration 1). If you had tracks before the trigger existed, search might not find them until you re-upload or run a one-time update (advanced).

### Player shows “No track selected” or doesn’t play

- Make sure you clicked **Play** on a track. The bar only shows when something is selected.
- If the bar shows but nothing plays: check the browser console (F12) for errors. Often it’s a problem with the file (e.g. unsupported format) or a missing signed URL (check Supabase Storage and RLS).

### Migrations fail with “already exists”

- If you re-run the setup, some objects may already exist. You can often **skip** that migration or that part of it. For a clean start you could create a new Supabase project and run all steps again.

---

## Summary checklist

- [ ] Node.js installed (`node -v` and `npm -v` work).
- [ ] In project folder: `cd ...\SportifyLookAlikeTry`.
- [ ] Ran `npm install`.
- [ ] Supabase project created and ready.
- [ ] Copied **Project URL** and **anon** key from **Settings** → **API**.
- [ ] **Email** provider enabled under **Authentication** → **Providers**.
- [ ] Created **`.env.local`** with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Ran **all three** SQL migrations in the **SQL Editor** (in order).
- [ ] **Storage** bucket **audio** exists (create manually if not).
- [ ] Ran `npm run dev` and opened **http://localhost:3000**.
- [ ] Signed up, uploaded a track, and played it from Library.

If all steps are done and something still doesn’t work, use the troubleshooting section above and the browser console (F12) and Supabase logs to narrow it down.
