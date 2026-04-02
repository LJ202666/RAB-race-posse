# RAB Race Posse 🏃

A mobile-first PWA for your running crew to coordinate events, logistics, and results.

---

## 🚀 Deployment Guide (20 minutes, all free)

### Step 1 — Set up Supabase (shared database)

1. Go to [supabase.com](https://supabase.com) and click **Start your project** (free)
2. Sign in with GitHub or email
3. Click **New project**, name it `rab-race-posse`, pick a region close to Australia
4. Wait ~2 minutes for it to spin up
5. Go to **SQL Editor** (left sidebar)
6. Copy the entire contents of `supabase-schema.sql` and paste it in
7. Click **Run** — this creates all your tables and seeds your members
8. Go to **Settings → API**
9. Copy your **Project URL** and **anon public** key — you'll need these next

---

### Step 2 — Deploy to Vercel

1. Go to [github.com](https://github.com) and create a free account if you don't have one
2. Create a **new repository** called `rab-race-posse`
3. Upload all files from this folder to that repo (drag and drop works)
4. Go to [vercel.com](https://vercel.com) and sign in with GitHub
5. Click **Add New → Project**
6. Import your `rab-race-posse` repo
7. Before clicking Deploy, click **Environment Variables** and add:
   - `REACT_APP_SUPABASE_URL` → paste your Supabase Project URL
   - `REACT_APP_SUPABASE_ANON_KEY` → paste your Supabase anon key
8. Click **Deploy** — takes about 2 minutes
9. Vercel gives you a URL like `rab-race-posse.vercel.app` — share this with your crew!

---

### Step 3 — Install on phones (PWA)

**iPhone:**
1. Open the URL in Safari
2. Tap the Share button (box with arrow)
3. Tap **Add to Home Screen**
4. Done — it appears like a real app!

**Android:**
1. Open the URL in Chrome
2. Tap the three-dot menu
3. Tap **Add to Home Screen**

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Add your Supabase credentials
cp .env.example .env.local
# Edit .env.local with your values

# Start dev server
npm start
```

---

## 📁 Project Structure

```
src/
  screens/
    EventsScreen.jsx    — Browse & RSVP to events
    GroupScreen.jsx     — All 12 members + invite
    LogisticsScreen.jsx — Travel, carpools, stays, meetups
    MyRunsScreen.jsx    — Personal results + PB logging
  data/
    mockData.js         — Sample data (replace with Supabase)
  supabaseClient.js     — Database connection
  App.jsx               — Main app + tab navigation
  index.css             — Global styles & design tokens
supabase-schema.sql     — Run this in Supabase SQL editor
```

---

## 🔗 Connecting Supabase to the App

The app currently runs on mock data. To switch to live shared data:

In each screen file, replace the mock data with Supabase queries. Example:

```javascript
import { supabase } from "../supabaseClient";

// Instead of: const [events, setEvents] = useState(initialEvents)
// Use:
useEffect(() => {
  supabase.from("events").select("*").then(({ data }) => setEvents(data));
}, []);
```

Want help wiring this up? Ask Claude to "connect the Events screen to Supabase"!
