# What's Trending — Task List

## Phase 1–5: Supabase Integration ✅
- [x] Config, gitignore, Supabase tables, auth, admin panel, live data fetch

## Phase 6: Vercel Deployment ✅
- [x] vercel.json, environment variables, GitHub → Vercel auto-deploy
- [x] build.sh generates config.js from env vars
- [x] Automated Monday cron + manual "Update This Week" button

## Phase 7: Dynamic Departments ✅
- [x] categories table seeded in Supabase (12 departments)
- [x] app.js loads categories dynamically, inline badge colors
- [x] admin.html category dropdown populated from DB
- [x] Departments tab with Add / Edit / Delete

## Phase 8: Full Department Coverage in Weekly Update ✅
- [x] Departments split into batches of 3
- [x] Claude called once per batch (5 items per dept, ~15 per call)
- [x] Progress shown to admin: "Claude… batch 2 of 4"
- [x] All results combined then saved in one delete + insert

---

## Review

### What was built
A PWA for supermarket research teams that tracks weekly food trends across all store departments. Key features:
- Live Supabase backend (trending_items, archive, meta, categories tables)
- Auth with first-login password change flow
- Admin panel: manage trends, users, departments
- Automated Monday cron + manual "Update This Week" button (batched Claude calls, 5 items per dept)
- Research Agent for on-demand trend lookups
- Rankings section (month/quarter/year archive)
- Dynamic departments — admins can add/edit/delete from the UI
- Deployed on Vercel with build.sh generating config from env vars
