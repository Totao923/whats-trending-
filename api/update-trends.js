// Vercel Cron Job — runs every Monday at 9am UTC
// Calls Claude to research new food trends, archives old ones, updates Supabase

export const config = { maxDuration: 60 };

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

function supabase(path, method = 'GET', body = null) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : ''
    },
    body: body ? JSON.stringify(body) : null
  });
}

function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

export default async function handler(req, res) {
  // Allow GET (from Vercel cron) or POST (manual trigger from admin)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret if set
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${secret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    const now = new Date();
    const weekNumber = getWeekNumber(now);
    const year = now.getFullYear();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (8 - now.getDay()) % 7 || 7);
    const weekLabel = `Week ${weekNumber}, ${year}`;
    const nextUpdate = nextMonday.toISOString().split('T')[0];

    // 1. Get current trending items to archive
    const currentRes = await supabase('trending_items?select=name,category');
    const currentItems = await currentRes.json();

    // 2. Archive current week if we have items
    if (Array.isArray(currentItems) && currentItems.length > 0) {
      const metaRes = await supabase('meta?select=week_label,week_number,year&order=id.desc&limit=1');
      const metaArr = await metaRes.json();
      const prevMeta = metaArr[0] || {};

      await supabase('archive', 'POST', {
        week_label:  prevMeta.week_label || weekLabel,
        week_number: prevMeta.week_number || weekNumber,
        year:        prevMeta.year || year,
        items:       currentItems.map(i => i.name)
      });
    }

    // 3. Ask Claude for this week's trending food items
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `You are a food trend analyst for a supermarket chain research team. Research the top trending food items right now (week of ${now.toDateString()}).

Return ONLY a JSON array of exactly 12 items — 4 per category (kitchen, bakery, grocery). No markdown, no explanation, just raw JSON.

Each item must have these exact fields:
{
  "category": "kitchen" | "bakery" | "grocery",
  "name": "Item name",
  "tagline": "One catchy sentence",
  "viral_score": 75,
  "trend": "🔥 Viral" | "📈 Rising" | "⚡ Emerging",
  "platforms": ["TikTok","Instagram"],
  "hashtags": ["#example"],
  "description": "2-3 sentence description of why this is trending",
  "key_ingredients": ["ingredient1","ingredient2"],
  "difficulty": "Easy" | "Medium" | "Hard",
  "prep_time": "30 mins",
  "servings": "4 servings",
  "supermarket_angle": "How supermarkets can capitalize on this trend",
  "store_section": ["Produce","Dairy"],
  "estimated_cost": "$8-12",
  "weekly_mentions": 45000,
  "added_week": ${weekNumber}
}`
        }]
      })
    });

    const claudeData = await claudeRes.json();
    if (!claudeRes.ok) {
      throw new Error(`Claude API error: ${JSON.stringify(claudeData)}`);
    }

    const rawText = claudeData.content[0].text.trim();
    // Strip any accidental markdown fences
    const jsonText = rawText.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '');
    const newItems = JSON.parse(jsonText);

    if (!Array.isArray(newItems) || newItems.length === 0) {
      throw new Error('Claude returned invalid items array');
    }

    // 4. Delete all current trending items
    await supabase('trending_items?id=gte.0', 'DELETE');

    // 5. Insert new trending items
    await supabase('trending_items', 'POST', newItems);

    // 6. Update meta
    await supabase('meta?id=gte.0', 'DELETE');
    await supabase('meta', 'POST', {
      week_label:  weekLabel,
      week_number: weekNumber,
      year,
      next_update: nextUpdate
    });

    return res.status(200).json({
      ok: true,
      week: weekLabel,
      itemsAdded: newItems.length
    });

  } catch (err) {
    console.error('update-trends error:', err);
    return res.status(500).json({ error: err.message });
  }
}
