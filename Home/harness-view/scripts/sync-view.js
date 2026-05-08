#!/usr/bin/env node
/**
 * sync-view.js — 치즈모리(地図守, Chizumori) 뷰 동기화 스크립트
 *
 * Reads from:  harness/agents/, harness/knowledge/, harness/engine/,
 *              harness/docs/, harness/logs/, harness/harness.config.json
 * Writes to:   Home/harness-view/indexes/*.json
 *              Home/harness-view/data/pdsa-insight.json
 *
 * Principles:
 *   - Static (.md bodies) are NOT duplicated — only metadata extracted.
 *   - Dynamic (PDSA aggregation, git stats, manifests) is generated here.
 *   - Idempotent: running twice produces identical output (modulo timestamps).
 *
 * Run:   node Home/harness-view/scripts/sync-view.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const HARNESS = path.join(REPO_ROOT, 'harness');
const VIEW_ROOT = path.join(REPO_ROOT, 'Home', 'harness-view');
const INDEXES_DIR = path.join(VIEW_ROOT, 'indexes');
const DATA_DIR = path.join(VIEW_ROOT, 'data');

const t0 = Date.now();

function rel(p) { return path.relative(REPO_ROOT, p).replace(/\\/g, '/'); }

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

function readText(p) { return fs.readFileSync(p, 'utf8'); }

function writeJson(file, obj) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function listMd(root) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  function walk(d) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.isFile() && ent.name.endsWith('.md')) out.push(p);
    }
  }
  walk(root);
  return out.sort();
}

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return { fm: {}, body: text };
  const end = text.indexOf('\n---', 3);
  if (end < 0) return { fm: {}, body: text };
  const yaml = text.slice(3, end).trim();
  const body = text.slice(end + 4).trimStart();
  return { fm: parseSimpleYaml(yaml), body };
}

// minimal YAML — handles strings, lists of strings, no nested objects beyond 1 level.
function parseSimpleYaml(text) {
  const out = {};
  const lines = text.split(/\r?\n/);
  let curKey = null, curList = null;
  for (const raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (/^\s+-\s+/.test(raw)) {
      if (curList) curList.push(stripQuotes(raw.replace(/^\s+-\s+/, '').trim()));
      continue;
    }
    const m = raw.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1], val = m[2].trim();
    if (val === '') {
      // list or nested
      curKey = key;
      curList = [];
      out[key] = curList;
    } else {
      out[key] = stripQuotes(val);
      curKey = null; curList = null;
    }
  }
  return out;
}

function stripQuotes(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function firstHeading(body) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim().replace(/^#+\s*/, '') : null;
}

function firstParagraph(body) {
  const lines = body.split(/\r?\n/);
  let buf = [];
  for (const ln of lines) {
    if (/^#/.test(ln)) { if (buf.length) break; continue; }
    if (/^\s*$/.test(ln)) { if (buf.length) break; continue; }
    if (/^>/.test(ln) || /^---/.test(ln)) { if (buf.length) break; continue; }
    buf.push(ln);
    if (buf.length > 3) break;
  }
  return buf.join(' ').trim();
}

function makeId(filePath) {
  return path.basename(filePath, '.md');
}

function fileMeta(filePath) {
  const stat = fs.statSync(filePath);
  const text = readText(filePath);
  const { fm, body } = parseFrontmatter(text);
  const heading = firstHeading(body);
  return {
    id: makeId(filePath),
    file: rel(filePath),
    name: fm.name || makeId(filePath),
    title: heading || fm.title || fm.name || makeId(filePath),
    heading,
    description: fm.description || firstParagraph(body) || '',
    type: fm.type || null,
    domain: fm.domain || null,
    village: fm.village || null,
    status: fm.status || null,
    triggers: Array.isArray(fm.triggers) ? fm.triggers : [],
    size: stat.size,
    modified: stat.mtime.toISOString().slice(0, 19),
  };
}

// ─── git helpers ────────────────────────────────────────────────────────────
function gitRun(args, cwd = REPO_ROOT) {
  try {
    return execSync(`git ${args}`, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  } catch { return ''; }
}

function gitContributors(pathSpec) {
  const out = gitRun(`log --no-merges --pretty=format:%an -- "${pathSpec}"`);
  if (!out) return { contributors: [], commitCount: 0 };
  const lines = out.split('\n').filter(Boolean);
  const counts = {};
  for (const ln of lines) counts[ln] = (counts[ln] || 0) + 1;
  const total = lines.length;
  const contributors = Object.entries(counts)
    .map(([name, commits]) => ({ name, commits, percent: Math.round((commits / total) * 100) }))
    .sort((a, b) => b.commits - a.commits);
  return { contributors, commitCount: total };
}

function gitLatestForFile(filePath) {
  const r = gitRun(`log -1 --pretty=format:%aI|%an -- "${rel(filePath)}"`);
  if (!r) return {};
  const [date, author] = r.split('|');
  return { git_date: date, git_author: author };
}

// ─── PDSA aggregation ───────────────────────────────────────────────────────
function extractPdsaFromLog(filePath) {
  const text = readText(filePath);
  const { fm, body } = parseFrontmatter(text);
  const date = fm.date || (text.match(/^date:\s*(.+)$/m) || [])[1] || null;
  const heading = firstHeading(body) || fm.title || makeId(filePath);
  const category = fm.agent || rel(filePath).split('/')[2] || 'misc';

  // capture PDSA blocks
  const out = { tried: [], solved: [], remaining: [], learned: null, plan: null };

  const sections = splitByH3(body);
  for (const [h, content] of Object.entries(sections)) {
    const lc = h.toLowerCase();
    if (lc.includes('plan')) out.plan = content;
    if (lc.includes('study')) {
      // 새 학습 lines as 'learned'
      const learned = content.match(/^- (?:새 학습|new learning):\s*(.*)$/m);
      if (learned) out.learned = learned[1].trim();
    }
    if (lc.includes('act')) {
      // pull "Adopt|Adapt|Abandon"
      const decided = content.match(/(Adopt|Adapt|Abandon)/);
      if (decided) {
        if (decided[1] === 'Adopt') out.solved.push(`[${heading}] 채택`);
        if (decided[1] === 'Adapt') out.tried.push(`[${heading}] 조정 적용`);
        if (decided[1] === 'Abandon') out.remaining.push(`[${heading}] 폐기 — 다른 접근 필요`);
      }
    }
  }
  return { id: makeId(filePath), file: rel(filePath), date, category, title: heading, ...out };
}

function splitByH3(body) {
  const out = {};
  const re = /^###\s+(.+?)$/gm;
  const positions = [];
  let m;
  while ((m = re.exec(body))) positions.push({ name: m[1].trim(), idx: m.index });
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].idx;
    const next = positions[i + 1] ? positions[i + 1].idx : body.length;
    const slice = body.slice(start, next);
    const headerEnd = slice.indexOf('\n');
    out[positions[i].name] = slice.slice(headerEnd + 1).trim();
  }
  return out;
}

function aggregatePdsa(logs, windowDays = 14) {
  const cutoff = new Date(Date.now() - windowDays * 86400_000);
  const tried = new Set();
  const solved = new Set();
  const remaining = new Set();
  const sources = [];
  let learnedLead = null;

  for (const lg of logs) {
    if (lg.date) {
      const d = new Date(lg.date);
      if (!isNaN(d) && d < cutoff) continue;
    }
    sources.push({
      date: lg.date,
      category: lg.category,
      file: lg.file,
      title: { ko: lg.title, en: lg.title },
    });
    for (const t of lg.tried || []) tried.add(t);
    for (const s of lg.solved || []) solved.add(s);
    for (const r of lg.remaining || []) remaining.add(r);
    if (!learnedLead && lg.learned) learnedLead = lg.learned;
  }

  return {
    analyzedAt: new Date().toISOString().slice(0, 10),
    windowDays,
    sources: sources.slice(0, 50),
    tried: [...tried].map(x => ({ ko: x, en: x })),
    solved: [...solved].map(x => ({ ko: x, en: x })),
    remaining: [...remaining].map(x => ({ ko: x, en: x })),
    learned: learnedLead
      ? { lead: { ko: learnedLead, en: learnedLead }, body: { ko: '', en: '' } }
      : { lead: { ko: '학습된 가설이 아직 모이지 않음.', en: 'No learned hypothesis yet.' },
          body: { ko: '', en: '' } },
  };
}

// ─── worldview graph extraction ────────────────────────────────────────────
function extractWorldviewGraph() {
  const file = path.join(HARNESS, 'knowledge', 'lore', 'naruto-worldview.md');
  if (!fs.existsSync(file)) return null;
  const text = readText(file);

  const characters = [];
  const charSection = text.match(/## 등장 인물[\s\S]*?(?=\n##\s|$)/);
  if (charSection) {
    const rows = charSection[0].match(/^\|\s*\*\*[^|]+\*\*[^\n]*$/gm) || [];
    for (const row of rows) {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length < 3) continue;
      const name = cells[0].replace(/\*\*/g, '');
      const summary = cells[1];
      const fileLink = cells[2].replace(/`/g, '').trim();
      characters.push({
        name,
        summary,
        file: fileLink.startsWith('harness/') ? fileLink : null,
        icon: name.includes('카카시') ? '🥷' :
              name.includes('현자') ? '🐸' :
              name.includes('호시모리') ? '🌟' :
              name.includes('치즈모리') ? '🗺️' :
              name.includes('차크라') ? '👤' : '🥷',
        role: name.includes('호시모리') || name.includes('치즈모리') ? 'keeper' :
              name.includes('현자') ? 'sage' :
              name.includes('카카시') && !name.includes('차크라') ? 'tamer' :
              name.includes('차크라') ? 'shadow' : null,
      });
    }
  }

  const jutsu = [];
  const jutsuSection = text.match(/## 술법[\s\S]*?(?=\n##\s|$)/);
  if (jutsuSection) {
    const rows = jutsuSection[0].match(/^\|\s*\*\*[^|]+\*\*[^\n]*$/gm) || [];
    for (const row of rows) {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length < 4) continue;
      jutsu.push({
        name: cells[0].replace(/\*\*/g, ''),
        kanji: cells[1],
        component: cells[2],
        caster: cells[3],
      });
    }
  }

  return { characters, jutsu };
}

// ─── main ───────────────────────────────────────────────────────────────────
function main() {
  console.log('🗺️  Chizumori sync-view.js — 마을 지도 갱신 시작\n');
  ensureDir(INDEXES_DIR);
  ensureDir(DATA_DIR);

  // 1. agents
  const agentFiles = listMd(path.join(HARNESS, 'agents'));
  const agents = agentFiles.map(f => ({ ...fileMeta(f), ...gitLatestForFile(f) }));
  writeJson(path.join(INDEXES_DIR, 'agents.json'), {
    base: 'harness/agents',
    items: agents,
  });
  console.log(`  agents      : ${agents.length}`);

  // 2. knowledge (recursive)
  const knowFiles = listMd(path.join(HARNESS, 'knowledge'));
  const knowledge = knowFiles.map(f => {
    const meta = fileMeta(f);
    const parts = rel(f).split('/');
    meta.category = parts.length >= 4 ? parts[2] : 'general';
    return { ...meta, ...gitLatestForFile(f) };
  });
  writeJson(path.join(INDEXES_DIR, 'knowledge.json'), {
    base: 'harness/knowledge',
    items: knowledge,
  });
  console.log(`  knowledge   : ${knowledge.length}`);

  // 3. engine
  const engineFiles = listMd(path.join(HARNESS, 'engine'));
  const engine = engineFiles.map(f => ({ ...fileMeta(f), ...gitLatestForFile(f) }));
  writeJson(path.join(INDEXES_DIR, 'engine.json'), {
    base: 'harness/engine',
    items: engine,
  });
  console.log(`  engine      : ${engine.length}`);

  // 4. docs
  const docFiles = listMd(path.join(HARNESS, 'docs'));
  const docs = docFiles.map(f => ({ ...fileMeta(f), ...gitLatestForFile(f) }));
  const { contributors, commitCount } = gitContributors('harness/docs');
  writeJson(path.join(INDEXES_DIR, 'docs.json'), {
    base: 'harness/docs',
    items: docs,
    contributors,
    commitCount,
  });
  console.log(`  docs        : ${docs.length} (commits: ${commitCount})`);

  // 5. logs
  const logFiles = listMd(path.join(HARNESS, 'logs'));
  const logs = logFiles.map(f => {
    const meta = fileMeta(f);
    const parts = rel(f).split('/');
    meta.category = parts.length >= 4 ? parts[2] : 'misc';
    meta.date = (meta.modified || '').slice(0, 10);
    const fm = parseFrontmatter(readText(f)).fm;
    if (fm.date) meta.date = String(fm.date).slice(0, 10);
    return meta;
  });
  const byCategory = {};
  for (const lg of logs) (byCategory[lg.category] = byCategory[lg.category] || []).push(lg);
  // sort each category newest first
  for (const cat of Object.keys(byCategory)) {
    byCategory[cat].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }
  writeJson(path.join(INDEXES_DIR, 'logs.json'), {
    base: 'harness/logs',
    items: logs.sort((a, b) => (b.date || '').localeCompare(a.date || '')),
    byCategory,
  });
  console.log(`  logs        : ${logs.length}`);

  // 6. PDSA aggregation
  const pdsaSamples = logFiles.map(extractPdsaFromLog);
  const pdsa = aggregatePdsa(pdsaSamples, 14);
  writeJson(path.join(DATA_DIR, 'pdsa-insight.json'), pdsa);
  console.log(`  pdsa        : ${pdsa.tried.length} tried / ${pdsa.solved.length} solved / ${pdsa.remaining.length} remaining`);

  // 7. worldview-graph
  const wv = extractWorldviewGraph();
  if (wv) {
    writeJson(path.join(INDEXES_DIR, 'worldview-graph.json'), wv);
    console.log(`  worldview   : ${wv.characters.length} chars / ${wv.jutsu.length} jutsu`);
  }

  // 8. _meta
  const durationMs = Date.now() - t0;
  writeJson(path.join(INDEXES_DIR, '_meta.json'), {
    builtAt: new Date().toISOString(),
    durationMs,
    trigger: process.env.CI ? 'ci' : 'manual',
    scannedPaths: ['harness/agents', 'harness/knowledge', 'harness/engine', 'harness/docs', 'harness/logs'],
    sourceLatest: gitRun('log -1 --pretty=format:%aI').trim(),
    counts: {
      agents: agents.length,
      knowledge: knowledge.length,
      engine: engine.length,
      docs: docs.length,
      logs: logs.length,
    },
  });

  console.log(`\n✅ 마을 지도 갱신 완료 — ${durationMs} ms`);
}

main();
