// about.js — 이 지도에 대해
import { h, mount } from '../utils/dom.js';
import { loadIndex, repoLink } from '../utils/loader.js';

export async function renderAbout({ view }) {
  let meta = {};
  try { meta = await loadIndex('_meta'); } catch {}

  view.appendChild(h('div', { class: 'banner' }, [
    h('h2', {}, '🗺️ 이 지도에 대해'),
    h('p', {}, '이 페이지는 정원의 하네스(harness-kakashi)의 마을 지도(harness-view)입니다.'),
    h('p', { class: 'muted' },
      '지도지기 치즈모리(地図守, Konohagakure)가 정원의 현재 모습을 외부 행인에게 보여주기 위해 그린 것입니다.'),
  ]));

  view.appendChild(h('div', { class: 'card' }, [
    h('h3', {}, '🗺️ 빌드 정보'),
    h('div', { class: 'kv' }, [
      h('dt', {}, '빌드 시각'), h('dd', {}, meta.builtAt || '— (미동기화)'),
      h('dt', {}, '빌드 시간'), h('dd', {}, meta.durationMs ? `${meta.durationMs} ms` : '—'),
      h('dt', {}, '트리거'), h('dd', {}, meta.trigger || '—'),
      h('dt', {}, '스캔 경로'), h('dd', {}, (meta.scannedPaths || []).join(', ') || '—'),
    ]),
  ]));

  view.appendChild(h('div', { class: 'card' }, [
    h('h3', {}, '⚖️ 정적/동적 분리 원칙'),
    h('p', {}, '이 뷰는 다음 원칙을 엄격히 따릅니다:'),
    h('ul', {}, [
      h('li', {}, [
        h('strong', {}, '정적 (참조 only): '),
        '에이전트 정의, 지식 문서, 엔진, 버전 히스토리, 로그 — 본문은 ',
        h('code', {}, '../../harness/...'), ' 경로로 직접 fetch 됩니다. 복제 없음.',
      ]),
      h('li', {}, [
        h('strong', {}, '동적 (sync로 생성): '),
        h('code', {}, 'indexes/*.json'), ' (매니페스트 + git 메타) 와 ',
        h('code', {}, 'data/pdsa-insight.json'), ' (PDSA 4축 집계). 모두 ',
        h('code', {}, 'sync-view.js'), ' 한 번 실행으로 재생성 가능 (멱등).',
      ]),
    ]),
  ]));

  view.appendChild(h('div', { class: 'card' }, [
    h('h3', {}, '🥷 지도지기 치즈모리'),
    h('p', { class: 'muted' }, [
      '🏯 ',
      h('a', { href: repoLink('harness/agents/chizumori.md'), target: '_blank' }, 'harness/agents/chizumori.md'),
      ' — 두 가지 역할: ',
      h('strong', {}, '뷰동기화'), ' (정원 스캔 + 매니페스트 + PDSA 집계) 와 ',
      h('strong', {}, '뷰 퍼블리싱'), ' (GitHub Pages 배포).',
    ]),
    h('p', { class: 'muted' }, [
      '💡 PDSA 사상의 출처: ',
      h('a', { href: repoLink('harness/agents/sage-deming.md'), target: '_blank' }, 'sage-deming'),
      ' — 치즈모리는 평가하지 않고 집계만 합니다.',
    ]),
  ]));

  view.appendChild(h('div', { class: 'card' }, [
    h('h3', {}, '📦 저장소'),
    h('p', {}, [
      h('a', { href: 'https://github.com/psmon/harness-kakashi', target: '_blank' },
        'github.com/psmon/harness-kakashi'),
    ]),
  ]));
}
