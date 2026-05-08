// agents.js — 에이전트 카드 + 상세
import { h, mount } from '../utils/dom.js';
import { loadIndex, loadMd, repoLink, renderMdRich } from '../utils/loader.js';

export async function renderAgents({ view, sub }) {
  const idx = await loadIndex('agents');
  const detailId = new URLSearchParams(location.hash.split('?')[1] || '').get('id');

  if (detailId) {
    const item = idx.items.find(it => it.id === detailId);
    if (item) return renderDetail({ view, sub, item });
  }

  view.appendChild(h('div', { class: 'banner' }, [
    h('h2', {}, '🌱 에이전트 정원'),
    h('p', {}, `총 ${idx.items.length}명 — 정원지기·현자·전문가·keeper.`),
  ]));

  const cards = idx.items.map(item => h('a', {
    class: 'card',
    href: `#agents?id=${encodeURIComponent(item.id)}`,
    style: 'display:block;text-decoration:none;color:inherit;',
  }, [
    h('div', { style: 'display:flex;align-items:center;gap:8px;margin-bottom:6px;' }, [
      h('strong', {}, item.title || item.id),
      typeChip(item.type),
    ]),
    h('div', { class: 'muted', style: 'font-size:13px;line-height:1.5;' },
      truncate(item.description || '(설명 없음)', 120)),
    h('div', { class: 'muted', style: 'font-size:11px;margin-top:8px;' },
      (item.triggers || []).slice(0, 3).map(t => h('span', { class: 'tag-chip' }, t))),
  ]));

  view.appendChild(h('div', { class: 'grid' }, cards));
}

function typeChip(t) {
  if (!t) return null;
  const klass = {
    sage: 'sage', keeper: 'keeper',
  }[t] || 'leaf';
  return h('span', { class: `badge ${klass}` }, t);
}

async function renderDetail({ view, sub, item }) {
  sub.classList.add('visible');
  mount(sub, h('a', { href: '#agents', class: 'btn' }, '← 정원으로'),
    h('span', { class: 'crumb' }, [h('span', {}, ' / 에이전트 / '), h('b', {}, item.title || item.id)]));

  const md = await loadMd(item.file);
  view.appendChild(h('div', { class: 'card' }, [
    h('h3', {}, item.title || item.id),
    h('div', { class: 'kv' }, [
      h('dt', {}, '파일'), h('dd', {}, h('a', { href: repoLink(item.file), target: '_blank' }, item.file)),
      h('dt', {}, '타입'), h('dd', {}, item.type || '—'),
      h('dt', {}, '도메인'), h('dd', {}, item.domain || '—'),
      h('dt', {}, '트리거'),
      h('dd', {}, (item.triggers || []).map(t => h('span', { class: 'tag-chip' }, t))),
    ]),
  ]));

  view.appendChild(h('div', { class: 'md', html: renderMdRich(stripFrontmatter(md), item.file) }));
}

function stripFrontmatter(text) {
  if (text.startsWith('---')) {
    const end = text.indexOf('\n---', 3);
    if (end > 0) return text.slice(end + 4);
  }
  return text;
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '…' : s;
}
