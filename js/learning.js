// ============================================================================
//  learning.js — Load and render .txt learning notes into the Learning views
//
//  Reads the three study files at runtime (so you can keep editing them while
//  you learn). Parses a subset of markdown-like syntax:
//
//    - Pipe tables        → <table class="learning-table">
//    - Section headings   → <h4 class="learning-heading">
//                           (emoji-numbered lines like "1️⃣ API Fundamentals",
//                            "🔟 Security", "1️⃣1️⃣ Performance", or short
//                            Title-case lines like "Flow Explanation")
//    - "- " / "N. " lines → <ul class="learning-list">
//    - **bold**, `code`   → inline <strong> / <code>
//    - everything else    → <p class="learning-para">
//
//  Pure decorative separator lines of =/- are skipped.
// ============================================================================

/** Escape < and > so raw < or > in notes don't break the DOM. */
function _escapeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Apply inline **bold** and `code` formatting after escaping. */
function _renderInline(s) {
  let out = _escapeHTML(s);
  out = out.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/`([^`]+?)`/g, '<code>$1</code>');
  return out;
}

/**
 * Detect a heading line.
 *   "1️⃣ API Fundamentals"              → keycap digit + space
 *   "🔟 Security & Compliance"         → single U+1F51F
 *   "1️⃣1️⃣ Performance & Scalability" → two keycaps
 *   "🧭 Professional API Glossary"     → intro emoji
 *   "✅ Key Takeaways"                 → check emoji
 *   "Flow Explanation"                  → short Title-case line, no punctuation
 */
function _isHeading(s) {
  if (!s) return false;
  // Emoji-keycap-numbered or known-emoji-prefixed headings
  if (/^(\d+\uFE0F?\u20E3\s|\d+\uFE0F?\u20E3\d+\uFE0F?\u20E3\s|\uD83D\uDD1F\s|\uD83E\uDDED\s|\u2705\s)/.test(s)) {
    return true;
  }
  // Short Title-case heading: no trailing sentence punctuation, mostly letters
  if (s.length <= 60 && /^[A-Z][A-Za-z0-9 &/\-]+$/.test(s) && !/[.?!:,]$/.test(s)) {
    return true;
  }
  return false;
}

/** Render raw text → HTML using the subset above. */
function renderLearningText(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let paraBuf = [];
  let listBuf = [];
  let tableBuf = [];

  function flushPara() {
    if (paraBuf.length) {
      out.push('<p class="learning-para">' + paraBuf.map(_renderInline).join('<br>') + '</p>');
      paraBuf = [];
    }
  }
  function flushList() {
    if (listBuf.length) {
      out.push('<ul class="learning-list">' +
        listBuf.map(l => '<li>' + _renderInline(l) + '</li>').join('') +
        '</ul>');
      listBuf = [];
    }
  }
  function flushTable() {
    if (!tableBuf.length) return;
    const rows = tableBuf;

    // Skip pseudo-tables that are just ASCII banners (1-column or all cells
    // are decorative runs of = or -).
    const maxCols = Math.max(...rows.map(r => r.length));
    const allDecorative = rows.every(r => r.every(c => /^[=\-]*$/.test(c)));
    if (maxCols < 2 || allDecorative) {
      tableBuf = [];
      return;
    }

    let head = null, body = rows;
    // If the 2nd row is a separator of dashes (optionally colons), treat row 1 as header.
    if (rows.length >= 2 && rows[1].every(c => /^:?-+:?$/.test(c))) {
      head = rows[0];
      body = rows.slice(2);
    }
    let html = '<div class="learning-table-wrap"><table class="learning-table">';
    if (head) {
      html += '<thead><tr>' +
        head.map(c => '<th>' + _renderInline(c) + '</th>').join('') +
        '</tr></thead>';
    }
    html += '<tbody>' +
      body.map(r => '<tr>' + r.map(c => '<td>' + _renderInline(c) + '</td>').join('') + '</tr>').join('') +
      '</tbody>';
    html += '</table></div>';
    out.push(html);
    tableBuf = [];
  }
  function flushAll() { flushPara(); flushList(); flushTable(); }

  // Skip the first non-empty line if it matches the file's own title (we already
  // render the title as an h2 in the view). We detect this by treating the first
  // substantive line as a doc title and dropping it.
  let firstSubstantiveSkipped = false;

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');   // rtrim
    const trimmed = line.trim();

    // Decorative separators of =, -, or | spanning a whole line → skip
    if (/^[=\-]{3,}$/.test(trimmed)) { continue; }

    // Blank line → flush all buffered blocks
    if (!trimmed) { flushAll(); continue; }

    // First non-empty line is the doc title → skip once
    if (!firstSubstantiveSkipped) {
      firstSubstantiveSkipped = true;
      continue;
    }

    // Pipe-delimited table row
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushPara(); flushList();
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      tableBuf.push(cells);
      continue;
    }

    // Any non-table line ends the current table block
    flushTable();

    // Bullet list item
    if (/^[-*]\s?/.test(trimmed) && !/^[-*]{3,}$/.test(trimmed)) {
      flushPara();
      listBuf.push(trimmed.replace(/^[-*]\s?/, ''));
      continue;
    }
    // Numbered list item (e.g. "1.Endpoint" or "1) Endpoint" or "1. Endpoint")
    if (/^\d+[.)]\s?/.test(trimmed)) {
      flushPara();
      listBuf.push(trimmed.replace(/^\d+[.)]\s?/, ''));
      continue;
    }

    // Heading
    if (_isHeading(trimmed)) {
      flushPara(); flushList();
      out.push('<h4 class="learning-heading">' + _renderInline(trimmed) + '</h4>');
      continue;
    }

    // Default: accumulate into paragraph
    paraBuf.push(trimmed);
  }

  flushAll();
  return out.join('\n');
}

/**
 * Render a Learning doc into the given element.
 *
 * Primary source: window.LEARNING_CONTENT (embedded, set by learning-content.js).
 * This works from file:// as well as http://. Fetch is used only as a fallback
 * when the embedded content is missing for this file (e.g. a .txt was added
 * but bake-learning.py hasn't been re-run yet).
 */
async function loadLearningDoc(target) {
  if (!target) return;
  const src = target.dataset.src;
  if (!src) return;

  // Primary: embedded content
  if (window.LEARNING_CONTENT && typeof window.LEARNING_CONTENT[src] === 'string') {
    target.innerHTML = renderLearningText(window.LEARNING_CONTENT[src]);
    return;
  }

  // Fallback: live fetch (works over http:// only)
  try {
    const resp = await fetch(encodeURI(src), { cache: 'no-store' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    target.innerHTML = renderLearningText(await resp.text());
  } catch (err) {
    target.innerHTML =
      '<div class="empty-state">Could not load <code>' + _escapeHTML(src) + '</code>.<br>' +
      'Run <code>python3 scripts/bake-learning.py</code> to embed it, ' +
      'or serve the site over HTTP.<br><br>' +
      '<span style="opacity:0.6">' + _escapeHTML(String(err.message || err)) + '</span></div>';
  }
}

/** Called from app.js init() — loads all three docs. */
function initLearningDocs() {
  document.querySelectorAll('.learning-doc[data-src]').forEach(loadLearningDoc);
}
