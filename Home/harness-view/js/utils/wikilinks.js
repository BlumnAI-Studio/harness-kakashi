// wikilinks.js — [[name]] 위키링크를 실제 .md 경로로 해석
// 호시모리(별지기)가 잇는 별자리를 치즈모리(지도지기)가 클릭 가능한 링크로 변환.
//
// 동작:
//   1. 페이지 로드 시 indexes/{agents,knowledge,engine,docs,logs}.json 을 합쳐
//      name → repoRelPath 매핑 사전 구축
//   2. 마크다운 본문의 [[name]] 또는 [[name|alias]] 를 표준 링크로 치환
//   3. 깨진 링크(matching 없음)는 회색 텍스트로 남김 (원문 보존)

import { loadIndex } from './loader.js';

let _index = null;
let _loadPromise = null;

async function buildIndex() {
  if (_index) return _index;
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    const idx = new Map();
    const sources = ['agents', 'knowledge', 'engine', 'docs', 'logs'];
    for (const name of sources) {
      try {
        const data = await loadIndex(name);
        for (const it of (data.items || [])) {
          // primary key = id (filename stem)
          if (it.id && it.file) idx.set(it.id, it);
          // also index by basename without extension if different
          if (it.file) {
            const base = it.file.split('/').pop().replace(/\.md$/, '');
            if (base !== it.id) idx.set(base, it);
          }
        }
      } catch { /* index might not exist yet */ }
    }
    _index = idx;
    return idx;
  })();
  return _loadPromise;
}

export async function preloadWikilinks() {
  await buildIndex();
}

export function resolveWikilink(name) {
  if (!_index) return null;
  // exact match
  let it = _index.get(name);
  if (it) return it;
  // case-insensitive fallback
  const lower = name.toLowerCase();
  for (const [k, v] of _index) {
    if (k.toLowerCase() === lower) return v;
  }
  // basename match (strip path)
  const basename = name.split('/').pop().replace(/\.md$/, '');
  it = _index.get(basename);
  return it || null;
}

/** Convert markdown body's [[name]] / [[name|alias]] to standard links.
 *  Resolved → <a class="wikilink" href="..." data-md-modal>alias or title</a>
 *  Unresolved → <span class="wikilink-broken">[[name]]</span>
 */
export function preprocessWikilinks(md) {
  return md.replace(/\[\[([^\]\n]+?)\]\]/g, (full, inner) => {
    const [target, alias] = inner.split('|').map(s => s.trim());
    const it = resolveWikilink(target);
    const label = (alias || it?.title || it?.heading || target).replace(/[\[\]]/g, '');
    if (!it) {
      return `<span class="wikilink-broken" title="vault에 없는 별: ${escape(target)}">⚠ ${escape(label)}</span>`;
    }
    // emit raw HTML so marked passes it through
    const path = it.file;
    return `<a class="wikilink" href="${escape(path)}" data-md-modal="${escape(path)}" data-title="${escape(it.title || it.id)}">${escape(label)}</a>`;
  });
}

function escape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
