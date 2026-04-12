// ============================================================
//  WHATS TRENDING — App Logic
//  No framework dependencies. Pure vanilla JS.
// ============================================================

(function () {
  'use strict';

  // ── Static config (categories & platforms stay local) ────
  const CATEGORIES = [
    { id: 'all',     label: 'All Trends',     icon: '🔥' },
    { id: 'kitchen', label: 'Kitchen Dishes', icon: '🍽' },
    { id: 'bakery',  label: 'Bakery',         icon: '🥐' },
    { id: 'grocery', label: 'Grocery Items',  icon: '🛒' }
  ];

  const PLATFORMS = {
    tiktok:    { label: 'TikTok',    color: '#ff0050', icon: '🎵' },
    youtube:   { label: 'YouTube',   color: '#ff0000', icon: '▶'  },
    instagram: { label: 'Instagram', color: '#e1306c', icon: '📸' },
    x:         { label: 'X',         color: '#1d9bf0', icon: '𝕏'  }
  };

  // ── State ─────────────────────────────────────────────────
  let currentCategory = 'all';
  let currentSort     = 'viral';
  let activeModal     = null;
  let deferredInstall = null;
  let trendItems      = [];   // loaded from Supabase
  let archiveWeeks    = [];   // loaded from Supabase

  // ── DOM refs ──────────────────────────────────────────────
  const cardsGrid     = document.getElementById('cards-grid');
  const filterBar     = document.getElementById('filter-buttons');
  const sortSelect    = document.getElementById('sort-select');
  const itemCountEl   = document.getElementById('item-count');
  const modalOverlay  = document.getElementById('modal-overlay');
  const modalContent  = document.getElementById('modal-content');
  const archiveGrid   = document.getElementById('archive-grid');
  const weekLabelEl   = document.getElementById('week-label');
  const nextUpdateEl  = document.getElementById('next-update');
  const statTotalEl   = document.getElementById('stat-total');
  const statKitchenEl = document.getElementById('stat-kitchen');
  const statBakeryEl  = document.getElementById('stat-bakery');
  const statGroceryEl = document.getElementById('stat-grocery');
  const installBanner = document.getElementById('install-banner');
  const installBtn    = document.getElementById('btn-install');
  const dismissBtn    = document.getElementById('btn-dismiss');
  const searchInput   = document.getElementById('search-input');

  // ── Map Supabase row → app item ───────────────────────────
  function mapItem(row) {
    return {
      id:               row.id,
      category:         row.category,
      name:             row.name,
      tagline:          row.tagline || '',
      viralScore:       row.viral_score,
      trend:            row.trend,
      platforms:        row.platforms || [],
      hashtags:         row.hashtags  || [],
      description:      row.description || '',
      keyIngredients:   row.key_ingredients || [],
      difficulty:       row.difficulty,
      prepTime:         row.prep_time || 'N/A',
      servings:         row.servings  || 'N/A',
      supermarketAngle: row.supermarket_angle || '',
      storeSection:     row.store_section || [],
      estimatedCost:    row.estimated_cost || '',
      weeklyMentions:   row.weekly_mentions,
      addedWeek:        row.added_week,
      videos:           row.videos || []
    };
  }

  // ── Boot: fetch data then render ─────────────────────────
  async function boot() {
    showLoading();

    try {
      const db = window._supabase;

      const [metaRes, itemsRes, archiveRes] = await Promise.all([
        db.from('meta').select('*').order('id', { ascending: false }).limit(1).single(),
        db.from('trending_items').select('*').order('viral_score', { ascending: false }),
        db.from('archive').select('*').order('id', { ascending: false })
      ]);

      if (metaRes.error)    throw metaRes.error;
      if (itemsRes.error)   throw itemsRes.error;
      if (archiveRes.error) throw archiveRes.error;

      const meta   = metaRes.data;
      trendItems   = (itemsRes.data || []).map(mapItem);
      archiveWeeks = archiveRes.data || [];

      hideLoading();
      populateMeta(meta);
      buildFilters();
      renderCards();
      renderRankings(meta.week_number, meta.year);
      setupRankingsPeriodSelector(meta.week_number, meta.year);
      renderArchive();
      setupEventListeners();
      registerServiceWorker();
      applyURLParams();

    } catch (err) {
      console.error('Supabase fetch failed:', err);
      showError('Could not load trends. Please check your connection and try again.');
    }
  }

  // ── Loading / error states ────────────────────────────────
  function showLoading() {
    if (cardsGrid) cardsGrid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">⏳</div>
        <p>Loading this week's trends…</p>
      </div>`;
    if (weekLabelEl) weekLabelEl.textContent = 'Loading…';
  }

  function hideLoading() {
    // cleared when renderCards() runs
  }

  function showError(msg) {
    if (cardsGrid) cardsGrid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">⚠️</div>
        <p>${escHtml(msg)}</p>
      </div>`;
  }

  // ── Meta ──────────────────────────────────────────────────
  function populateMeta(meta) {
    if (weekLabelEl)  weekLabelEl.textContent  = meta.week_label || '';
    if (nextUpdateEl) nextUpdateEl.textContent = meta.next_update ? 'Next: ' + formatDate(meta.next_update) : '';

    const kitchenCount = trendItems.filter(i => i.category === 'kitchen').length;
    const bakeryCount  = trendItems.filter(i => i.category === 'bakery').length;
    const groceryCount = trendItems.filter(i => i.category === 'grocery').length;

    if (statTotalEl)   statTotalEl.textContent   = trendItems.length;
    if (statKitchenEl) statKitchenEl.textContent = kitchenCount;
    if (statBakeryEl)  statBakeryEl.textContent  = bakeryCount;
    if (statGroceryEl) statGroceryEl.textContent = groceryCount;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // ── Filters ───────────────────────────────────────────────
  function buildFilters() {
    if (!filterBar) return;
    filterBar.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat.id === 'all' ? ' active' : '');
      btn.dataset.cat = cat.id;
      btn.innerHTML = `<span>${cat.icon}</span> ${cat.label}`;
      btn.addEventListener('click', () => {
        currentCategory = cat.id;
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCards();
      });
      filterBar.appendChild(btn);
    });
  }

  // ── Sorting ───────────────────────────────────────────────
  function getSortedItems(items) {
    const sorted = [...items];
    switch (currentSort) {
      case 'viral':          return sorted.sort((a, b) => b.viralScore - a.viralScore);
      case 'mentions':       return sorted.sort((a, b) => b.weeklyMentions - a.weeklyMentions);
      case 'difficulty-asc': return sorted.sort((a, b) => a.difficulty - b.difficulty);
      case 'difficulty-desc':return sorted.sort((a, b) => b.difficulty - a.difficulty);
      case 'name':           return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':         return sorted.sort((a, b) => b.addedWeek - a.addedWeek);
      default:               return sorted;
    }
  }

  // ── Search ────────────────────────────────────────────────
  function getSearchTerm() {
    return searchInput ? searchInput.value.trim().toLowerCase() : '';
  }

  function matchesSearch(item, term) {
    if (!term) return true;
    return (
      item.name.toLowerCase().includes(term) ||
      item.tagline.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.keyIngredients.some(i => i.toLowerCase().includes(term)) ||
      (item.hashtags && item.hashtags.some(h => h.toLowerCase().includes(term)))
    );
  }

  // ── Render Cards ──────────────────────────────────────────
  function renderCards() {
    if (!cardsGrid) return;

    const searchTerm = getSearchTerm();
    let items = trendItems;
    if (currentCategory !== 'all') items = items.filter(i => i.category === currentCategory);
    if (searchTerm) items = items.filter(i => matchesSearch(i, searchTerm));
    items = getSortedItems(items);

    if (itemCountEl) itemCountEl.textContent = items.length + ' items';

    if (items.length === 0) {
      cardsGrid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">🔍</div>
          <p>No trends found for this filter. Try a different category or search.</p>
        </div>`;
      return;
    }

    cardsGrid.innerHTML = '';
    items.forEach(item => cardsGrid.appendChild(buildCard(item)));
  }

  // ── Build Card ────────────────────────────────────────────
  function buildCard(item) {
    const card = document.createElement('div');
    card.className = 'trend-card';
    card.dataset.id = item.id;

    const scoreClass    = item.viralScore >= 90 ? 'score-high' : item.viralScore >= 70 ? 'score-mid' : 'score-low';
    const scoreWidth    = item.viralScore + '%';
    const trendClass    = 'trend-' + item.trend;
    const trendIcon     = item.trend === 'rising' ? '↑' : item.trend === 'steady' ? '→' : '↓';
    const catBadgeClass = 'badge-' + item.category;
    const catLabel      = CATEGORIES.find(c => c.id === item.category)?.label || item.category;
    const numClass      = item.viralScore >= 90 ? 'score-90plus' : item.viralScore >= 70 ? 'score-70plus' : 'score-below';
    const previewIngredients = item.keyIngredients.slice(0, 5);

    card.innerHTML = `
      <div class="card-score-bar ${scoreClass}" style="--score-width:${scoreWidth}"></div>
      <div class="card-header">
        <span class="card-category-badge ${catBadgeClass}">${catLabel}</span>
        <span class="card-trend-indicator ${trendClass}">${trendIcon} ${capitalize(item.trend)}</span>
      </div>
      <div class="card-body">
        <div>
          <div class="card-name">${escHtml(item.name)}</div>
          <div class="card-tagline">${escHtml(item.tagline)}</div>
        </div>
        <div class="card-score-row">
          <div class="viral-score-display">
            <div class="viral-score-num ${numClass}">${item.viralScore}</div>
            <div class="viral-score-label">Viral<br>Score</div>
          </div>
          <div class="mentions-badge">
            <strong>${formatMentions(item.weeklyMentions)}</strong> weekly mentions
          </div>
        </div>
        <div class="platform-row">
          ${item.platforms.map(p => `<span class="platform-badge platform-${p}">${PLATFORMS[p]?.label || p}</span>`).join('')}
        </div>
        <div class="card-description">${escHtml(item.description)}</div>
        <div class="ingredients-section">
          <div class="ingredients-label">Key Ingredients</div>
          <div class="ingredients-list">
            ${previewIngredients.map(ing => `<span class="ingredient-tag">${escHtml(ing)}</span>`).join('')}
            ${item.keyIngredients.length > 5 ? `<span class="ingredient-tag">+${item.keyIngredients.length - 5} more</span>` : ''}
          </div>
        </div>
        <div class="supermarket-angle">
          <div class="supermarket-angle-label">Store Opportunity</div>
          ${escHtml(item.supermarketAngle)}
        </div>
        <div class="card-meta-row">
          <div class="meta-item">
            <span>⏱</span>
            <span>${escHtml(item.prepTime)}</span>
          </div>
          <div class="meta-item">
            <span>Difficulty</span>
            <div class="difficulty-dots">${buildDots(item.difficulty, 3)}</div>
          </div>
          <div class="cost-badge">${escHtml(item.estimatedCost)}</div>
        </div>
        <div>
          <div class="ingredients-label" style="margin-bottom:5px">Store Sections</div>
          <div class="store-sections">
            ${item.storeSection.map(s => `<span class="store-tag">${escHtml(s)}</span>`).join('')}
          </div>
        </div>

        ${item.videos && item.videos.length > 0 ? `
        <div class="card-videos">
          <div class="ingredients-label" style="margin-bottom:6px">📹 Videos</div>
          <div class="card-video-row">
            ${item.videos.slice(0, 3).map(v => buildCardVideoChip(v)).join('')}
          </div>
        </div>` : ''}

      </div>`;

    card.addEventListener('click', () => openModal(item));

    // Video links open URL directly without triggering modal
    card.querySelectorAll('.card-video-chip').forEach(el => {
      el.addEventListener('click', e => e.stopPropagation());
    });

    return card;
  }

  // ── Modal ─────────────────────────────────────────────────
  function openModal(item) {
    activeModal = item;
    const catLabel      = CATEGORIES.find(c => c.id === item.category)?.label || item.category;
    const catBadgeClass = 'badge-' + item.category;
    const numClass      = item.viralScore >= 90 ? 'score-90plus' : item.viralScore >= 70 ? 'score-70plus' : 'score-below';
    const trendIcon     = item.trend === 'rising' ? '↑' : item.trend === 'steady' ? '→' : '↓';
    const trendClass    = 'trend-' + item.trend;

    modalContent.innerHTML = `
      <div class="modal-header">
        <div>
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">
            <span class="card-category-badge ${catBadgeClass}">${catLabel}</span>
            <span class="card-trend-indicator ${trendClass}" style="font-size:0.78rem">${trendIcon} ${capitalize(item.trend)}</span>
          </div>
          <div class="modal-title">${escHtml(item.name)}</div>
          <div class="modal-tagline">${escHtml(item.tagline)}</div>
        </div>
        <button class="modal-close" id="modal-close-btn" aria-label="Close">×</button>
      </div>
      <div class="modal-body">

        <div>
          <div class="modal-section-title">Viral Performance</div>
          <div class="card-score-row">
            <div class="viral-score-display">
              <div class="viral-score-num ${numClass}">${item.viralScore}</div>
              <div class="viral-score-label">Viral<br>Score</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;text-align:right">
              <div class="mentions-badge" style="justify-content:flex-end">
                <strong>${formatMentions(item.weeklyMentions)}</strong> mentions this week
              </div>
              <div class="platform-row" style="justify-content:flex-end">
                ${item.platforms.map(p => `<span class="platform-badge platform-${p}">${PLATFORMS[p]?.label || p}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>

        ${item.hashtags && item.hashtags.length ? `
        <div>
          <div class="modal-section-title">Trending Hashtags</div>
          <div class="hashtags-list">
            ${item.hashtags.map(h => `<span class="hashtag">${escHtml(h)}</span>`).join('')}
          </div>
        </div>` : ''}

        <div>
          <div class="modal-section-title">About This Trend</div>
          <p style="font-size:0.87rem;color:var(--text-secondary);line-height:1.6">${escHtml(item.description)}</p>
        </div>

        <div>
          <div class="modal-section-title">All Ingredients Needed</div>
          <div class="full-ingredients">
            ${item.keyIngredients.map(ing => `<div class="full-ingredient">${escHtml(ing)}</div>`).join('')}
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          <div class="stat-box">
            <div class="stat-num" style="font-size:1.1rem">${escHtml(item.prepTime)}</div>
            <div class="stat-label">Prep Time</div>
          </div>
          <div class="stat-box">
            <div class="stat-num" style="font-size:1.1rem">${buildDots(item.difficulty, 3, true)}</div>
            <div class="stat-label">Difficulty ${item.difficulty}/3</div>
          </div>
          <div class="stat-box">
            <div class="stat-num" style="font-size:1rem">${escHtml(item.estimatedCost)}</div>
            <div class="stat-label">Est. Cost</div>
          </div>
        </div>

        <div>
          <div class="modal-section-title">Supermarket Opportunity</div>
          <div class="modal-supermarket-angle">
            <p>${escHtml(item.supermarketAngle)}</p>
          </div>
        </div>

        <div>
          <div class="modal-section-title">Relevant Store Sections</div>
          <div class="store-sections">
            ${item.storeSection.map(s => `<span class="store-tag">${escHtml(s)}</span>`).join('')}
          </div>
        </div>

        ${item.videos && item.videos.length > 0 ? `
        <div>
          <div class="modal-section-title">Top Videos This Week</div>
          <div class="video-links-list">
            ${item.videos.slice(0, 3).map(v => buildVideoCard(v)).join('')}
          </div>
        </div>` : `
        <div class="video-links-empty">
          <span>📋</span> No videos added yet — admins can add up to 3 video links via the Admin panel.
        </div>`}

        <div style="font-size:0.8rem;color:var(--text-muted)">
          Serves: <strong style="color:var(--text-secondary)">${escHtml(item.servings)}</strong>
          &nbsp;·&nbsp; Added in Week ${item.addedWeek}
        </div>

      </div>`;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    activeModal = null;
  }

  // ── Rankings ──────────────────────────────────────────────
  let currentPeriod = 'month';

  function getQuarter(weekNum) { return Math.ceil(weekNum / 13); }
  function getMonth(weekNum)   { return Math.ceil(weekNum / 4.33); }

  function getWeeksForPeriod(period, currentWeek, currentYear) {
    return archiveWeeks.filter(w => {
      if (w.year !== currentYear) return period === 'year' ? false : false;
      if (period === 'year')    return w.year === currentYear;
      if (period === 'quarter') return getQuarter(w.week_number) === getQuarter(currentWeek);
      if (period === 'month')   return getMonth(w.week_number)   === getMonth(currentWeek);
      return false;
    });
  }

  function renderRankings(currentWeek, currentYear) {
    const grid = document.getElementById('rankings-grid');
    if (!grid) return;

    const weeks = getWeeksForPeriod(currentPeriod, currentWeek, currentYear);

    // Count how many weeks each item name appears
    const counts = {};
    weeks.forEach(w => {
      const items = Array.isArray(w.items) ? w.items : [];
      items.forEach(name => {
        counts[name] = (counts[name] || 0) + 1;
      });
    });

    const ranked = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    if (ranked.length === 0) {
      grid.innerHTML = '<p class="rankings-empty">No archive data for this period yet.</p>';
      return;
    }

    const maxCount = ranked[0][1];
    const periodLabels = { month: 'this month', quarter: 'this quarter', year: 'this year' };

    grid.innerHTML = `<div class="rankings-grid">
      ${ranked.map(([name, count], i) => {
        const pos = i + 1;
        const posClass = pos === 1 ? 'pos-1' : pos === 2 ? 'pos-2' : pos === 3 ? 'pos-3' : 'pos-other';
        const barWidth = Math.round((count / maxCount) * 100);
        const weekWord = count === 1 ? 'week' : 'weeks';
        return `
          <div class="ranking-card">
            <div class="ranking-position ${posClass}">${pos <= 3 ? ['🥇','🥈','🥉'][pos-1] : pos}</div>
            <div class="ranking-info">
              <div class="ranking-name">${escHtml(name)}</div>
              <div class="ranking-weeks">Trended ${count} ${weekWord} ${periodLabels[currentPeriod]}</div>
            </div>
            <div class="ranking-bar-wrap">
              <div class="ranking-bar" style="width:${barWidth}%"></div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
  }

  function setupRankingsPeriodSelector(currentWeek, currentYear) {
    const selector = document.getElementById('rankings-period-selector');
    if (!selector) return;
    selector.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selector.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.dataset.period;
        renderRankings(currentWeek, currentYear);
      });
    });
  }

  // ── Compact video chip for cards ─────────────────────────
  function buildCardVideoChip(v) {
    const p    = PLATFORM_COLORS[v.platform] || { bg: '#1f2937', border: '#374151', label: v.platform };
    const ytId = v.platform === 'youtube' ? getYouTubeId(v.url) : null;
    const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;

    if (thumb) {
      return `
        <a href="${escHtml(v.url)}" target="_blank" rel="noopener noreferrer" class="card-video-chip"
           style="display:block;border-radius:6px;overflow:hidden;border:1px solid ${p.border};flex-shrink:0;width:100px;text-decoration:none">
          <img src="${thumb}" alt="${escHtml(v.title || '')}"
               style="width:100%;height:56px;object-fit:cover;display:block"
               onerror="this.parentElement.innerHTML='<div style=\'background:${p.bg};height:56px;display:flex;align-items:center;justify-content:center;font-size:1.4rem\'>${getPlatformIcon(v.platform)}</div>'">
          <div style="padding:3px 5px;background:${p.bg};font-size:0.65rem;color:#d1d5db;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            ${escHtml(v.title || 'Watch')}
          </div>
        </a>`;
    }

    return `
      <a href="${escHtml(v.url)}" target="_blank" rel="noopener noreferrer" class="card-video-chip"
         style="display:flex;align-items:center;gap:5px;padding:5px 8px;border-radius:6px;border:1px solid ${p.border};background:${p.bg};text-decoration:none;flex-shrink:0;max-width:140px">
        <span style="font-size:1rem;flex-shrink:0">${getPlatformIcon(v.platform)}</span>
        <span style="font-size:0.7rem;color:#d1d5db;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(v.title || p.label)}</span>
      </a>`;
  }

  // ── Archive ───────────────────────────────────────────────
  function renderArchive() {
    if (!archiveGrid || !archiveWeeks.length) return;
    archiveGrid.innerHTML = '';
    archiveWeeks.forEach(week => {
      const items = Array.isArray(week.items) ? week.items : [];
      const card = document.createElement('div');
      card.className = 'archive-card';
      card.innerHTML = `
        <div class="archive-week">${escHtml(week.week_label)}</div>
        <div class="archive-items">
          ${items.map(item => `<div class="archive-item-row">${escHtml(item)}</div>`).join('')}
        </div>`;
      archiveGrid.appendChild(card);
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  function buildDots(filled, total, inline = false) {
    if (inline) {
      return Array.from({ length: total }, (_, i) =>
        `<span style="color:${i < filled ? 'var(--accent)' : 'var(--border)'}">●</span>`
      ).join(' ');
    }
    let html = '';
    for (let i = 0; i < total; i++) {
      html += `<div class="dot${i < filled ? ' filled' : ''}"></div>`;
    }
    return html;
  }

  function formatMentions(num) {
    if (!num) return '—';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000)     return (num / 1_000).toFixed(0) + 'K';
    return num.toString();
  }

  function getPlatformIcon(platform) {
    const icons = { tiktok: '🎵', youtube: '▶', instagram: '📸', x: '𝕏' };
    return icons[platform] || '🔗';
  }

  // ── Video card with thumbnail ─────────────────────────────
  function getYouTubeId(url) {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return m ? m[1] : null;
  }

  const PLATFORM_COLORS = {
    tiktok:    { bg: '#1a0a0f', border: '#ff0050', label: 'TikTok' },
    youtube:   { bg: '#1a0a0a', border: '#ff0000', label: 'YouTube' },
    instagram: { bg: '#1a0a14', border: '#e1306c', label: 'Instagram' },
    x:         { bg: '#0a0f1a', border: '#1d9bf0', label: 'X' }
  };

  function buildVideoCard(v) {
    const p      = PLATFORM_COLORS[v.platform] || { bg: '#1f2937', border: '#374151', label: v.platform };
    const ytId   = v.platform === 'youtube' ? getYouTubeId(v.url) : null;
    const thumb  = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;

    const thumbnailHtml = thumb
      ? `<img src="${thumb}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:8px 8px 0 0;" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:2rem\\'>${getPlatformIcon(v.platform)}</div>'">`
      : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:2.5rem">${getPlatformIcon(v.platform)}</div>`;

    return `
      <a href="${escHtml(v.url)}" target="_blank" rel="noopener noreferrer"
         style="display:block;text-decoration:none;border-radius:10px;overflow:hidden;border:1px solid ${p.border};background:${p.bg};transition:transform 0.15s;"
         onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
        <div style="height:140px;background:#111;overflow:hidden">${thumbnailHtml}</div>
        <div style="padding:10px 12px;display:flex;align-items:center;gap:8px">
          <span style="font-size:1.1rem">${getPlatformIcon(v.platform)}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.82rem;font-weight:600;color:#f1f5f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(v.title || 'Watch video')}</div>
            <div style="font-size:0.72rem;color:${p.border};margin-top:2px">${p.label}</div>
          </div>
          <span style="color:#6b7280;font-size:0.9rem">→</span>
        </div>
      </a>`;
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ── Event Listeners ───────────────────────────────────────
  function setupEventListeners() {
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        renderCards();
      });
    }

    if (searchInput) searchInput.addEventListener('input', debounce(renderCards, 200));

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    }

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && activeModal) closeModal(); });

    const printBtn = document.getElementById('btn-print');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstall = e;
      if (installBanner) installBanner.style.display = 'flex';
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredInstall) return;
        deferredInstall.prompt();
        const { outcome } = await deferredInstall.userChoice;
        if (outcome === 'accepted') showToast('App installed! ✓');
        deferredInstall = null;
        if (installBanner) installBanner.style.display = 'none';
      });
    }

    if (dismissBtn) dismissBtn.addEventListener('click', () => {
      if (installBanner) installBanner.style.display = 'none';
    });

    window.addEventListener('appinstalled', () => {
      showToast('Trending Eats installed successfully!');
      if (installBanner) installBanner.style.display = 'none';
    });
  }

  // ── Service Worker ────────────────────────────────────────
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }

  // ── Debounce ──────────────────────────────────────────────
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ── URL param filter ──────────────────────────────────────
  function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat && CATEGORIES.find(c => c.id === cat)) {
      currentCategory = cat;
      const btn = document.querySelector(`[data-cat="${cat}"]`);
      if (btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCards();
      }
    }
  }

  // ── Boot ──────────────────────────────────────────────────
  // Wait for auth script to set window._supabase, then fetch
  document.addEventListener('DOMContentLoaded', () => {
    const waitForDb = setInterval(() => {
      if (window._supabase) {
        clearInterval(waitForDb);
        boot();
      }
    }, 50);
  });

})();
