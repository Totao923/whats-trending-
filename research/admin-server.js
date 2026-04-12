// ============================================================
//  ADMIN SERVER — Research Team Video Link Dashboard
//
//  USAGE: node admin-server.js
//  Opens: http://localhost:4000
// ============================================================

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRENDING_JS = path.join(__dirname, '..', 'data', 'trending.js');
const app = express();

app.use(express.json());

// ── Load current items from trending.js ───────────────────
function loadItems() {
  const src = fs.readFileSync(TRENDING_JS, 'utf8');
  // Execute the file in a sandbox to get TRENDING_DATA
  const sandbox = new Function(`
    ${src}
    return { items: TRENDING_DATA.items, meta: TRENDING_DATA.meta };
  `);
  return sandbox();
}

// ── Save updated video links back to trending.js ──────────
function saveVideos(updates) {
  // updates = [ { id: "k001", videos: [...] }, ... ]
  const src = fs.readFileSync(TRENDING_JS, 'utf8');

  // Parse current data
  const sandbox = new Function(`${src}\nreturn { TRENDING_DATA, ARCHIVE };`);
  const { TRENDING_DATA, ARCHIVE } = sandbox();

  // Apply video updates
  const updatesMap = {};
  updates.forEach(u => { updatesMap[u.id] = u.videos; });

  TRENDING_DATA.items = TRENDING_DATA.items.map(item => ({
    ...item,
    videos: updatesMap[item.id] !== undefined ? updatesMap[item.id] : item.videos
  }));

  // Rewrite the file
  const metaJs   = JSON.stringify(TRENDING_DATA.meta, null, 2);
  const itemsJs  = JSON.stringify(TRENDING_DATA.items, null, 2);
  const archiveJs = JSON.stringify(ARCHIVE, null, 2);

  const output = `// ============================================================
//  WEEKLY TRENDING DATA
//  Auto-updated by Claude Research Agent
//  Video links updated via Admin Dashboard: ${new Date().toLocaleString()}
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

  items: ${itemsJs}

};

const ARCHIVE = ${archiveJs};
`;

  fs.writeFileSync(TRENDING_JS, output, 'utf8');
}

// ── API Routes ────────────────────────────────────────────
app.get('/api/items', (req, res) => {
  try {
    const data = loadItems();
    res.json({ ok: true, ...data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/videos', (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates)) throw new Error('Invalid payload');
    saveVideos(updates);
    res.json({ ok: true, saved: updates.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Serve the admin dashboard HTML inline ─────────────────
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Trending — Video Link Dashboard</title>
<style>
  :root {
    --bg: #0f172a; --card: #1e293b; --card2: #263346;
    --accent: #10b981; --accent2: #34d399; --border: rgba(148,163,184,0.12);
    --text: #f1f5f9; --muted: #94a3b8; --dim: #64748b;
    --tiktok: #ff0050; --youtube: #ff4444; --instagram: #e1306c; --x: #1d9bf0;
    --danger: #ef4444; --warning: #f59e0b;
    --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font); background: var(--bg); color: var(--text);
         min-height: 100vh; -webkit-font-smoothing: antialiased; }

  /* Header */
  .header { background: #0a1120; border-bottom: 1px solid var(--border);
             padding: 0 24px; position: sticky; top: 0; z-index: 100; }
  .header-inner { max-width: 1100px; margin: 0 auto; height: 60px;
                  display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand-icon { width: 34px; height: 34px; background: linear-gradient(135deg,#10b981,#059669);
                border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .brand h1 { font-size: 1rem; font-weight: 700; }
  .brand span { font-size: 0.7rem; color: var(--accent); text-transform: uppercase;
                letter-spacing: .06em; display: block; }
  .week-badge { background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.35);
                border-radius: 20px; padding: 5px 14px; font-size: .75rem;
                color: var(--accent2); font-weight: 600; }
  .save-all-btn { background: var(--accent); color: #fff; border: none; border-radius: 8px;
                  padding: 9px 20px; font-size: .85rem; font-weight: 700; cursor: pointer;
                  transition: background .15s; display: flex; align-items: center; gap: 6px; }
  .save-all-btn:hover { background: var(--accent2); color: #0f172a; }
  .save-all-btn:disabled { background: var(--dim); cursor: not-allowed; }

  /* Layout */
  .main { max-width: 1100px; margin: 0 auto; padding: 28px 24px 60px; }

  /* Stats bar */
  .stats { display: flex; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
  .stat { background: var(--card); border: 1px solid var(--border); border-radius: 10px;
          padding: 12px 18px; }
  .stat-num { font-size: 1.4rem; font-weight: 900; color: var(--accent); line-height: 1; }
  .stat-label { font-size: .65rem; text-transform: uppercase; letter-spacing: .07em;
                color: var(--dim); margin-top: 3px; }
  .progress-stat { margin-left: auto; }
  .progress-stat .stat-num { color: var(--warning); }
  .progress-stat.done .stat-num { color: var(--accent); }

  /* Section heading */
  .section-title { font-size: .7rem; font-weight: 700; text-transform: uppercase;
                   letter-spacing: .1em; color: var(--dim); margin: 28px 0 14px;
                   display: flex; align-items: center; gap: 8px; }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* Item card */
  .item-card { background: var(--card); border: 1px solid var(--border);
               border-radius: 14px; margin-bottom: 14px; overflow: hidden;
               transition: border-color .2s; }
  .item-card.has-videos { border-color: rgba(16,185,129,.35); }

  .item-header { padding: 16px 18px; display: flex; align-items: center;
                 gap: 14px; cursor: pointer; user-select: none; }
  .item-header:hover { background: var(--card2); }

  .item-rank { width: 28px; height: 28px; background: rgba(16,185,129,.12);
               border: 1px solid rgba(16,185,129,.25); border-radius: 7px;
               display: flex; align-items: center; justify-content: center;
               font-size: .75rem; font-weight: 800; color: var(--accent); flex-shrink: 0; }
  .item-info { flex: 1; min-width: 0; }
  .item-name { font-size: .95rem; font-weight: 700; white-space: nowrap;
               overflow: hidden; text-overflow: ellipsis; }
  .item-meta { display: flex; gap: 8px; align-items: center; margin-top: 4px; flex-wrap: wrap; }
  .cat-badge { font-size: .62rem; font-weight: 700; text-transform: uppercase;
               letter-spacing: .07em; padding: 2px 8px; border-radius: 20px; }
  .cat-kitchen  { background: rgba(59,130,246,.15); color: #60a5fa; border: 1px solid rgba(59,130,246,.25); }
  .cat-bakery   { background: rgba(245,158,11,.15);  color: #fbbf24; border: 1px solid rgba(245,158,11,.25); }
  .cat-grocery  { background: rgba(168,85,247,.15);  color: #c084fc; border: 1px solid rgba(168,85,247,.25); }
  .score-badge { font-size: .68rem; color: var(--muted); }
  .score-badge strong { color: var(--accent2); }

  .video-status { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .vs-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); }
  .vs-dot.filled { background: var(--accent); }
  .vs-count { font-size: .72rem; color: var(--dim); }
  .chevron { color: var(--dim); font-size: 12px; transition: transform .2s; flex-shrink: 0; }
  .item-card.open .chevron { transform: rotate(180deg); }

  /* Video form */
  .video-form { border-top: 1px solid var(--border); padding: 18px; display: none;
                flex-direction: column; gap: 12px; background: rgba(0,0,0,.15); }
  .item-card.open .video-form { display: flex; }

  .video-slot { background: var(--card); border: 1px solid var(--border);
                border-radius: 10px; padding: 14px; display: flex;
                flex-direction: column; gap: 10px; }
  .slot-header { display: flex; align-items: center; gap: 8px; }
  .slot-num { font-size: .65rem; font-weight: 800; color: var(--dim);
              text-transform: uppercase; letter-spacing: .07em; }
  .clear-slot { margin-left: auto; background: none; border: none; color: var(--dim);
                cursor: pointer; font-size: .72rem; padding: 2px 6px;
                border-radius: 4px; transition: color .15s; }
  .clear-slot:hover { color: var(--danger); }

  .slot-inputs { display: grid; grid-template-columns: 140px 1fr; gap: 8px; }
  @media(max-width:600px) { .slot-inputs { grid-template-columns: 1fr; } }

  .platform-select { background: var(--bg); border: 1px solid var(--border);
                     color: var(--text); border-radius: 7px; padding: 8px 10px;
                     font-size: .82rem; cursor: pointer; }
  .platform-select:focus { outline: none; border-color: var(--accent); }

  .url-input, .title-input {
    background: var(--bg); border: 1px solid var(--border); color: var(--text);
    border-radius: 7px; padding: 8px 12px; font-size: .82rem; width: 100%;
    transition: border-color .15s;
  }
  .url-input:focus, .title-input:focus { outline: none; border-color: var(--accent); }
  .url-input::placeholder, .title-input::placeholder { color: var(--dim); }
  .url-input.valid { border-color: var(--accent); }
  .url-input.invalid { border-color: var(--danger); }

  .url-row { display: flex; gap: 8px; }
  .url-row .url-input { flex: 1; }
  .open-link { background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.2);
               color: var(--accent); border-radius: 7px; padding: 8px 12px;
               font-size: .8rem; cursor: pointer; white-space: nowrap;
               text-decoration: none; display: flex; align-items: center; gap: 4px;
               flex-shrink: 0; transition: background .15s; }
  .open-link:hover { background: rgba(16,185,129,.2); }
  .open-link.hidden { visibility: hidden; }

  /* Platform color dots */
  .plat-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .plat-tiktok { background: var(--tiktok); }
  .plat-youtube { background: var(--youtube); }
  .plat-instagram { background: var(--instagram); }
  .plat-x { background: var(--x); }

  /* Toast */
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px);
           background: var(--card); border: 1px solid rgba(16,185,129,.4); border-radius: 20px;
           padding: 10px 22px; font-size: .85rem; color: var(--accent2); font-weight: 600;
           z-index: 9999; transition: transform .3s ease; white-space: nowrap;
           box-shadow: 0 4px 24px rgba(0,0,0,.4); }
  .toast.show { transform: translateX(-50%) translateY(0); }
  .toast.error { border-color: rgba(239,68,68,.4); color: #fca5a5; }

  /* Loading */
  .loading { text-align: center; padding: 60px; color: var(--dim); font-size: .9rem; }
</style>
</head>
<body>

<header class="header">
  <div class="header-inner">
    <div class="brand">
      <div class="brand-icon">📋</div>
      <div>
        <h1>Video Link Dashboard</h1>
        <span>Research Team · Internal</span>
      </div>
    </div>
    <div id="week-badge" class="week-badge">Loading...</div>
    <button class="save-all-btn" id="save-btn" onclick="saveAll()">
      <span>💾</span> Save All Links
    </button>
  </div>
</header>

<main class="main">
  <div id="stats" class="stats"></div>
  <div id="content" class="loading">Loading this week's trends...</div>
</main>

<div class="toast" id="toast"></div>

<script>
  let allItems = [];
  const PLATFORMS = ['tiktok','youtube','instagram','x'];
  const PLAT_LABELS = { tiktok:'TikTok', youtube:'YouTube', instagram:'Instagram', x:'X' };

  // ── Load ─────────────────────────────────────────────────
  async function load() {
    const res = await fetch('/api/items');
    const data = await res.json();
    allItems = data.items || [];
    document.getElementById('week-badge').textContent = data.meta?.weekLabel || '';
    renderStats();
    renderItems();
  }

  // ── Stats ─────────────────────────────────────────────────
  function renderStats() {
    const total = allItems.length;
    const withVideos = allItems.filter(i => i.videos && i.videos.filter(v=>v.url).length > 0).length;
    const done = withVideos === total;
    document.getElementById('stats').innerHTML = \`
      <div class="stat"><div class="stat-num">\${total}</div><div class="stat-label">Total Trends</div></div>
      <div class="stat"><div class="stat-num" style="color:#60a5fa">\${allItems.filter(i=>i.category==='kitchen').length}</div><div class="stat-label">Kitchen</div></div>
      <div class="stat"><div class="stat-num" style="color:#fbbf24">\${allItems.filter(i=>i.category==='bakery').length}</div><div class="stat-label">Bakery</div></div>
      <div class="stat"><div class="stat-num" style="color:#c084fc">\${allItems.filter(i=>i.category==='grocery').length}</div><div class="stat-label">Grocery</div></div>
      <div class="stat progress-stat \${done?'done':''}">
        <div class="stat-num">\${withVideos}/\${total}</div>
        <div class="stat-label">Videos Added</div>
      </div>\`;
  }

  // ── Render all items ──────────────────────────────────────
  function renderItems() {
    const categories = [
      { id: 'kitchen', label: '🍽  Kitchen Dishes' },
      { id: 'bakery',  label: '🥐  Bakery' },
      { id: 'grocery', label: '🛒  Grocery Items' }
    ];
    let html = '';
    categories.forEach(cat => {
      const items = allItems.filter(i => i.category === cat.id);
      if (!items.length) return;
      html += \`<div class="section-title">\${cat.label}</div>\`;
      items.forEach((item, idx) => {
        html += renderCard(item, idx + 1);
      });
    });
    document.getElementById('content').innerHTML = html;
  }

  // ── Render single card ────────────────────────────────────
  function renderCard(item, rank) {
    const videos = (item.videos || []).concat([{},{},{}]).slice(0,3);
    const filledCount = videos.filter(v=>v.url).length;
    const dots = [0,1,2].map(i =>
      \`<div class="vs-dot \${i < filledCount ? 'filled' : ''}"></div>\`
    ).join('');
    const hasVideos = filledCount > 0;

    return \`
    <div class="item-card \${hasVideos?'has-videos':''}" id="card-\${item.id}">
      <div class="item-header" onclick="toggleCard('\${item.id}')">
        <div class="item-rank">\${rank}</div>
        <div class="item-info">
          <div class="item-name">\${esc(item.name)}</div>
          <div class="item-meta">
            <span class="cat-badge cat-\${item.category}">\${item.category}</span>
            <span class="score-badge">Viral score <strong>\${item.viralScore}</strong></span>
          </div>
        </div>
        <div class="video-status">
          \${dots}
          <span class="vs-count">\${filledCount}/3 videos</span>
        </div>
        <span class="chevron">▼</span>
      </div>
      <div class="video-form" id="form-\${item.id}">
        \${[0,1,2].map(i => renderSlot(item.id, i, videos[i])).join('')}
      </div>
    </div>\`;
  }

  // ── Render video slot ─────────────────────────────────────
  function renderSlot(itemId, slotIdx, video) {
    const platform = video?.platform || 'tiktok';
    const title    = esc(video?.title || '');
    const url      = esc(video?.url || '');
    const hasUrl   = !!video?.url;
    const urlClass = hasUrl ? 'valid' : '';

    const platformOpts = PLATFORMS.map(p =>
      \`<option value="\${p}" \${p===platform?'selected':''}>\${PLAT_LABELS[p]}</option>\`
    ).join('');

    return \`
    <div class="video-slot" id="slot-\${itemId}-\${slotIdx}">
      <div class="slot-header">
        <span class="slot-num">Video \${slotIdx+1}</span>
        <button class="clear-slot" onclick="clearSlot('\${itemId}',\${slotIdx})">✕ Clear</button>
      </div>
      <div class="slot-inputs">
        <select class="platform-select" id="plat-\${itemId}-\${slotIdx}" onchange="onPlatformChange('\${itemId}',\${slotIdx})">
          \${platformOpts}
        </select>
        <input class="title-input" id="title-\${itemId}-\${slotIdx}"
               placeholder="Video title (paste from platform)"
               value="\${title}" />
      </div>
      <div class="url-row">
        <input class="url-input \${urlClass}" id="url-\${itemId}-\${slotIdx}"
               placeholder="Paste video URL here — TikTok, YouTube, Instagram or X"
               value="\${url}"
               oninput="onUrlInput('\${itemId}',\${slotIdx})" />
        <a class="open-link \${hasUrl?'':'hidden'}" id="link-\${itemId}-\${slotIdx}"
           href="\${url}" target="_blank" rel="noopener">↗ Open</a>
      </div>
    </div>\`;
  }

  // ── Toggle card open/close ────────────────────────────────
  function toggleCard(id) {
    const card = document.getElementById('card-' + id);
    card.classList.toggle('open');
  }

  // ── URL input handler ─────────────────────────────────────
  function onUrlInput(itemId, slotIdx) {
    const urlEl   = document.getElementById('url-' + itemId + '-' + slotIdx);
    const linkEl  = document.getElementById('link-' + itemId + '-' + slotIdx);
    const url = urlEl.value.trim();
    const valid = url === '' || url.startsWith('http');
    urlEl.className = 'url-input ' + (url ? (valid ? 'valid' : 'invalid') : '');
    if (linkEl) {
      linkEl.href = url;
      linkEl.classList.toggle('hidden', !url || !valid);
    }
    // Auto-detect platform from URL
    if (url) {
      const platEl = document.getElementById('plat-' + itemId + '-' + slotIdx);
      if (url.includes('tiktok.com'))     platEl.value = 'tiktok';
      if (url.includes('youtube.com') || url.includes('youtu.be')) platEl.value = 'youtube';
      if (url.includes('instagram.com')) platEl.value = 'instagram';
      if (url.includes('twitter.com') || url.includes('x.com')) platEl.value = 'x';
    }
  }

  function onPlatformChange(itemId, slotIdx) {}

  // ── Clear a slot ──────────────────────────────────────────
  function clearSlot(itemId, slotIdx) {
    document.getElementById('url-'   + itemId + '-' + slotIdx).value = '';
    document.getElementById('title-' + itemId + '-' + slotIdx).value = '';
    document.getElementById('plat-'  + itemId + '-' + slotIdx).value = 'tiktok';
    const urlEl  = document.getElementById('url-'  + itemId + '-' + slotIdx);
    const linkEl = document.getElementById('link-' + itemId + '-' + slotIdx);
    urlEl.className = 'url-input';
    if (linkEl) linkEl.classList.add('hidden');
  }

  // ── Collect all values ────────────────────────────────────
  function collectUpdates() {
    return allItems.map(item => {
      const videos = [0,1,2].map(i => {
        const url   = (document.getElementById('url-'   + item.id + '-' + i)?.value || '').trim();
        const title = (document.getElementById('title-' + item.id + '-' + i)?.value || '').trim();
        const plat  = document.getElementById('plat-'  + item.id + '-' + i)?.value || 'tiktok';
        if (!url) return null;
        return { platform: plat, title: title || url, url };
      }).filter(Boolean);
      return { id: item.id, videos };
    });
  }

  // ── Save all ──────────────────────────────────────────────
  async function saveAll() {
    const btn = document.getElementById('save-btn');
    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> Saving...';
    try {
      const updates = collectUpdates();
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      // Reload fresh data and re-render stats
      const reload = await fetch('/api/items');
      const fresh  = await reload.json();
      allItems = fresh.items || [];
      renderStats();
      // Update card borders without full re-render
      allItems.forEach(item => {
        const card = document.getElementById('card-' + item.id);
        if (card) card.classList.toggle('has-videos', item.videos?.length > 0);
      });
      showToast('✓  Video links saved — app updated!');
    } catch (err) {
      showToast('❌  Save failed: ' + err.message, true);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>💾</span> Save All Links';
    }
  }

  // ── Toast ─────────────────────────────────────────────────
  function showToast(msg, isError = false) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast' + (isError ? ' error' : '');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  load();
</script>
</body>
</html>`);
});

// ── Start server ──────────────────────────────────────────
const PORT = 4000;
createServer(app).listen(PORT, () => {
  console.log('\n📋  RESEARCH TEAM DASHBOARD');
  console.log('━'.repeat(40));
  console.log(`🌐  Open: http://localhost:${PORT}`);
  console.log('📝  Add video links — no code needed');
  console.log('💾  Hit "Save All Links" when done');
  console.log('━'.repeat(40));
  console.log('    Press Ctrl+C to stop\n');
});
