# What's Trending — Task List

## Phase 1–5: Supabase Integration ✅
- [x] Config, gitignore, Supabase tables, auth, admin panel, live data fetch

## Phase 6: Vercel Deployment ✅
- [x] vercel.json, environment variables, GitHub → Vercel auto-deploy
- [x] build.sh generates config.js from env vars
- [x] Automated Monday cron + manual "Update This Week" button

---

## Phase 7: Dynamic Departments / Categories

Allow admins to add, edit, and delete departments (Produce, Meat & Fish, Deli, Toys, etc.). Filter bar and trend forms update automatically.

- [ ] 1. Seed a `categories` table in Supabase via REST API — existing 3 + new supermarket departments
- [ ] 2. Update `app.js` — load categories from Supabase; use inline color styles for badges (drop hardcoded CSS classes)
- [ ] 3. Update `admin.html` — populate the category `<select>` dynamically on page load
- [ ] 4. Add a **Departments** tab in admin.html — list all categories with Add / Edit / Delete
- [ ] 5. Deploy and verify

### Scope
- `categories` table: `id` TEXT (e.g. "produce"), `label` TEXT, `icon` TEXT (emoji), `color` TEXT (hex)
- "All Trends" stays hardcoded in UI — not a real DB category
- Badge colors switch from CSS classes to inline styles so any new department works automatically

---

## Review
_(added after completion)_
