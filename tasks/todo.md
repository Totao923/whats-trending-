# What's Trending — Supabase Integration Plan

## Phase 1: Config & Git Setup
- [x] Create `.gitignore` (exclude `config.js`, `.env`)
- [x] Create `config.js` with Supabase URL + anon key (loaded via script tag, gitignored)

## Phase 2: Supabase Tables
- [x] `trending_items` table (all fields including description, prep_time, servings)
- [x] `archive` table
- [x] `meta` table
- [x] Row Level Security: public read, admin-only write
- [x] Seed all 12 items + meta + 4 archive weeks into Supabase

## Phase 3: Auth — Login Page
- [x] Create `login.html` with email/password form
- [x] Add Supabase CDN script to `index.html` and `login.html`
- [x] Auth guard on `index.html` — redirects to login if no session
- [x] Logout button in app header
- [x] Admin button in header (visible to admin users only)

## Phase 4: Admin Panel
- [x] Create `admin.html` — list, add, edit, delete trends
- [x] Admin-only access check (redirects non-admins)
- [x] Admin account created: hescoto@icloud.com (role: admin)

## Phase 5: Fetch Live Data in App
- [x] Replace static `data/trending.js` load with Supabase fetch in `app.js`
- [x] Loading state while fetching
- [x] Error handling if fetch fails

## Phase 6: Vercel Deployment
- [ ] Add `vercel.json`
- [ ] Move credentials to Vercel environment variables
- [ ] Connect GitHub repo → Vercel for auto-deploy

---

## Review
_(to be filled in after Phase 6)_
