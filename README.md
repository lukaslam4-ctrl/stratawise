# StrataWise — Depreciation Report System 

## Deploy to Netlify in 5 steps

### Prerequisites
- [Node.js](https://nodejs.org) v18 or later installed
- A free [Netlify account](https://netlify.com)
- A free [GitHub account](https://github.com) (recommended)

---

### Step 1 — Install dependencies
Open a terminal in this folder and run:
```
npm install
```

### Step 2 — Test locally (optional but recommended)
```
npm run dev
```
Open http://localhost:5173 in your browser. You should see the app.

### Step 3 — Build for production
```
npm run build
```
This creates a `dist/` folder with plain HTML/JS/CSS ready to deploy.

### Step 4 — Deploy to Netlify

**Option A: Drag & drop (quickest)**
1. Go to https://app.netlify.com
2. Click "Add new site" → "Deploy manually"
3. Drag the `dist/` folder into the upload area
4. Done — Netlify gives you a live URL instantly

**Option B: Connect GitHub (recommended for updates)**
1. Push this folder to a GitHub repo
2. Go to https://app.netlify.com → "Add new site" → "Import from Git"
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click Deploy — Netlify auto-redeploys on every git push

---

## About data storage

Currently the app stores all project data in the browser's `localStorage`.
This means:
- ✅ Works immediately with no backend needed
- ✅ Data persists between page reloads on the same browser
- ❌ Data is lost if the user clears their browser
- ❌ Data doesn't sync across devices or users

### Want real cloud storage?
The recommended upgrade path is **Supabase** (free tier available):
1. Create a project at https://supabase.com
2. Create a `projects` table with columns: `id`, `user_id`, `data` (jsonb), `created_at`, `updated_at`
3. Replace the `useStorage` hook in `src/App.jsx` with Supabase API calls
4. Add `@supabase/supabase-js` to package.json

Ask Claude to help you add Supabase storage when you're ready.
