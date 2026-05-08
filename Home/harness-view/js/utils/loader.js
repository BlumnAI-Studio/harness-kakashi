// loader.js — fetch + markdown rendering helpers
// Static .md files live in the repo and are accessed via relative paths
// from harness-view/. The view runs at: <root>/Home/harness-view/index.html
// To reach <root>/harness/agents/foo.md → '../../harness/agents/foo.md'
const REPO_ROOT_REL = '../../';

import { preprocessWikilinks } from './wikilinks.js';

export async function loadIndex(name) {
  const res = await fetch(`indexes/${name}.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`indexes/${name}.json not found`);
  return res.json();
}

export async function loadData(name) {
  const res = await fetch(`data/${name}.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`data/${name}.json not found`);
  return res.json();
}

export async function loadMd(repoRelPath) {
  const url = REPO_ROOT_REL + repoRelPath;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${repoRelPath} not found`);
  return res.text();
}

export function repoLink(repoRelPath) {
  return REPO_ROOT_REL + repoRelPath;
}

/**
 * Plain marked render — no wikilinks, no mermaid post-processing hint.
 * Kept for compatibility.
 */
export function renderMd(text) {
  if (!window.marked) return `<pre>${escape(text)}</pre>`;
  return window.marked.parse(text, { gfm: true, breaks: false });
}

/**
 * Rich render — wikilinks resolved, mermaid blocks marked for later run.
 * Caller is responsible for calling mermaid.run({ nodes }) on the
 * resulting `.mermaid` elements after insertion into the DOM.
 *
 * @param {string} text - markdown source (frontmatter already stripped)
 * @param {string} sourcePath - repo-relative path of the source file (for link rewriting)
 */
export function renderMdRich(text, sourcePath) {
  if (!window.marked) return `<pre>${escape(text)}</pre>`;
  // 1. wikilinks → standard <a class="wikilink"> links
  let pre = preprocessWikilinks(text);
  // 2. rewrite relative .md links so they resolve to repo paths
  pre = rewriteRelativeMdLinks(pre, sourcePath);
  // 3. let marked parse (mermaid renderer is set globally in app.js)
  return window.marked.parse(pre, { gfm: true, breaks: false });
}

/**
 * In a markdown body sourced from `harness/agents/foo.md`, the link
 * `(../knowledge/lore/naruto-worldview.md)` should resolve to
 * `harness/knowledge/lore/naruto-worldview.md` so the modal can open it.
 */
function rewriteRelativeMdLinks(md, sourcePath) {
  if (!sourcePath) return md;
  const sourceDir = sourcePath.replace(/\/[^/]*$/, '');
  return md.replace(/\]\(([^)]+\.md)([)#?][^)]*)?\)/g, (full, target, suffix = '') => {
    if (/^https?:\/\//i.test(target)) return full;
    if (target.startsWith('/')) return full;
    // resolve target relative to sourceDir
    const parts = (sourceDir + '/' + target).split('/');
    const stack = [];
    for (const p of parts) {
      if (p === '..' && stack.length) stack.pop();
      else if (p === '.' || p === '') continue;
      else stack.push(p);
    }
    const resolved = stack.join('/');
    return `](${resolved}${suffix || ''})`;
  });
}

function escape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
