# In-depth: Deploy SoundVault on the web

This guide walks you through every step of putting SoundVault online so you can use it from any browser. The app is deployed to **Vercel** (free tier), and you configure **Supabase** so login, sign-up, and file upload work on your live URL.

---

## What you need before you start

- The app set up and working **locally** (you’ve followed SETUP_GUIDE.md: Supabase project, migrations run, `.env.local` with URL and anon key).
- A **GitHub** account. If you don’t have one, sign up at [github.com](https://github.com).
- Your **Supabase Project URL** and **anon (public) key** — same values as in your `.env.local`. You’ll add these to Vercel; never commit them to GitHub.

---

## Part 1: Install Git (if you don’t have it)

You need Git to push your code to GitHub. If you’re not sure whether it’s installed:

1. **Check for Git**
   - Open PowerShell or Command Prompt.
   - Type: `git --version` and press Enter.
   - If you see something like `git version 2.43.0`, Git is installed. Skip to Part 2.
   - If you see “'git' is not recognized” or an error, continue below.

2. **Download Git for Windows**
   - Go to **https://git-scm.com/download/win**.
   - The download should start automatically (e.g. `Git-2.43.0-64-bit.exe`).

3. **Run the installer**
   - Use the default options. Important: when asked about “PATH”, choose **Git from the command line and also from 3rd-party software** so `git` works in PowerShell and Command Prompt.
   - Finish the installation.

4. **Verify**
   - Close and reopen your terminal, then run: `git --version`. You should see a version number.

---

## Part 2: Put your code on GitHub

Vercel deploys from a Git repository. You’ll create a repo on GitHub and push your project from your PC. Your `.env.local` file is in `.gitignore`, so it will **not** be uploaded — that’s correct; you’ll add the same keys in Vercel later.

### Step 2.1: Create a new repository on GitHub

1. **Open GitHub**
   - In your browser go to **https://github.com** and sign in.

2. **Start a new repository**
   - Click the **+** icon in the top-right, then **New repository** (or click **New** on the left if you’re on the repo list).
   - You’ll see a “Create a new repository” page.

3. **Fill in the details**
   - **Repository name**: e.g. `soundvault` or `SportifyLookAlikeTry`. Use lowercase and hyphens if you like; no spaces.
   - **Description**: optional (e.g. “Personal music locker”).
   - **Public** or **Private**: your choice. Private is fine for Vercel.
   - **Do not** check “Add a README file”, “Add .gitignore”, or “Choose a license” — your project already has these. The repo should start empty.
   - Click **Create repository**.

4. **After creation**
   - GitHub shows a page with “Quick setup” and a URL like `https://github.com/YOUR_USERNAME/soundvault.git`. Keep this page open or copy your **username** and **repo name**; you’ll need them for the remote URL.

### Step 2.2: Open your project folder in the terminal

1. Open **PowerShell** or **Command Prompt** (or use the terminal in VS Code/Cursor).
2. Go to the project folder:
   ```powershell
   cd c:\Users\danci\OneDrive\Desktop\SportifyLookAlikeTry
   ```
   (Use your actual path if the project is elsewhere.)
3. Confirm you’re in the right place: run `dir` and check that you see `package.json`, `app`, `components`, etc.

### Step 2.3: Initialize Git and make the first commit (if needed)

1. **Check if Git is already initialized**
   - Run: `git status`
   - If you see “fatal: not a git repository”, continue below. If you see “On branch main” or “On branch master” and a list of files, Git is already set up; skip to Step 2.4.

2. **Initialize the repository**
   ```powershell
   git init
   ```
   You should see: “Initialized empty Git repository in …”.

3. **Stage all files**
   - **Important:** Make sure you are in the project folder (you should see `package.json` when you run `dir`). If you run `git add .` from `C:\Users\danci` or another folder, you can get “fatal: adding files failed”.
   ```powershell
   git add .
   ```
   This stages every file. Because `.env.local` is in `.gitignore`, it will **not** be added. You can confirm with: `git status` — `.env.local` should not appear in the list.
   - **If you see “fatal: adding files failed”:** Run `cd c:\Users\danci\OneDrive\Desktop\SportifyLookAlikeTry` (or your project path), then run `git add .` again. If it still fails, try: `git config core.longpaths true` (helps on Windows with long paths), then `git add .` again.

4. **Create the first commit**
   - Run this as **one** command (the `-m "Initial commit"` is the message and must be on the same line as `git commit`):
   ```powershell
   git commit -m "Initial commit"
   ```
   - You should see something like “X files changed” and “create mode …” for many files.
   - **Don’t** run `-m "Initial commit"` by itself in a new line — that will cause an error.

### Step 2.4: Connect to GitHub and push

1. **Add the remote**
   - Replace `YOUR_USERNAME` with your GitHub username and `YOUR_REPO` with the repository name you chose (e.g. `soundvault`):
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   ```
   Example: if your username is `johndoe` and the repo is `soundvault`:
   ```powershell
   git remote add origin https://github.com/johndoe/soundvault.git
   ```
   - If you get “remote origin already exists”, that’s fine — the repo is already connected. You can skip to the push step.

2. **Rename branch to main (if needed)**
   - Run: `git branch`
   - If it shows `* master`, rename to `main` so it matches GitHub’s default:
   ```powershell
   git branch -M main
   ```

3. **Push to GitHub**
   ```powershell
   git push -u origin main
   ```

4. **If Git asks for credentials**
   - **Username**: your GitHub username.
   - **Password**: GitHub no longer accepts account passwords here. You must use a **Personal Access Token (PAT)**:
     1. On GitHub: click your **profile picture** (top-right) → **Settings**.
     2. In the left sidebar, scroll to **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
     3. Click **Generate new token (classic)**. Give it a name (e.g. “Vercel deploy”), choose an expiration, and under **Scopes** check at least **repo**.
     4. Generate the token and **copy it** (you won’t see it again).
     5. When Git asks for a password, **paste the token** (not your GitHub password).
   - After a successful push, refresh your GitHub repo page — you should see all your project files.

---

## Part 3: Deploy on Vercel

Vercel hosts your Next.js app and runs `npm run build` and serves it. You connect your GitHub repo and add your Supabase keys as environment variables.

### Step 3.1: Sign up or log in to Vercel

1. Go to **https://vercel.com** in your browser.
2. Click **Sign Up** or **Log In**.
3. Choose **Continue with GitHub** (recommended so Vercel can access your repos). Authorize Vercel when GitHub asks.
4. If you’re new, you may see a short onboarding; you can skip or complete it. You’ll land on the Vercel dashboard.

### Step 3.2: Import your project

1. **Start adding a project**
   - On the dashboard, click **Add New…** (or **Add New**) → **Project**.
   - You may also see “Import Project” or “Import Git Repository”; that’s the same idea.

2. **Select the Git provider**
   - Under “Import Git Repository” you’ll see **GitHub**, GitLab, Bitbucket. Click **GitHub** (or the one you use).
   - If GitHub isn’t connected, click **Connect GitHub account** and authorize. Then you may need to click **Add New…** → **Project** again.

3. **Find your repository**
   - You’ll see a list of your GitHub repos (or a search box). Find the repo you pushed (e.g. `soundvault` or `SportifyLookAlikeTry`).
   - Click **Import** (or the repo name) next to it. Don’t use “Import third-party Git Repository” unless your code is elsewhere.

### Step 3.3: Configure the project

On the “Configure Project” screen:

1. **Project Name**
   - Vercel will suggest a name from the repo (e.g. `soundvault`). You can change it; this becomes part of the URL, e.g. `soundvault.vercel.app`.

2. **Framework Preset**
   - Vercel usually detects **Next.js** automatically. Leave it as **Next.js**. Don’t switch to “Other” or “Create React App”.

3. **Root Directory**
   - Leave **blank** (or “.”). Your `package.json` and `app` folder are in the repo root.

4. **Build and Output Settings**
   - **Build Command**: leave default (`next build` or empty).
   - **Output Directory**: leave default.
   - **Install Command**: leave default (`npm install` or `yarn install`).

5. **Environment Variables** (important)
   - Find the section **Environment Variables**.
   - Click to expand it. You’ll see fields: **Key**, **Value**, and environment checkboxes (Production, Preview, Development).

   Add **two** variables:

   - **First variable**
     - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
     - **Value**: Your Supabase Project URL, e.g. `https://abcdefgh.supabase.co` (no quotes, no spaces). Copy it from your `.env.local` or from Supabase → Settings → API.
     - Check **Production** (and **Preview** if you want preview deployments to work too).
     - Click **Add** or **Add Key**.

   - **Second variable**
     - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **Value**: Your Supabase **anon public** key (the long string starting with `eyJ...`). Copy from `.env.local` or Supabase → Settings → API → anon public.
     - Check **Production** (and **Preview** if you like).
     - Click **Add**.

   - **Do not** add `service_role` or any other secret key. Only the **anon** key is safe in the browser.

6. **Deploy**
   - Click the **Deploy** button at the bottom. Vercel will clone your repo, run `npm install` and `npm run build`, and deploy.

### Step 3.4: Wait for the build and get your URL

1. **Build log**
   - You’ll see a log with “Installing dependencies”, “Building”, etc. This can take 1–3 minutes.
   - If the build **succeeds**, you’ll see “Congratulations” or “Your project has been deployed” and a **Visit** or **Open** link.

2. **Your live URL**
   - The link looks like: `https://soundvault.vercel.app` or `https://soundvault-xxxx.vercel.app`. That’s your app on the web. Open it in a new tab.
   - You might see the SoundVault login/signup page, but **don’t sign in yet** — you still need to configure Supabase so auth redirects work. If you see a blank page or an error, check Part 5 (Troubleshooting).

3. **If the build fails**
   - Read the red error in the log. Common causes:
     - Missing environment variables: go to the project in Vercel → **Settings** → **Environment Variables** and add both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then **Redeploy** (Deployments → … → Redeploy).
     - TypeScript or build error: fix it locally, commit, push; Vercel will redeploy automatically if you have “Automatic deployments” on.

---

## Part 4: Configure Supabase for your live URL

Supabase needs to know your production URL so it can:
- Redirect users back to your app after login/signup.
- Allow redirects to your Vercel domain (security).

### Step 4.1: Open Supabase Auth URL settings

1. Go to **https://supabase.com** and open your **project** (the one you use for SoundVault).
2. In the **left sidebar**, click **Authentication** (person icon).
3. Click **URL Configuration** (or in some layouts: **Settings** or **Auth** → **URL Configuration**). You’ll see **Site URL** and **Redirect URLs**.

### Step 4.2: Set Site URL

1. Find the **Site URL** field.
2. Replace the value (e.g. `http://localhost:3000`) with your **exact** Vercel URL:
   - Example: `https://soundvault.vercel.app`
   - No trailing slash: use `https://soundvault.vercel.app` not `https://soundvault.vercel.app/`.
3. This is where Supabase sends users after a successful sign-in when no other redirect is specified.

### Step 4.3: Add Redirect URLs

1. Find **Redirect URLs** (or “Additional Redirect URLs” or “Allow list”). This is a list or text area of URLs Supabase is allowed to redirect to.
2. Add your production URL. Different Supabase UIs accept one per line or comma-separated. Add **both** of these if possible:
   - `https://soundvault.vercel.app`
   - `https://soundvault.vercel.app/**`
   (Replace `soundvault` with your actual Vercel project name if different.)
3. The `/**` means “any path on this host” (e.g. `/library`, `/login`), which your app needs for protected routes and login redirects.
4. If you already have `http://localhost:3000` for local development, leave it there so local still works.
5. Click **Save** (or the page may auto-save). Wait for a success message.

### Step 4.4: Optional — email confirmation

- Under **Authentication** → **Providers** → **Email**, you can enable **Confirm email**. If you do, users must click a link in email before they can log in. For testing you can leave it off. For production you may want to enable it and set up **SMTP** (custom email server) so emails don’t go to spam.

---

## Part 5: Test the deployed app

1. **Open your Vercel URL** in the browser (e.g. `https://soundvault.vercel.app`).
2. **Sign up**: Click **Sign up**, enter an email and password, submit. You should be redirected to the **Library** page (no “redirect not allowed” error).
3. **Upload**: Click **Upload** in the sidebar, choose an MP3/M4A/WAV file, set title, click Upload. The file should appear in **Library**.
4. **Play**: Click the play button on a track. The bottom player bar should appear and audio should play (if the file is valid).
5. **Search / Playlists / Recently played**: Use each feature once to confirm they work.

If anything fails, see Part 6 (Troubleshooting).

---

## Part 6: Troubleshooting

### “Redirect URL not allowed” or auth redirect fails

- **Cause**: Supabase doesn’t have your Vercel URL in Redirect URLs or Site URL is wrong.
- **Fix**: In Supabase → **Authentication** → **URL Configuration**, set **Site URL** to `https://YOUR-PROJECT.vercel.app` (no trailing slash) and add `https://YOUR-PROJECT.vercel.app` and `https://YOUR-PROJECT.vercel.app/**` to **Redirect URLs**. Save and try again.

### Blank page or “Invalid API key” on the live site

- **Cause**: Vercel doesn’t have the right env vars or they weren’t applied to the deployment.
- **Fix**: In Vercel, open your project → **Settings** → **Environment Variables**. Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set for **Production** (and that the values match your `.env.local`). Then go to **Deployments**, open the **…** menu on the latest deployment, and click **Redeploy**. Don’t change any build settings — just redeploy so the build uses the env vars.

### Build fails on Vercel (e.g. “Module not found” or TypeScript error)

- **Cause**: The code in the repo has an error or missing dependency.
- **Fix**: On your PC, run `npm run build` in the project folder. Fix any errors locally, then commit and push. Vercel will redeploy. If the build works locally but not on Vercel, check that you didn’t add anything to `.gitignore` that Vercel needs (e.g. don’t ignore needed source files).

### Upload works locally but not on Vercel (e.g. RLS or 403)

- **Cause**: Usually storage RLS or bucket config; sometimes the anon key or project URL is wrong on Vercel.
- **Fix**: Confirm Supabase **Storage** has the **audio** bucket and the RLS policies from the second migration (users can only access `audio/{user_id}/*`). Also confirm Vercel env vars are correct and redeploy.

### Changes don’t appear on the live site

- **Cause**: You edited code locally but didn’t push, or Vercel didn’t redeploy.
- **Fix**: Run `git add .`, `git commit -m "Your message"`, `git push`. Vercel will build and deploy automatically. Check the **Deployments** tab for status; if the latest deployment is “Ready”, open the production URL again (and do a hard refresh: Ctrl+Shift+R).

### Custom domain

- In Vercel: **Settings** → **Domains** → add your domain. Vercel will show DNS records to add at your registrar. After DNS propagates, Vercel will serve the app on your domain. Then in **Supabase** → **Authentication** → **URL Configuration**, add your custom URL to **Site URL** and **Redirect URLs** (e.g. `https://music.yourdomain.com` and `https://music.yourdomain.com/**`).

---

## Summary checklist

- [ ] Git installed; project folder has `git init`, first commit, and is pushed to GitHub (no `.env.local` in the repo).
- [ ] Vercel account linked to GitHub; project imported from the correct repo.
- [ ] **Environment variables** on Vercel: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set for Production (and Preview if desired).
- [ ] First deployment **succeeded** and you have a **Visit** URL.
- [ ] **Supabase** → **Authentication** → **URL Configuration**: **Site URL** = your Vercel URL; **Redirect URLs** include your Vercel URL and `/**`.
- [ ] Tested on the live URL: sign up, upload a track, play, search, playlists.

After that, every push to `main` (or your default branch) will trigger a new deployment so the live site stays up to date.
