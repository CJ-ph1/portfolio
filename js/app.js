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

function fillGrid(gridId, items, categoryKey) {
  const el = document.getElementById(gridId);
  if (!el) return;
  items.forEach(item => el.appendChild(makeCard(item, categoryKey)));
}

function sortWithMirrorsLast(items) {
  return [...items].sort((a, b) => (a.mirror ? 1 : 0) - (b.mirror ? 1 : 0));
}

const viewHistory = [];

function currentViewId() {
  const active = document.querySelector('.view.active');
  return active ? active.id.replace(/^view-/, '') : null;
}

// ============================================================================
//  Sub-nav (group → list of views) for the top navbar
// ============================================================================
const GROUP_TABS = {
  tools: [
    { id: 'tools-db',      label: 'Databases & Data' },
    { id: 'tools-api',     label: 'API & Testing' },
    { id: 'tools-devops',  label: 'DevOps & Infra' },
    { id: 'tools-vcs',     label: 'Version Control' },
    { id: 'tools-editors', label: 'Editors & Terminals' },
    { id: 'tools-ai',      label: 'AI Assistants' },
  ],
  stack: [
    { id: 'stack-lang',    label: 'Languages & Runtime' },
    { id: 'stack-fw',      label: 'Frameworks & ORM' },
    { id: 'stack-db',      label: 'Databases' },
    { id: 'stack-cache',   label: 'Caching' },
    { id: 'stack-env',     label: 'Environments' },
    { id: 'stack-quality', label: 'Code Quality' },
    { id: 'stack-cicd',    label: 'CI/CD' },
  ],
  notes: [
    { id: 'learning-architecture', label: 'Architecture Review' },
    { id: 'learning-glossary',     label: 'API Glossary' },
    { id: 'learning-python',       label: 'Python Integration' },
    { id: 'learning-full-flow',    label: 'Full Flow' },
    { id: 'learning-git-ssh',      label: 'Git & SSH' },
  ],
};

function groupOf(viewId) {
  for (const g of Object.keys(GROUP_TABS)) {
    if (GROUP_TABS[g].some(t => t.id === viewId)) return g;
  }
  return null;
}

function defaultViewForGroup(group) {
  return GROUP_TABS[group] && GROUP_TABS[group][0] && GROUP_TABS[group][0].id;
}

function renderSubNav(activeViewId) {
  const subNav = document.getElementById('sub-nav');
  const tabs   = document.getElementById('sub-nav-tabs');
  if (!subNav || !tabs) return;

  const group = groupOf(activeViewId);
  if (!group) {
    subNav.hidden = true;
    tabs.innerHTML = '';
    return;
  }
  subNav.hidden = false;
  tabs.innerHTML = GROUP_TABS[group].map(t => `
    <button class="sub-nav-tab${t.id === activeViewId ? ' active' : ''}" data-view="${t.id}">${t.label}</button>
  `).join('');
  tabs.querySelectorAll('.sub-nav-tab').forEach(btn => {
    btn.addEventListener('click', (e) => showView(btn.dataset.view, e));
  });
}

function syncTopNav(activeViewId) {
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  const direct = document.querySelector(`.nav-link[data-view="${activeViewId}"]`);
  if (direct) { direct.classList.add('active'); return; }
  const group = groupOf(activeViewId);
  if (group) {
    const groupBtn = document.querySelector(`.nav-link[data-group="${group}"]`);
    if (groupBtn) groupBtn.classList.add('active');
  }
}

function viewLabel(id) {
  for (const g of Object.keys(GROUP_TABS)) {
    const tab = GROUP_TABS[g].find(t => t.id === id);
    if (tab) return tab.label;
  }
  const direct = document.querySelector(`.nav-link[data-view="${id}"]`);
  return direct ? direct.textContent.trim() : id;
}

function showView(id, evt, pushHistory = true) {
  const fromId = currentViewId();

  if (pushHistory && fromId && fromId !== id) {
    viewHistory.push(fromId);
    try { history.pushState({ view: id }, '', '#' + id); } catch (_) {}
  }

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + id);
  if (target) target.classList.add('active');

  syncTopNav(id);
  renderSubNav(id);

  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateToolbar(id);
}

function goBack() {
  if (!viewHistory.length) return;
  window.history.back();
}

function updateToolbar(id) {
  const toolbar = document.getElementById('view-toolbar');
  const backBtn = document.getElementById('back-btn');
  const crumb   = document.getElementById('view-breadcrumb');
  const onHome  = id === 'dashboard';
  const showBack = viewHistory.length > 0;

  if (backBtn) backBtn.style.display = showBack ? 'inline-flex' : 'none';
  if (crumb)   crumb.textContent = onHome ? '' : viewLabel(id);
  if (toolbar) toolbar.classList.toggle('is-empty', !showBack && onHome);
}

// ============================================================================
//  Theme toggle (light / dark) — default dark, respect localStorage + system
// ============================================================================
const THEME_KEY = 'cjm-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function initTheme() {
  let theme;
  try { theme = localStorage.getItem(THEME_KEY); } catch (_) { theme = null; }
  if (!theme) {
    const prefersLight = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches;
    theme = prefersLight ? 'light' : 'dark';
  }
  applyTheme(theme);

  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
  });
}

// ============================================================================
//  Initialization
// ============================================================================
function init() {
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

  if (typeof initLearningDocs === 'function') initLearningDocs();

  document.querySelectorAll('.nav-link').forEach(btn => {
    const view = btn.dataset.view;
    const group = btn.dataset.group;
    if (view) {
      btn.addEventListener('click', (e) => showView(view, e));
    } else if (group) {
      btn.addEventListener('click', (e) => {
        const target = defaultViewForGroup(group);
        if (target) showView(target, e);
      });
    }
  });

  const brand = document.querySelector('.brand');
  if (brand) brand.addEventListener('click', (e) => showView('dashboard', e));

  syncTopNav(currentViewId() || 'dashboard');
  renderSubNav(currentViewId() || 'dashboard');

  window.addEventListener('popstate', (e) => {
    const id = (e.state && e.state.view) || 'dashboard';
    if (viewHistory.length && viewHistory[viewHistory.length - 1] === id) {
      viewHistory.pop();
    } else {
      const from = currentViewId();
      if (from && from !== id) viewHistory.push(from);
    }
    showView(id, null, false);
  });

  try { history.replaceState({ view: currentViewId() || 'dashboard' }, '', ''); } catch (_) {}
  updateToolbar(currentViewId() || 'dashboard');

  initTheme();
  initAvatar();
}

// ============================================================================
//  Avatar — try common extensions, use first one that loads, else fall back
// ============================================================================
function initAvatar() {
  const img = document.querySelector('.hero-avatar-img');
  if (!img) return;
  const exts = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg'];
  let i = 0;
  (function tryNext() {
    if (i >= exts.length) { img.classList.add('is-missing'); return; }
    const test = new Image();
    test.onload  = () => { img.src = test.src; img.classList.remove('is-missing'); };
    test.onerror = () => { i++; tryNext(); };
    test.src = 'img/avatar.' + exts[i];
  })();
}

document.addEventListener('DOMContentLoaded', init);
