// knowledge.js — 지식 (Layer 1, 햇빛)
import { h, mount } from '../utils/dom.js';
import { loadIndex, loadMd, repoLink, renderMdRich } from '../utils/loader.js';

export async function renderKnowledge({ view, sub }) {
  const idx = await loadIndex('knowledge');
  const detailId = new URLSearchParams(location.hash.split('?')[1] || '').get('id');

  if (detailId) {
    const item = idx.items.find(it => it.id === detailId);
    if (item) return renderDetail({ view, sub, item });
  }

  view.appendChild(h('div', { class: 'banner' }, [
    h('h2', {}, '☀️ 지식 (Knowledge)'),
    h('p', {}, `총 ${idx.items.length}개 — 도메인 지식·방법론·세계관 정전.`),
  ]));

  // group by category (top-level subdir or domain)
  const groups = {};
  for (const it of idx.items) {
    const cat = (it.category || it.domain || extractCategory(it.file) || 'general');
    (groups[cat] = groups[cat] || []).push(it);
  }

  for (const [cat, items] of Object.entries(groups)) {
    view.appendChild(h('div', { class: 'panel-title' }, cat));
    view.appendChild(h('div', { class: 'card' }, items.map(it => h('div', { class: 'list-row' }, [
      h('a', { class: 'title', href: `#knowledge?id=${encodeURIComponent(it.id)}` },
        it.title || it.heading || it.id),
      h('div', { class: 'meta' }, it.file || ''),
    ]))));
  }
}

function extractCategory(path) {
  if (!path) return null;
  const parts = path.split('/');
  // harness/knowledge/lore/foo.md → 'lore'
  if (parts.length >= 4 && parts[1] === 'knowledge') return parts[2];
  return null;
}

async function renderDetail({ view, sub, item }) {
  sub.classList.add('visible');
  mount(sub, h('a', { href: '#knowledge', class: 'btn' }, '← 지식 목록'),
    h('span', { class: 'crumb' }, [h('span', {}, ' / 지식 / '), h('b', {}, item.title || item.id)]));

  const md = await loadMd(item.file);
  view.appendChild(h('div', { class: 'md', html: renderMdRich(stripFrontmatter(md), item.file) }));
}

function stripFrontmatter(text) {
  if (text.startsWith('---')) {
    const end = text.indexOf('\n---', 3);
    if (end > 0) return text.slice(end + 4);
  }
  return text;
}
