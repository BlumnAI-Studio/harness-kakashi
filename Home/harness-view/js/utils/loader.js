// loader.js — fetch helpers
// Static .md files live in the repo and are accessed via relative paths
// from harness-view/. The view runs at: <root>/Home/harness-view/index.html
// To reach <root>/harness/agents/foo.md → '../../harness/agents/foo.md'
const REPO_ROOT_REL = '../../';

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

export function renderMd(text) {
  if (!window.marked) return `<pre>${escape(text)}</pre>`;
  return window.marked.parse(text, {
    gfm: true,
    breaks: false,
  });
}

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
