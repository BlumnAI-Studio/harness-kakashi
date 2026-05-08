// app.js — main router & sidebar
import { MENU, HOME } from './config/menu.js';
import { h, mount } from './utils/dom.js';
import { loadIndex } from './utils/loader.js';

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

function renderSidebar(activeId) {
  mount(elNav, ...MENU.map(m => {
    if (m.section) {
      return h('div', { class: 'sb-section' }, m.section);
    }
    const item = h('a', {
      class: 'sb-item' + (m.id === activeId ? ' active' : ''),
      href: `#${m.id}`,
    }, [
      h('span', { class: 'sb-icon' }, m.icon || '·'),
      h('span', {}, m.label),
    ]);
    return item;
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
  const id = (location.hash || '#' + HOME).slice(1);
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
  } catch (err) {
    console.error(err);
    mount(elView, h('div', { class: 'card' }, [
      h('h3', {}, '소환 실패'),
      h('p', { class: 'muted' }, String(err && err.message || err)),
      h('p', { class: 'muted' }, '뷰 동기화가 필요할 수 있습니다: 치즈모리(지도지기) 에게 물어보세요.'),
    ]));
  }
}

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

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  if (window.mermaid) window.mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
  renderFoot();
  route();
});
