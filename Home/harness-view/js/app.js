// app.js — main router & sidebar + global md-modal click interceptor
import { MENU, HOME } from './config/menu.js';
import { h, mount } from './utils/dom.js';
import { loadIndex } from './utils/loader.js';
import { preloadWikilinks } from './utils/wikilinks.js';
import { openMdModal } from './components/md-modal.js';

import { renderDashboard } from './views/dashboard.js';
import { renderWorldview } from './views/worldview.js';
import { renderAgents }    from './views/agents.js';
import { renderEngine }    from './views/engine.js';
import { renderKnowledge } from './views/knowledge.js';
import { renderDocs }      from './views/docs.js';
import { renderLogs }      from './views/logs.js';
import { renderPdsa }      from './views/pdsa.js';
import { renderAbout }     from './views/about.js';

const RENDERERS = {
  dashboard: renderDashboard,
  worldview: renderWorldview,
  agents:    renderAgents,
  engine:    renderEngine,
  knowledge: renderKnowledge,
  docs:      renderDocs,
  logs:      renderLogs,
  pdsa:      renderPdsa,
  about:     renderAbout,
};

const elNav  = document.getElementById('sb-nav');
const elView = document.getElementById('view');
const elTop  = document.getElementById('topbar');
const elSub  = document.getElementById('subbar');
const elFoot = document.getElementById('sb-build');

// ── mermaid + marked global setup ───────────────────────────────────────────
if (window.mermaid) {
  window.mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
}

/**
 * marked v4+ HTML-escapes fenced-code contents — `-->` becomes `--&gt;`.
 * mermaid.run reads innerHTML, so encoded source breaks the lexer.
 * Decode common entities before injecting into .mermaid div.
 */
function decodeMermaidEntities(s) {
  return String(s)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

if (window.marked) {
  const renderer = new window.marked.Renderer();
  const origCode = renderer.code.bind(renderer);
  renderer.code = function (code, lang) {
    if (lang === 'mermaid') {
      return `<div class="mermaid">${decodeMermaidEntities(code)}</div>`;
    }
    return origCode(code, lang);
  };
  window.marked.setOptions({ renderer, gfm: true, breaks: false });
}

// ── sidebar render ──────────────────────────────────────────────────────────
function renderSidebar(activeId) {
  mount(elNav, ...MENU.map(m => {
    if (m.section) return h('div', { class: 'sb-section' }, m.section);
    return h('a', {
      class: 'sb-item' + (m.id === activeId ? ' active' : ''),
      href: `#${m.id}`,
    }, [
      h('span', { class: 'sb-icon' }, m.icon || '·'),
      h('span', {}, m.label),
    ]);
  }));
}

function renderTopbar(item) {
  if (!item) return mount(elTop);
  mount(elTop, h('div', { class: 'crumb' }, [
    h('span', {}, '🥷 카카시 하네스 / '),
    h('b', {}, item.label),
  ]));
}

function getRoute() {
  const id = (location.hash || '#' + HOME).slice(1).split('?')[0];
  const item = MENU.find(m => m.id === id);
  return item || MENU.find(m => m.id === HOME);
}

async function route() {
  const item = getRoute();
  renderSidebar(item.id);
  renderTopbar(item);
  elSub.classList.remove('visible');
  mount(elView, h('div', { class: 'empty' }, '소환 중…'));
  try {
    const fn = RENDERERS[item.view];
    if (!fn) throw new Error(`view '${item.view}' not implemented`);
    await fn({ view: elView, sub: elSub });
    // run mermaid in any newly inserted nodes
    runMermaidIn(elView);
  } catch (err) {
    console.error(err);
    mount(elView, h('div', { class: 'card' }, [
      h('h3', {}, '소환 실패'),
      h('p', { class: 'muted' }, String(err && err.message || err)),
      h('p', { class: 'muted' }, '뷰 동기화가 필요할 수 있습니다 — 치즈모리(지도지기)에게 \"뷰동기화\"를 요청하세요.'),
    ]));
  }
}

function runMermaidIn(container) {
  if (!window.mermaid) return;
  const nodes = container.querySelectorAll('.mermaid:not([data-processed])');
  if (nodes.length) {
    window.mermaid.run({ nodes }).catch(err => console.warn('mermaid', err));
  }
}

// ── global click interceptor — open .md links in the modal ──────────────────
//
// What we intercept:
//   1. <a data-md-modal="path"> — wikilink-derived links (preprocessed)
//   2. <a href="...something.md"> — markdown links inside rendered .md content
//      whose href points inside the repo (relative or known absolute Pages url)
//
// What we let through:
//   - external http(s) links to other domains
//   - in-app navigation (#hash routes) to view pages
//   - links with [target="_blank"] (explicit new-window intent)
//   - cmd/ctrl+click (user wants new tab)
//
document.addEventListener('click', (ev) => {
  if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
  if (ev.button !== 0) return;

  const a = ev.target.closest('a');
  if (!a) return;

  // explicit modal trigger
  const modalPath = a.dataset.mdModal;
  if (modalPath) {
    ev.preventDefault();
    openMdModal(modalPath, a.dataset.title || '');
    return;
  }

  // explicit opt-out: clicking modal's own "↗ raw" / "GitHub" link with rel=noopener
  // (these set rel attribute, so check rel)
  if (a.rel && a.rel.includes('noopener') && a.target === '_blank') return;

  const href = a.getAttribute('href');
  if (!href) return;
  if (href.startsWith('#')) return;
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

  // .md target detection (works for relative and absolute paths)
  // .md links are ALWAYS intercepted — even with target="_blank" — because
  // raw .md is unreadable on Pages. Users can click "↗ raw" inside the modal.
  const stripQuery = href.split('#')[0].split('?')[0];
  if (!/\.md$/.test(stripQuery)) {
    // for non-md, respect target="_blank"
    return;
  }

  // resolve to repo-relative path
  const repoRel = toRepoRel(href, location.href);
  if (!repoRel) return;

  ev.preventDefault();
  openMdModal(repoRel, a.textContent.trim());
});

/**
 * Convert any href (relative to current page or absolute Pages URL)
 * to a repo-relative path. Returns null if the link points outside the repo.
 *
 * Examples:
 *   '../../harness/agents/sage-deming.md'
 *      → 'harness/agents/sage-deming.md'
 *   'https://psmon.github.io/harness-kakashi/harness/agents/sage-deming.md'
 *      → 'harness/agents/sage-deming.md'
 *   'https://psmon.github.io/harness-kakashi/Home/harness-view/...md'
 *      → null  (a view internal — not a static .md doc)
 */
function toRepoRel(href, base) {
  let url;
  try { url = new URL(href, base); } catch { return null; }

  // same-origin only
  if (url.origin !== location.origin) return null;

  // expected base: <origin>/<repo>/...   or   <origin>/...
  // Determine repo prefix from current location pathname.
  // location.pathname examples:
  //   /harness-kakashi/Home/harness-view/   (deployed)
  //   /Home/harness-view/                   (local dev at repo root)
  const cur = location.pathname;
  const viewIdx = cur.indexOf('/Home/harness-view');
  if (viewIdx < 0) return null;
  const repoPrefix = cur.slice(0, viewIdx); // '/harness-kakashi' or ''

  if (!url.pathname.startsWith(repoPrefix + '/')) return null;
  const repoRel = url.pathname.slice(repoPrefix.length + 1);

  // exclude paths inside the view itself
  if (repoRel.startsWith('Home/harness-view/')) return null;

  return repoRel;
}

// ── footer build info ───────────────────────────────────────────────────────
async function renderFoot() {
  try {
    const meta = await loadIndex('_meta');
    const t = meta.builtAt ? new Date(meta.builtAt) : null;
    const stamp = t ? t.toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : '';
    elFoot.textContent = `🗺️ Chizumori build · ${stamp}`;
  } catch {
    elFoot.textContent = '🗺️ Chizumori — 지도 미동기화';
  }
}

// ── boot ────────────────────────────────────────────────────────────────────
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', async () => {
  // Wikilink index must load before first render so [[name]] resolves.
  // Indexes are small (~30KB total) — wait inline rather than show broken links.
  renderFoot();
  try { await preloadWikilinks(); }
  catch (err) { console.warn('wikilink preload', err); }
  route();
});
