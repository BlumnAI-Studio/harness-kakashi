// md-modal.js — .md 파일을 팝업으로 띄우는 뷰어
// raw .md 링크 클릭 시 페이지 이동 대신 이 모달이 열린다.
// mermaid 코드 블록 자동 렌더, 위키링크 해석, 외부 링크는 그대로 통과.

import { h, mount, clear } from '../utils/dom.js';
import { loadMd, renderMdRich, repoLink } from '../utils/loader.js';

const ROOT_ID = 'modal-root';

let lastFocus = null;

export function openMdModal(repoRelPath, title) {
  const root = document.getElementById(ROOT_ID);
  if (!root) return console.warn('modal-root missing');
  lastFocus = document.activeElement;

  const overlay = h('div', { class: 'mdmodal-overlay', onclick: closeOnOverlay });
  const dialog = h('div', { class: 'mdmodal-dialog', role: 'dialog', 'aria-modal': 'true' });

  const head = h('div', { class: 'mdmodal-head' }, [
    h('div', { class: 'mdmodal-title' }, [
      h('span', {}, '🗺️  '),
      h('strong', {}, title || repoRelPath),
    ]),
    h('div', { class: 'mdmodal-actions' }, [
      h('a', {
        class: 'btn',
        href: repoLink(repoRelPath),
        target: '_blank',
        rel: 'noopener',
        title: '원본 .md 새 창에서 열기',
      }, '↗ raw'),
      h('a', {
        class: 'btn',
        href: githubBlobUrl(repoRelPath),
        target: '_blank',
        rel: 'noopener',
        title: 'GitHub에서 보기',
      }, 'GitHub'),
      h('button', { class: 'btn mdmodal-close', onclick: close, 'aria-label': '닫기' }, '✕'),
    ]),
  ]);

  const bodyHost = h('div', { class: 'mdmodal-body' });
  const breadcrumb = h('div', { class: 'mdmodal-crumb' }, repoRelPath);

  const loading = h('div', { class: 'mdmodal-loading' }, '소환 중…');
  bodyHost.appendChild(loading);

  dialog.append(head, breadcrumb, bodyHost);
  overlay.appendChild(dialog);

  clear(root);
  root.appendChild(overlay);
  document.body.classList.add('mdmodal-open');
  document.addEventListener('keydown', onKey);

  loadMd(repoRelPath).then(text => {
    clear(bodyHost);
    const article = h('div', { class: 'md mdmodal-md' });
    article.innerHTML = renderMdRich(stripFrontmatter(text), repoRelPath);
    bodyHost.appendChild(article);

    // run mermaid on freshly rendered nodes
    if (window.mermaid) {
      const nodes = article.querySelectorAll('.mermaid:not([data-processed])');
      if (nodes.length) {
        window.mermaid.run({ nodes }).catch(err => console.warn('mermaid', err));
      }
    }
    // scroll body to top
    bodyHost.scrollTop = 0;
  }).catch(err => {
    clear(bodyHost);
    bodyHost.appendChild(h('div', { class: 'mdmodal-error' }, [
      h('p', {}, '🥷 문서를 읽을 수 없습니다.'),
      h('p', { class: 'muted' }, String(err.message || err)),
      h('p', {}, h('a', { href: repoLink(repoRelPath) }, '원본으로 이동')),
    ]));
  });

  // focus close button after open
  requestAnimationFrame(() => dialog.querySelector('.mdmodal-close')?.focus());

  function onKey(e) {
    if (e.key === 'Escape') close();
  }
  function closeOnOverlay(e) {
    if (e.target === overlay) close();
  }
  function close() {
    document.removeEventListener('keydown', onKey);
    document.body.classList.remove('mdmodal-open');
    clear(root);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
}

function stripFrontmatter(text) {
  if (text.startsWith('---')) {
    const end = text.indexOf('\n---', 3);
    if (end > 0) return text.slice(end + 4).trimStart();
  }
  return text;
}

function githubBlobUrl(repoRelPath) {
  return `https://github.com/psmon/harness-kakashi/blob/main/${repoRelPath}`;
}
