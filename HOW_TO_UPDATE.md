# How to Update Weekly Trends

## Every Monday — Research Team Workflow

There are two ways to update: **Claude does the research** (recommended) or **manual entry**.

---

## OPTION A — Claude Research Agent (Recommended)

Claude searches TikTok, YouTube, Instagram, and X automatically, finds the top trending food items, locates the top 3 videos per item, and writes a draft for your team to review.

### First-time setup (do once)
```bash
cd "whats trending/research"
npm install
```

Get your Anthropic API key from: https://console.anthropic.com

### Run every Monday
```bash
cd "whats trending/research"
ANTHROPIC_API_KEY=your_key_here node research-agent.js
```

Claude will:
1. Search social media for trending food content
2. Find the top 3 viral videos per item (with real URLs)
3. Score each trend (viral score, weekly mentions)
4. Write the supermarket opportunity for each item
5. Save a draft to `data/trending-draft.js`

### Your team then reviews (10–15 min)
1. Open `data/trending-draft.js` in Cursor
2. Review each item — edit anything that looks off
3. Verify video links open correctly (click each URL)
4. Remove items that don't fit your stores or region
5. Copy the approved items into `data/trending.js`
6. Update the `meta` block at the top of `trending.js`
7. Refresh the app — all stores see the update instantly

---

## OPTION B — Manual Entry

### Step 1 — Research (30–45 min)
Check these sources for the week's top food trends:

| Platform   | Where to look                                        |
|------------|------------------------------------------------------|
| TikTok     | Search "trending food", sort by Most Viewed (7 days) |
| YouTube    | YouTube Trending > Food section                      |
| Instagram  | Explore > Reels > Food & Cooking                    |
| X (Twitter)| Trending tab + search "recipe viral"                 |

For each trend you pick, copy the URL of the top 3 most-viewed videos.

### Step 2 — Update `data/trending.js`

#### A. Update the meta block at the top
```js
meta: {
  weekLabel: "Week of April 14 – 20, 2026",
  weekNumber: 16,
  publishedBy: "Your Name",
  publishedAt: "2026-04-14",
  nextUpdate: "2026-04-21",
  notes: "1-2 sentence summary of this week's major theme"
},
```

#### B. Add videos to each item
```js
videos: [
  { platform: "tiktok",    title: "Exact title of the video", url: "https://www.tiktok.com/..." },
  { platform: "youtube",   title: "Exact title of the video", url: "https://www.youtube.com/watch?v=..." },
  { platform: "instagram", title: "Exact title of the video", url: "https://www.instagram.com/reel/..." },
]
```
- Max 3 videos per item
- Try to pull from different platforms if the trend is on multiple
- Leave `videos: []` if you can't find good videos this week

#### C. Add new trending items
```js
{
  id: "k007",
  category: "kitchen",       // "kitchen" | "bakery" | "grocery"
  name: "Item Name",
  tagline: "One punchy line",
  viralScore: 85,            // 0–100
  trend: "rising",           // "rising" | "steady" | "falling"
  platforms: ["tiktok", "instagram"],
  hashtags: ["#hashtag1", "#hashtag2"],
  description: "2-3 sentences on why it's trending.",
  keyIngredients: ["Ingredient 1", "Ingredient 2"],
  difficulty: 2,             // 1=easy, 2=medium, 3=advanced
  prepTime: "30 min",
  servings: "4",
  supermarketAngle: "Specific store action — what to stock, bundle, display.",
  storeSection: ["Meat Dept", "Produce"],
  estimatedCost: "$10–15",
  weeklyMentions: 2500000,
  addedWeek: 16,
  videos: []
}
```

#### D. Move old week to ARCHIVE
Add the outgoing week to the ARCHIVE array at the bottom. Keep last 8 weeks.

---

## Viral Score Guide

| Score   | Meaning                                         |
|---------|-------------------------------------------------|
| 90–100  | Explosion — tens of millions of views           |
| 75–89   | Very hot — multiple platforms, high velocity    |
| 60–74   | Solid trend — building momentum                 |
| Below 60 | Watch list — emerging / niche                  |

## Video Link Rules
- Always verify the URL opens before publishing
- Use the highest-view video you can find for each platform
- If a video gets taken down, remove it next week
- Max 3 videos per item — pick the most representative ones

---

*This file is for the research team only.*
