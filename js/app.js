// ============================================================================
//  app.js — Rendering + interaction logic
//  Depends on: data.js (STACK_DATA, CATEGORY_MAP)
// ============================================================================

/**
 * Build an item card DOM node from a data item.
 */
function makeCard(item, categoryKey) {
  const cat = CATEGORY_MAP[categoryKey] || 'tools';
  const card = document.createElement('div');
  card.className = `item-card cat-${cat}`;

  const searchText = (item.name + ' ' + item.tag + ' ' + item.desc + ' ' + (item.knows || []).join(' ')).toLowerCase();
  card.dataset.searchText = searchText;
  card.dataset.sourceKey = categoryKey;

  const level = item.level ?? 0;

  const knowsItems = (item.knows || []).map(k => `<li>${k}</li>`).join('');
  const knowsBlock = knowsItems
    ? `<div class="knows-label">What I know</div><ul class="knows-list">${knowsItems}</ul>`
    : '';

  const refresher = item.refresher || {};
  const concepts = (refresher.concepts || []).map(c => `<div class="refresh-concept">${c}</div>`).join('');
  const snippets = (refresher.snippets || []).map(s => `<div class="refresh-snippet">${s}</div>`).join('');
  const refreshBlock = (concepts || snippets)
    ? `<div class="refresh-label">Quick Refresher</div>${concepts}${snippets}`
    : '';

  if (item.mirror) card.classList.add('mirror');
  const mirrorBadge = item.mirror ? '<span class="mirror-badge">Mirror</span>' : '';
  const mirrorOf = item.mirrorOf ? `<div class="mirror-of">Mirrors ${item.mirrorOf}</div>` : '';

  card.innerHTML = `
    <div class="name">${item.name}${mirrorBadge}</div>
    <span class="tag">${item.tag}</span>
    ${mirrorOf}
    <div class="level-row">
      <div class="level-bar"><div class="level-fill" style="width:${level}%"></div></div>
      <span class="level-pct">${level}%</span>
    </div>
    <div class="desc">
      <div>${item.desc}</div>
      ${knowsBlock}
      ${refreshBlock}
    </div>
    <div class="expand-hint">Click to expand</div>
  `;
  card.addEventListener('click', () => card.classList.toggle('expanded'));
  return card;
}

/**
 * Populate a grid element with cards from a list of items.
 */
function fillGrid(gridId, items, categoryKey) {
  const el = document.getElementById(gridId);
  if (!el) return;
  items.forEach(item => el.appendChild(makeCard(item, categoryKey)));
}

/**
 * Sort primary items before mirror items.
 */
function sortWithMirrorsLast(items) {
  return [...items].sort((a, b) => (a.mirror ? 1 : 0) - (b.mirror ? 1 : 0));
}

/**
 * Count items across all categories matching a prefix.
 */
function countByPrefix(prefix) {
  return Object.keys(STACK_DATA)
    .filter(k => k === prefix || k.startsWith(prefix + '-'))
    .reduce((sum, k) => sum + STACK_DATA[k].length, 0);
}

/**
 * Average level across all items under a prefix.
 */
function avgLevel(prefix) {
  const items = Object.keys(STACK_DATA)
    .filter(k => k === prefix || k.startsWith(prefix + '-'))
    .flatMap(k => STACK_DATA[k]);
  if (!items.length) return 0;
  return Math.round(items.reduce((s, i) => s + (i.level || 0), 0) / items.length);
}

/**
 * View history stack — used by the Back button.
 * Each entry is a view id (e.g. 'dashboard', 'tools-db').
 */
const viewHistory = [];

/** Read the currently-active view id (e.g. 'dashboard') or null. */
function currentViewId() {
  const active = document.querySelector('.view.active');
  return active ? active.id.replace(/^view-/, '') : null;
}

/** Human-readable label for a view id — pulled from the matching nav button. */
function viewLabel(id) {
  const btn = document.querySelector(`.nav-btn[data-view="${id}"]`);
  return btn ? btn.textContent.trim() : id;
}

/**
 * Switch which view is active and highlight the matching nav button.
 * `pushHistory` defaults to true; pass false when navigating from the back
 * button or popstate so we don't recursively grow the stack.
 */
function showView(id, evt, pushHistory = true) {
  const fromId = currentViewId();

  if (pushHistory && fromId && fromId !== id) {
    viewHistory.push(fromId);
    try { history.pushState({ view: id }, '', '#' + id); } catch (_) {}
  }

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + id);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = (evt && evt.currentTarget) || document.querySelector(`.nav-btn[data-view="${id}"]`);
  if (btn) btn.classList.add('active');

  document.querySelector('main').scrollTop = 0;
  updateToolbar(id);
}

/**
 * Step back one view. Delegates to the browser's history so the URL and the
 * browser's back/forward buttons stay in sync — popstate handles the actual
 * view switch and the internal stack pop.
 */
function goBack() {
  if (!viewHistory.length) return;
  window.history.back();
}

/** Toggle back-button / breadcrumb visibility and labels. */
function updateToolbar(id) {
  const toolbar = document.getElementById('view-toolbar');
  const backBtn = document.getElementById('back-btn');
  const crumb   = document.getElementById('view-breadcrumb');
  const onHome  = id === 'dashboard';

  const showBack = viewHistory.length > 0;

  if (backBtn) backBtn.style.display = showBack ? 'inline-flex' : 'none';
  if (crumb)   crumb.textContent = onHome ? '' : viewLabel(id);

  // Collapse the toolbar when there's nothing to show (home + empty history)
  if (toolbar) toolbar.classList.toggle('is-empty', !showBack && onHome);
}

/**
 * Global search across all items — filters the Quick Search grid on the dashboard.
 */
function globalSearch(query) {
  const q = query.trim().toLowerCase();
  const results = document.getElementById('global-results');
  const empty = document.getElementById('global-empty');
  results.innerHTML = '';

  if (!q) {
    empty.classList.add('hidden');
    return;
  }

  let matches = 0;
  Object.keys(STACK_DATA).forEach(key => {
    STACK_DATA[key].forEach(item => {
      const text = (item.name + ' ' + item.tag + ' ' + item.desc).toLowerCase();
      if (text.includes(q)) {
        results.appendChild(makeCard(item, key));
        matches++;
      }
    });
  });

  empty.classList.toggle('hidden', matches > 0);
}

// ============================================================================
//  Initialization
// ============================================================================
function init() {
  // Populate all category grids (mirror items sort last where applicable)
  fillGrid('grid-tools-db', STACK_DATA['tools-db'], 'tools-db');
  fillGrid('grid-tools-saas', STACK_DATA['tools-saas'], 'tools-saas');
  fillGrid('grid-tools-api', STACK_DATA['tools-api'], 'tools-api');
  fillGrid('grid-tools-devops', STACK_DATA['tools-devops'], 'tools-devops');
  fillGrid('grid-tools-vcs', STACK_DATA['tools-vcs'], 'tools-vcs');
  fillGrid('grid-tools-editors', STACK_DATA['tools-editors'], 'tools-editors');
  fillGrid('grid-tools-ai', STACK_DATA['tools-ai'], 'tools-ai');
  fillGrid('grid-stack-lang', sortWithMirrorsLast(STACK_DATA['stack-lang']), 'stack-lang');
  fillGrid('grid-stack-fw', sortWithMirrorsLast(STACK_DATA['stack-fw']), 'stack-fw');
  fillGrid('grid-stack-db', STACK_DATA['stack-db'], 'stack-db');
  fillGrid('grid-stack-cache', STACK_DATA['stack-cache'], 'stack-cache');
  fillGrid('grid-stack-env', STACK_DATA['stack-env'], 'stack-env');
  fillGrid('grid-stack-quality', sortWithMirrorsLast(STACK_DATA['stack-quality']), 'stack-quality');
  fillGrid('grid-stack-cicd', STACK_DATA['stack-cicd'], 'stack-cicd');
  fillGrid('grid-design', STACK_DATA['design'], 'design');

  // Summary counts
  const countMirrors = Object.values(STACK_DATA).flat().filter(i => i && i.mirror).length;
  const counts = {
    tools: countByPrefix('tools'),
    stack: countByPrefix('stack'),
    design: STACK_DATA['design'].length,
  };

  document.getElementById('stat-tools').textContent = counts.tools;
  document.getElementById('stat-stack').textContent = counts.stack;
  document.getElementById('stat-design').textContent = counts.design;

  document.getElementById('footer-summary').innerHTML =
    `${counts.tools} tools &middot; ${counts.stack} stack (${countMirrors} mirror) &middot; ${counts.design} patterns`;

  // Average-knowledge bars
  const avgRows = [
    { label: 'Tools', avg: avgLevel('tools'), color: 'var(--accent-light)', bar: 'linear-gradient(90deg, var(--accent), var(--accent-light))' },
    { label: 'Tech Stack', avg: avgLevel('stack'), color: 'var(--cyan)', bar: 'linear-gradient(90deg, var(--cyan), #67e8f9)' },
    { label: 'System Design', avg: avgLevel('design'), color: 'var(--green)', bar: 'linear-gradient(90deg, var(--green), #86efac)' },
  ];
  document.getElementById('avg-rows').innerHTML = avgRows.map(r => `
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="min-width:120px;font-size:13px;color:var(--text-dim);font-weight:600;">${r.label}</div>
      <div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden;">
        <div style="height:100%;width:${r.avg}%;background:${r.bar};border-radius:4px;transition:width 0.6s;"></div>
      </div>
      <div style="min-width:44px;text-align:right;font-weight:700;color:${r.color};font-size:13px;">${r.avg}%</div>
    </div>
  `).join('');

  // Load Learning docs (Architecture Review / API Glossary / Python Integration)
  if (typeof initLearningDocs === 'function') initLearningDocs();

  // Wire nav buttons to showView handler
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const view = btn.dataset.view;
    if (view) {
      btn.addEventListener('click', (e) => showView(view, e));
    }
  });

  // Browser back/forward button integration — also handles our Back UI button
  // (goBack → history.back() → popstate fires here).
  window.addEventListener('popstate', (e) => {
    const id = (e.state && e.state.view) || 'dashboard';
    // If the user went backward, the top of our internal stack matches the
    // destination view — pop it so the Back button's visibility stays right.
    if (viewHistory.length && viewHistory[viewHistory.length - 1] === id) {
      viewHistory.pop();
    } else {
      // Forward navigation — track where we came from so Back still works.
      const from = currentViewId();
      if (from && from !== id) viewHistory.push(from);
    }
    showView(id, null, /* pushHistory */ false);
  });

  // Seed history state for the initial view so popstate has something to pop back to
  try { history.replaceState({ view: currentViewId() || 'dashboard' }, '', ''); } catch (_) {}

  // Initialize toolbar state
  updateToolbar(currentViewId() || 'dashboard');
}

document.addEventListener('DOMContentLoaded', init);
