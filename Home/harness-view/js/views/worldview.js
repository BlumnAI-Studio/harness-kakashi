// worldview.js — 나루토 세계관 캔바스
import { h, mount } from '../utils/dom.js';
import { loadIndex, loadMd, repoLink, renderMdRich } from '../utils/loader.js';

export async function renderWorldview({ view }) {
  const [graph, md] = await Promise.all([
    safe(() => loadIndex('worldview-graph'), { characters: [], jutsu: [] }),
    safe(() => loadMd('harness/knowledge/lore/naruto-worldview.md'), ''),
  ]);

  const charCards = (graph.characters || []).map(c => h('div', { class: 'card' }, [
    h('div', { style: 'display:flex;align-items:baseline;gap:8px;margin-bottom:6px;' }, [
      h('span', { style: 'font-size:20px;' }, c.icon || '🥷'),
      h('strong', {}, c.name),
      c.role ? h('span', { class: 'badge keeper' }, c.role) : null,
    ]),
    c.village ? h('div', { class: 'muted' }, '🏯 ' + c.village) : null,
    c.summary ? h('p', { style: 'font-size:13px;margin:6px 0 4px;' }, c.summary) : null,
    c.file ? h('a', { href: repoLink(c.file), target: '_blank' }, c.file) : null,
  ]));

  const jutsuTable = (graph.jutsu || []).length ? h('table', { class: 'simple' }, [
    h('thead', {}, h('tr', {}, [
      h('th', {}, '술법'),
      h('th', {}, '원어'),
      h('th', {}, '하네스 컴포넌트'),
      h('th', {}, '시전자'),
    ])),
    h('tbody', {}, graph.jutsu.map(j => h('tr', {}, [
      h('td', {}, j.name || ''),
      h('td', {}, h('code', {}, j.kanji || '')),
      h('td', {}, j.component || ''),
      h('td', {}, j.caster || ''),
    ]))),
  ]) : null;

  const head = h('div', { class: 'banner' }, [
    h('h2', {}, '🥷 나루토 세계관 매핑'),
    h('p', {}, '카카시·현자·호시모리·치즈모리·차크라 카카시 — 1:1 운영 매핑.'),
  ]);

  view.appendChild(head);

  if (charCards.length) {
    view.appendChild(h('div', { class: 'panel-title' }, '등장 인물'));
    view.appendChild(h('div', { class: 'grid' }, charCards));
  }

  if (jutsuTable) {
    view.appendChild(h('div', { class: 'panel-title' }, '술법'));
    view.appendChild(h('div', { class: 'card' }, [jutsuTable]));
  }

  if (md) {
    view.appendChild(h('div', { class: 'panel-title' }, '정전 본문'));
    const body = h('div', { class: 'md', html: renderMdRich(stripFrontmatter(md), 'harness/knowledge/lore/naruto-worldview.md') });
    view.appendChild(body);
  }
}

function stripFrontmatter(text) {
  if (text.startsWith('---')) {
    const end = text.indexOf('\n---', 3);
    if (end > 0) return text.slice(end + 4);
  }
  return text;
}

async function safe(fn, fallback) {
  try { return await fn(); } catch { return fallback; }
}
