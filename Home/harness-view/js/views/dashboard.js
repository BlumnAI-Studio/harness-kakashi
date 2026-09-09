// dashboard.js — 정원 전경
import { h, mount } from '../utils/dom.js';
import { loadIndex, loadData } from '../utils/loader.js';

export async function renderDashboard({ view }) {
  const [meta, agents, knowledge, engine, docs, logs, news, pdsa] = await Promise.all([
    safe(() => loadIndex('_meta'), {}),
    safe(() => loadIndex('agents'), { items: [] }),
    safe(() => loadIndex('knowledge'), { items: [] }),
    safe(() => loadIndex('engine'), { items: [] }),
    safe(() => loadIndex('docs'), { items: [] }),
    safe(() => loadIndex('logs'), { items: [], byCategory: {} }),
    safe(() => loadData('news'), null),
    safe(() => loadData('pdsa-insight'), null),
  ]);

  const builtAt = meta.builtAt ? new Date(meta.builtAt) : null;
  const stamp = builtAt ? builtAt.toLocaleString() : '미동기화';

  const banner = h('div', { class: 'banner' }, [
    h('h2', {}, news?.headline?.ko || '정원의 하네스 — 마을 지도'),
    h('p', {}, news?.narrative?.ko || '나루토 세계관의 정원에 핀 꽃들. 정원지기·현자·별지기·지도지기가 일한다.'),
    h('p', { class: 'muted' }, `🗺️ 지도 빌드: ${stamp}`),
  ]);

  const counts = h('div', { class: 'grid' }, [
    statCard('🌱 에이전트', agents.items?.length || 0, '꽃이 핀 자리'),
    statCard('☀️ 지식', knowledge.items?.length || 0, '햇빛 — knowledge/'),
    statCard('💧 엔진', engine.items?.length || 0, '물길 — engine/'),
    statCard('📝 버전', docs.items?.length || 0, '정원 일지'),
    statCard('🗂️ 로그', logs.items?.length || 0, '활동 기록'),
    statCard('📌 git 커밋', docs.commitCount || 0, 'docs 영역'),
  ]);

  const pdsaCard = pdsa ? renderPdsaSummary(pdsa) : h('div', { class: 'empty' },
    'PDSA 인사이트 미동기화 — 지도지기에게 \"뷰동기화\"를 요청하세요.');

  const newsHL = news?.highlights?.length ? h('div', { class: 'card' }, [
    h('h3', {}, '🌟 최근 변화'),
    ...news.highlights.map(hl => h('div', { class: 'list-row' }, [
      h('span', { class: `badge ${hl.tone || ''}` }, hl.label || ''),
      h('div', { class: 'title' }, (hl.text?.ko || hl.text || '')),
    ])),
  ]) : null;

  mount(view, banner, counts, pdsaCard, newsHL);
}

function statCard(label, value, hint) {
  return h('div', { class: 'card' }, [
    h('div', { class: 'muted' }, label),
    h('div', { style: 'font-size:28px;font-weight:700;margin:6px 0;' }, String(value)),
    h('div', { class: 'muted' }, hint),
  ]);
}

function renderPdsaSummary(pdsa) {
  const card = h('div', { class: 'card' }, [
    h('h3', {}, [
      h('span', {}, '🐸 PDSA 인사이트  '),
      h('span', { class: 'badge sage' }, `window: ${pdsa.windowDays || 14}일`),
      h('span', { class: 'muted', style: 'margin-left:8px;font-size:12px;' },
        pdsa.analyzedAt ? `갱신: ${pdsa.analyzedAt}` : ''),
    ]),
    h('p', { class: 'muted' }, pdsa.learned?.lead?.ko || pdsa.learned?.lead || ''),
    h('div', { class: 'pdsa-box' }, [
      pdsaCell('tried',  '시도', pdsa.tried),
      pdsaCell('solved', '해결', pdsa.solved),
      pdsaCell('remain', '남은 과제', pdsa.remaining),
      pdsaCell('learn',  '배운 것', pdsa.learned ? [pdsa.learned] : []),
    ]),
  ]);
  return card;
}

function pdsaCell(klass, title, items) {
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

async function safe(fn, fallback) {
  try { return await fn(); } catch { return fallback; }
}
