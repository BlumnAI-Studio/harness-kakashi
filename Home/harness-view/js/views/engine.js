// engine.js — 워크플로우 엔진
import { h, mount } from '../utils/dom.js';
import { loadIndex, loadMd, repoLink, renderMdRich } from '../utils/loader.js';

export async function renderEngine({ view, sub }) {
  const idx = await loadIndex('engine');
  const detailId = new URLSearchParams(location.hash.split('?')[1] || '').get('id');

  if (detailId) {
    const item = idx.items.find(it => it.id === detailId);
    if (item) return renderDetail({ view, sub, item });
  }

  view.appendChild(h('div', { class: 'banner' }, [
    h('h2', {}, '⚙️ 엔진 (Workflow)'),
    h('p', {}, `총 ${idx.items.length}개 — 검수가 흐르는 물길.`),
  ]));

  if (!idx.items.length) {
    view.appendChild(h('div', { class: 'empty' }, '엔진이 없습니다.'));
    return;
  }

  const cards = idx.items.map(item => h('a', {
    class: 'card',
    href: `#engine?id=${encodeURIComponent(item.id)}`,
    style: 'display:block;text-decoration:none;color:inherit;',
  }, [
    h('strong', {}, item.title || item.id),
    h('div', { class: 'muted', style: 'font-size:13px;margin-top:6px;' },
      item.description || ''),
  ]));

  view.appendChild(h('div', { class: 'grid' }, cards));
}

async function renderDetail({ view, sub, item }) {
  sub.classList.add('visible');
  mount(sub, h('a', { href: '#engine', class: 'btn' }, '← 엔진 목록'),
    h('span', { class: 'crumb' }, [h('span', {}, ' / 엔진 / '), h('b', {}, item.title || item.id)]));

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
