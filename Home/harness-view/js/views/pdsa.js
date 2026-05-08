// pdsa.js — PDSA 인사이트 (sage-deming의 사상, 치즈모리 집계)
import { h, mount } from '../utils/dom.js';
import { loadData, repoLink } from '../utils/loader.js';

export async function renderPdsa({ view }) {
  let pdsa;
  try { pdsa = await loadData('pdsa-insight'); }
  catch {
    return mount(view, h('div', { class: 'empty' },
      'PDSA 인사이트가 아직 동기화되지 않았습니다. 치즈모리에게 \"뷰동기화\"를 요청하세요.'));
  }

  view.appendChild(h('div', { class: 'banner' }, [
    h('h2', {}, '🐸 PDSA 인사이트 — 데밍의 학습 루프'),
    h('p', {}, [
      '데밍의 PDSA 사이클 (Plan-Do-Study-Act)에 따라 ',
      h('span', { class: 'badge sage' }, `최근 ${pdsa.windowDays || 14}일`),
      ' 의 활동을 시도/해결/잔여/학습 4축으로 집계합니다. ',
      pdsa.analyzedAt ? h('span', { class: 'muted' }, ` (분석: ${pdsa.analyzedAt})`) : null,
    ]),
  ]));

  view.appendChild(h('div', { class: 'pdsa-box' }, [
    cell('tried',  '🔥 시도 (Tried)', pdsa.tried),
    cell('solved', '✅ 해결 (Solved)', pdsa.solved),
    cell('remain', '⏳ 잔여 (Remaining)', pdsa.remaining),
    cell('learn',  '📚 학습 (Learned)', pdsa.learned ? [pdsa.learned] : []),
  ]));

  if (pdsa.sources?.length) {
    view.appendChild(h('div', { class: 'panel-title' }, '근거 로그 (sources)'));
    view.appendChild(h('div', { class: 'card' }, pdsa.sources.map(s => h('div', { class: 'list-row' }, [
      h('span', { class: 'badge' }, s.category || ''),
      h('a', { class: 'title', href: repoLink(s.file), target: '_blank' },
        s.title?.ko || s.title?.en || s.title || s.file),
      h('div', { class: 'meta' }, s.date || ''),
    ]))));
  }

  view.appendChild(h('div', { class: 'card' }, [
    h('h3', {}, '🐸 사상 출처'),
    h('p', { class: 'muted' }, [
      'PDSA의 사상은 ',
      h('a', { href: repoLink('harness/agents/sage-deming.md'), target: '_blank' }, 'sage-deming(데밍 현자)'),
      ' 의 정전이고, 이 페이지는 ',
      h('a', { href: repoLink('harness/agents/chizumori.md'), target: '_blank' }, 'chizumori(지도지기)'),
      ' 가 집계만 수행한 결과입니다 — 사상 평가의 책임은 현자에게 있습니다.',
    ]),
  ]));
}

function cell(klass, title, items) {
  const list = (items || []).map(it => {
    const txt = it?.ko || it?.text?.ko || it?.body?.ko || it?.lead?.ko ||
                it?.en || (typeof it === 'string' ? it : JSON.stringify(it));
    return h('li', {}, txt);
  });
  return h('div', { class: `pdsa-cell ${klass}` }, [
    h('h4', {}, title),
    list.length ? h('ul', {}, list) : h('div', { class: 'muted', style: 'font-size:12px;' }, '— 없음'),
  ]);
}
