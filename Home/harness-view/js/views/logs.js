// logs.js — 활동 로그
import { h, mount } from '../utils/dom.js';
import { loadIndex, loadMd, repoLink, renderMd } from '../utils/loader.js';

export async function renderLogs({ view, sub }) {
  const idx = await loadIndex('logs');
  const detailId = new URLSearchParams(location.hash.split('?')[1] || '').get('id');

  if (detailId) {
    const item = idx.items.find(it => it.id === detailId);
    if (item) return renderDetail({ view, sub, item });
  }

  view.appendChild(h('div', { class: 'banner' }, [
    h('h2', {}, '🗂️ 활동 로그'),
    h('p', {}, `총 ${idx.items.length}건 — 정원의 모든 활동 기록.`),
  ]));

  const cats = idx.byCategory || groupByCategory(idx.items);
  for (const [cat, items] of Object.entries(cats)) {
    view.appendChild(h('div', { class: 'panel-title' }, `${cat} (${items.length})`));
    view.appendChild(h('div', { class: 'card' }, items.slice(0, 20).map(it => h('div', { class: 'list-row' }, [
      h('a', { class: 'title', href: `#logs?id=${encodeURIComponent(it.id)}` }, it.title || it.heading || it.id),
      h('div', { class: 'meta' }, it.date || ''),
    ]))));
  }
}

function groupByCategory(items) {
  const groups = {};
  for (const it of items) {
    const cat = it.category || 'misc';
    (groups[cat] = groups[cat] || []).push(it);
  }
  return groups;
}

async function renderDetail({ view, sub, item }) {
  sub.classList.add('visible');
  mount(sub, h('a', { href: '#logs', class: 'btn' }, '← 로그 목록'),
    h('span', { class: 'crumb' }, [h('span', {}, ' / 로그 / '), h('b', {}, item.title || item.id)]));

  const md = await loadMd(item.file);
  view.appendChild(h('div', { class: 'md', html: renderMd(stripFrontmatter(md)) }));
}

function stripFrontmatter(text) {
  if (text.startsWith('---')) {
    const end = text.indexOf('\n---', 3);
    if (end > 0) return text.slice(end + 4);
  }
  return text;
}
