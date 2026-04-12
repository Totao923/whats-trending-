// ============================================================
//  TRENDING FOOD RESEARCH AGENT — Fully Automated
//
//  WHAT IT DOES:
//    1. Claude generates 12 trending food items for this week
//    2. Current week's items are moved to ARCHIVE automatically
//    3. trending.js is updated and ready to publish
//
//  RESEARCH TEAM ONLY NEEDS TO:
//    - Open data/trending.js
//    - Add up to 3 video URLs per item  (videos: [] field)
//    - Save — all stores see the update instantly
//
//  USAGE:
//    cd research && node research-agent.js
// ============================================================

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRENDING_JS = path.join(__dirname, '..', 'data', 'trending.js');

config({ path: path.join(__dirname, '.env') });

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('\n❌  Missing ANTHROPIC_API_KEY in research/.env');
  process.exit(1);
}

const client = new Anthropic({ apiKey: API_KEY });

// ── Date helpers ──────────────────────────────────────────
function getWeekLabel() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return `Week of ${fmt(monday)} – ${fmt(sunday)}, ${monday.getFullYear()}`;
}

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
}

function getNextMonday() {
  const now = new Date();
  const day = now.getDay();
  const next = new Date(now);
  next.setDate(now.getDate() + ((8 - day) % 7 || 7));
  return next.toISOString().split('T')[0];
}

function today() {
  return new Date().toISOString().split('T')[0];
}

// ── Read existing trending.js to extract current items for archive ──
function extractCurrentData() {
  try {
    const src = fs.readFileSync(TRENDING_JS, 'utf8');

    // Extract meta
    const metaMatch = src.match(/meta:\s*\{([^}]+)\}/);
    let weekLabel = '', weekNumber = 0;
    if (metaMatch) {
      const wl = metaMatch[1].match(/weekLabel:\s*["']([^"']+)["']/);
      const wn = metaMatch[1].match(/weekNumber:\s*(\d+)/);
      if (wl) weekLabel = wl[1];
      if (wn) weekNumber = parseInt(wn[1]);
    }

    // Extract item names for archive
    const nameMatches = [...src.matchAll(/name:\s*["']([^"']+)["']/g)];
    const itemNames = nameMatches.map(m => m[1]).slice(0, 12);

    // Extract existing ARCHIVE block
    const archiveMatch = src.match(/const ARCHIVE\s*=\s*(\[[\s\S]*?\]);/);
    let existingArchive = [];
    if (archiveMatch) {
      try {
        existingArchive = eval(archiveMatch[1]);
      } catch (_) {}
    }

    return { weekLabel, weekNumber, itemNames, existingArchive };
  } catch (_) {
    return { weekLabel: '', weekNumber: 0, itemNames: [], existingArchive: [] };
  }
}

// ── Ask Claude for new trending items ────────────────────
async function generateTrends(weekLabel, weekNumber) {
  const systemPrompt = `You are the head of food trend research for a major supermarket chain with deep expertise in social media food culture.

You track TikTok, YouTube, Instagram, and X daily. You know exactly which food trends are exploding right now in ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.

You focus exclusively on:
1. Kitchen dishes / meal recipes customers can recreate using supermarket ingredients
2. Bakery items (pastries, breads, cakes, desserts) currently going viral
3. Grocery product trends (specific ingredients, condiments, packaged items spiking in demand)

Output valid JavaScript only — no markdown, no explanations, no code fences.`;

  const userPrompt = `Generate the weekly trending food report for ${weekLabel}.

Identify the 12 hottest food trends RIGHT NOW (4 kitchen dishes, 4 bakery items, 4 grocery items) actively trending across TikTok, YouTube, Instagram, and X.

For each trend:
- Pick items with genuine viral momentum this week — not evergreen basics
- Focus on items customers can buy ingredients for at a regular supermarket
- Identify the specific hashtags driving the trend
- Write a concrete, specific supermarket opportunity for store managers
- Leave videos as empty array — research team adds URLs after

Output ONLY this JavaScript (no text before or after):

const TRENDING_DRAFT = {
  meta: {
    weekLabel: "${weekLabel}",
    weekNumber: ${weekNumber},
    year: ${new Date().getFullYear()},
    publishedBy: "Claude Research Agent",
    publishedAt: "${today()}",
    nextUpdate: "${getNextMonday()}",
    notes: "2-3 sentence summary of this week's dominant themes across TikTok, YouTube, Instagram, X"
  },
  items: [
    {
      id: "k001",
      category: "kitchen",
      name: "Full trend name",
      tagline: "Punchy one-liner under 65 characters",
      viralScore: 95,
      trend: "rising",
      platforms: ["tiktok", "youtube", "instagram"],
      hashtags: ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4"],
      description: "2-3 sentences explaining why this is trending now and why customers want to make it at home.",
      keyIngredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5"],
      difficulty: 2,
      prepTime: "30 min",
      servings: "4",
      supermarketAngle: "Specific actionable store strategy: what to stock, bundle, display, and which departments benefit.",
      storeSection: ["Dept 1", "Dept 2"],
      estimatedCost: "$12–16",
      weeklyMentions: 3500000,
      addedWeek: ${weekNumber},
      videos: []
    }
  ]
};

Rules:
- id: k001–k004 for kitchen, b001–b004 for bakery, g001–g004 for grocery
- difficulty: 1=easy, 2=medium, 3=advanced
- trend: "rising" | "steady" | "falling"
- viralScore 0–100
- platforms: only ["tiktok","youtube","instagram","x"] lowercase
- Output the JavaScript only. Nothing else.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')
    .replace(/^```[a-z]*\n?/m, '')
    .replace(/\n?```$/m, '')
    .trim();

  const jsMatch = text.match(/const TRENDING_DRAFT\s*=\s*\{[\s\S]*\}\s*;?\s*$/);
  if (!jsMatch) {
    fs.writeFileSync(path.join(__dirname, 'debug-raw-output.txt'), text);
    throw new Error('Could not parse Claude output. Raw saved to research/debug-raw-output.txt');
  }

  const js = jsMatch[0].endsWith(';') ? jsMatch[0] : jsMatch[0] + ';';
  const validate = new Function(`${js}\nreturn TRENDING_DRAFT;`);
  return validate();
}

// ── Write updated trending.js ────────────────────────────
function writeTrendingJs(newData, archiveEntries) {
  const archive = archiveEntries.slice(0, 8);

  // Use plain JSON — safe against apostrophes, quotes, special chars in Claude's text
  const itemsJs   = JSON.stringify(newData.items, null, 2);
  const archiveJs = JSON.stringify(archive, null, 2);
  const metaJs    = JSON.stringify(newData.meta, null, 2);

  const output = `// ============================================================
//  WEEKLY TRENDING DATA
//  Auto-updated by Claude Research Agent
//  Last run: ${new Date().toLocaleString()}
//
//  RESEARCH TEAM — only step needed each week:
//  Add up to 3 video links per item in the videos: [] field below.
//  Format: { "platform": "tiktok", "title": "Video title", "url": "https://..." }
// ============================================================

const TRENDING_DATA = {

  // ── Meta ─────────────────────────────────────────────────
  meta: ${metaJs},

  // ── Platforms Reference ──────────────────────────────────
  platforms: {
    tiktok:    { label: "TikTok",    color: "#ff0050", icon: "🎵" },
    youtube:   { label: "YouTube",   color: "#ff0000", icon: "▶" },
    instagram: { label: "Instagram", color: "#e1306c", icon: "📸" },
    x:         { label: "X",         color: "#1d9bf0", icon: "𝕏" }
  },

  // ── Categories ───────────────────────────────────────────
  categories: [
    { id: "all",     label: "All Trends",     icon: "🔥" },
    { id: "kitchen", label: "Kitchen Dishes", icon: "🍽" },
    { id: "bakery",  label: "Bakery",         icon: "🥐" },
    { id: "grocery", label: "Grocery Items",  icon: "🛒" }
  ],

  // ── Trend Items ──────────────────────────────────────────
  //  ADD VIDEO LINKS HERE ↓
  //  videos: [ { "platform": "tiktok", "title": "...", "url": "https://..." } ]
  items: ${itemsJs}

};

// ─────────────────────────────────────────────────────────
//  ARCHIVE: Previous weeks (auto-managed, last 8 weeks)
// ─────────────────────────────────────────────────────────
const ARCHIVE = ${archiveJs};
`;

  fs.writeFileSync(TRENDING_JS, output, 'utf8');
}

// ── Main ──────────────────────────────────────────────────
async function run() {
  console.log('\n🔥  TRENDING FOOD RESEARCH AGENT');
  console.log('━'.repeat(50));
  const weekLabel = getWeekLabel();
  const weekNumber = getWeekNumber();
  console.log(`📅  ${weekLabel}`);
  console.log('🤖  Claude is analyzing current food trends...\n');

  // 1. Read existing data for archiving
  const { weekLabel: oldWeekLabel, weekNumber: oldWeekNum, itemNames, existingArchive } = extractCurrentData();

  // 2. Build new archive entry from outgoing week
  const newArchiveEntry = oldWeekLabel ? {
    weekLabel: oldWeekLabel,
    weekNumber: oldWeekNum,
    year: new Date().getFullYear(),
    topItems: itemNames.slice(0, 6),
    notes: `Auto-archived on ${today()}. Review sales data to add performance notes.`
  } : null;

  const updatedArchive = [
    ...(newArchiveEntry ? [newArchiveEntry] : []),
    ...existingArchive
  ].slice(0, 8);

  // 3. Generate new trends with Claude
  process.stdout.write('🔍  Generating trend report');
  const newData = await generateTrends(weekLabel, weekNumber);
  console.log(' ✅\n');

  // 4. Write updated trending.js
  writeTrendingJs(newData, updatedArchive);

  // 5. Summary
  const k = newData.items.filter(i => i.category === 'kitchen').length;
  const b = newData.items.filter(i => i.category === 'bakery').length;
  const g = newData.items.filter(i => i.category === 'grocery').length;

  console.log(`✅  ${newData.items.length} trending items written to data/trending.js`);
  console.log(`📊  ${k} kitchen · ${b} bakery · ${g} grocery`);
  console.log(`🗂   Previous week archived (${updatedArchive.length} weeks in archive)\n`);
  console.log('📋  TOP TRENDS THIS WEEK:');
  newData.items
    .sort((a, b) => b.viralScore - a.viralScore)
    .slice(0, 6)
    .forEach((item, i) => console.log(`    ${i + 1}. ${item.name} (score: ${item.viralScore})`));

  console.log('\n─────────────────────────────────────────────────────');
  console.log('  ✅ trending.js is updated and ready.');
  console.log('  TEAM: Open data/trending.js and add video URLs');
  console.log('  to the  videos: []  field on each item.');
  console.log('  Then refresh the app — stores see it instantly.');
  console.log('─────────────────────────────────────────────────────\n');
}

run().catch(err => {
  console.error('\n❌  Error:', err.message);
  if (err.status === 401) console.error('    Invalid API key — check research/.env');
  if (err.status === 529) console.error('    API overloaded — try again in a few minutes');
  process.exit(1);
});
