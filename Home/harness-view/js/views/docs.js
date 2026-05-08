// docs.js — 정원 일지 (버전)
import { h, mount } from '../utils/dom.js';
import { loadIndex, loadMd, repoLink, renderMd } from '../utils/loader.js';

export async function renderDocs({ view, sub }) {
  const idx = await loadIndex('docs');
  const detailId = new URLSearchParams(location.hash.split('?')[1] || '').get('id');

  if (detailId) {
    const item = idx.items.find(it => it.id === detailId);
    if (item) return renderDetail({ view, sub, item });
  }

  view.appendChild(h('div', { class: 'banner' }, [
    h('h2', {}, '📝 버전 히스토리'),
    h('p', {}, `총 ${idx.items.length}건 — 정원이 자라온 기록.`),
  ]));

  // separate version docs and others
  const versions = idx.items.filter(it => /^v\d/.test(it.id || ''))
    .sort((a, b) => semverCmp(b.id, a.id));
  const others = idx.items.filter(it => !/^v\d/.test(it.id || ''));

  if (versions.length) {
    view.appendChild(h('div', { class: 'panel-title' }, '릴리스'));
    view.appendChild(h('div', { class: 'card' }, versions.map(it => h('div', { class: 'list-row' }, [
      h('span', { class: 'badge leaf' }, it.id),
      h('a', { class: 'title', href: `#docs?id=${encodeURIComponent(it.id)}` }, it.title || it.heading),
      h('div', { class: 'meta' }, it.modified || ''),
    ]))));
  }

  if (others.length) {
    view.appendChild(h('div', { class: 'panel-title' }, '기타 문서'));
    view.appendChild(h('div', { class: 'card' }, others.map(it => h('div', { class: 'list-row' }, [
      h('a', { class: 'title', href: `#docs?id=${encodeURIComponent(it.id)}` }, it.title || it.heading || it.id),
      h('div', { class: 'meta' }, it.file),
    ]))));
  }

  if (idx.contributors?.length) {
    view.appendChild(h('div', { class: 'panel-title' }, `컨트리뷰터 (총 ${idx.commitCount || 0} 커밋)`));
    view.appendChild(h('div', { class: 'card' }, idx.contributors.map(c => h('div', { class: 'list-row' }, [
      h('div', { class: 'title' }, c.name),
      h('div', { class: 'meta' }, `${c.commits} (${c.percent}%)`),
    ]))));
  }
}

function semverCmp(a, b) {
  const re = /(\d+)\.(\d+)\.(\d+)/;
  const ma = a.match(re), mb = b.match(re);
  if (!ma || !mb) return 0;
  for (let i = 1; i <= 3; i++) {
    const d = (parseInt(ma[i]) - parseInt(mb[i]));
    if (d !== 0) return d;
  }
  return 0;
}

async function renderDetail({ view, sub, item }) {
  sub.classList.add('visible');
  mount(sub, h('a', { href: '#docs', class: 'btn' }, '← 일지'),
    h('span', { class: 'crumb' }, [h('span', {}, ' / 버전 / '), h('b', {}, item.id)]));

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
