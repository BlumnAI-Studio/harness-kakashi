# Garden Harness (harness-kakashi)

![A Harness Must Be PDSA, Not PDCA](docs/PDSA.png)

<sub>📖 [Explore the historical background of PDSA →](docs/pdsa-vs-pdca.md)</sub>

> Just call out "Gardener." That's all it takes.

🌐 **Languages**: [한국어](README.md) · **English**

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin for assembling AI expert agent teams and automating code quality management.

---

## 🔬 Research direction — Why a harness should be PDSA

Garden Harness is researching **PDSA (Plan-Do-Study-Act)** as the methodology behind a sustainable improvement loop.
We may adopt PDSA directly, or switch to another methodology that fits better — this is still exploratory.

The mapping currently under exploration:

| Phase | Role inside the harness (tentative) |
|-------|--------------------------------------|
| **Plan** | Design agents · engines · hypotheses |
| **Do** | Execute within a session |
| **Study** | Log analysis, root-cause understanding, insight extraction |
| **Act** | Document knowledge, improve for the next cycle |

**Core hypothesis**: PDCA is a loop that stops at "Check (inspection)." Deming himself later clarified: *"I intended PDSA, not PDCA."*
The essence of a harness is not to **check** code but to **study** it — and that is the hypothesis we are currently probing.

Anthropic's Skill 2.0 learning loop (Define → Execute → Evaluate & Reflect → Improve) is also structurally very close to PDSA, and that alignment is the starting point of this research.

### Companion tool (optional): PDSA CLI — graph loop engineering

If you want to run PDSA as **graph engineering**, you can optionally pair the harness with a separate PDSA CLI.
It is a **separate loop-engineering tool that collaborates with this harness** — the harness owns the garden
(agents · evaluation), while the PDSA CLI owns the cycle graph (expectation → verdict → learning).

**Benefits**:
- **It enforces PDSA** — do/study/act cannot proceed without a plan (plan + expected evaluation).
  Most of us plan without a hypothesis; the CLI coaches you from expectation-setting onward
- **It stores each cycle as a graph** — learning accumulates in a per-project embedded graph DB (Kùzu),
  becoming an 'advanced memory' for AI agents (expectation-hit rate and cycle timelines are queryable)

**Install** (npm global):

```bash
npm install -g @webnori/pdsa
pdsa config key <LLM-key>      # LLM setup (for coaching)
pdsa check                     # verify connection
```

**One cycle**:

```bash
pdsa plan "plan" --expect "expected evaluation"   # start a cycle — coached up to the hypothesis
# ... do the work ...
pdsa do "what was done"                            # organize the Plan→Do graph
pdsa study "results"                               # verdict vs. expectation — Study, not Check
pdsa act                                           # consolidate learning → next plan
```

Details: [psmon/akka-graph-loop](https://github.com/psmon/akka-graph-loop) — Akka.Streams-based PDSA feedback cycle + Kùzu graph DB.

---

## What is this?

The harness is a garden, and agents are the flowers that bloom inside it.

The Gardener doesn't make the flowers bloom by hand — it knows which flower fits where, and plants the right expert agent in the right place at the right time.
And with grafting (接木) — a skill from another garden can be transplanted into yours.

> **On the name**: the project and install name stay `harness-kakashi`, but the meta-agent that tends the garden is called the **Gardener**.
> "Kakashi", the name used through 2.0.x, is the Gardener's former name — calling it that still works.

**It's not a tool that writes code. It's a garden that helps code get written better.**

---

## Prerequisites

The [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI must be installed.

```bash
npm install -g @anthropic-ai/claude-code
```

---

## Installation

### Option 1: Install from the marketplace (recommended)

Run two lines inside Claude Code, in order:

```
/plugin marketplace add psmon/harness-kakashi
/plugin install harness-kakashi@harness-kakashi-skills
```

- Line 1: Registers the GitHub repo `psmon/harness-kakashi` as a marketplace (reads `.claude-plugin/marketplace.json`).
- Line 2: Installs the `harness-kakashi` plugin from the registered marketplace (`harness-kakashi-skills`).

Check installation status with `/plugin`. Remove with `/plugin uninstall harness-kakashi@harness-kakashi-skills`.

### Option 2: Clone and use directly

```bash
git clone https://github.com/psmon/harness-kakashi.git
cd harness-kakashi
claude
```

### Using on Codex

We recommend using Codex's **skill import** feature.
Rather than maintaining a separate compatibility wrapper, the simplest and most durable path is to let Codex import the Claude skills directly from `plugins/harness-kakashi/skills/`.

```bash
git clone https://github.com/psmon/harness-kakashi.git
```

After cloning, follow your Codex version's import procedure to import `plugins/harness-kakashi/skills/harness-creator/SKILL.md` (and `harness-chakra/SKILL.md` if you need it). See your Codex version's official docs for the exact steps.

> The `.agents/skills/` compatibility wrapper shipped in earlier versions has been removed. Codex's import feature is more robust and removes the cost of maintaining the same skill in two places.

### Included skills

| Skill | Command | Role | Install |
|-------|---------|------|---------|
| **harness-creator** 🧑‍🌾 | `/harness-creator` | The Gardener — recruit/manage agents, review code, verify structure, manage versions, migrate | Default |
| **harness-chakra** 🥷 | `/harness-chakra` | Chakra Auditor — evaluate token efficiency as a third-person observer | Default |

- **harness-creator**: needed by every user. From harness init to recruiting experts, code review, structure verification and version management — all in one.
- **harness-chakra**: the shadow that quietly audits token spend after work ends. Never touches code; only hands you the next session's strategy.

> The former `harness-build` (garden design) skill has been merged into creator.
> "design an agent", "verify structure", "bump version" are all handled by `/harness-creator`.

### Upgrading 2.0.x → 2.1.0 — new names, same behavior

| Old command (2.0.x) | New command (2.1.0) |
|---|---|
| `/harness-kakashi-creator` | `/harness-creator` |
| `/harness-chakra-kakashi` | `/harness-chakra` |

1. Update `harness-kakashi` from `/plugin` — the install name is unchanged: `harness-kakashi@harness-kakashi-skills`
2. If you already have a garden, run `/harness-creator migrate` — it moves config (`$schemaVersion` 1.2.0), the Gardener definition and the garden README to the new naming. Logs and version history are left untouched
3. Rules in CLAUDE.md that still say "Kakashi Harness" can stay — **Gardener = Kakashi** is how they are read

The old commands remain as deprecated aliases that forward to the new ones, and will be removed in 3.0.0. Details: [CHANGELOG](plugins/harness-kakashi/CHANGELOG.md)

---

## Quick start: 4 lines is all it takes

```
/harness-creator init            ← Open the garden
/harness-creator add new agent   ← Plant a flower
/harness-creator write code      ← Generate code
/harness-creator full review     ← Receive coaching
```

> Note: the skill also accepts Korean triggers (`전체 점검해`, `새 에이전트 추가해`). Both work.

---

## 🐸 Toad Summoning Jutsu (口寄せの術) — Recruit a Sage

> Where the Gardener **transplants techniques (術) by grafting (接木)**,
> Naruto (the user) **summons the doctrines (思想) of past masters with the Toad Summoning Jutsu**.

The harness's ultimate technique. Summon a domain master (a *Sage*) and apply their doctrine to your work directly.

**First sage recruited — W. Edwards Deming (the father of QA)**

- The **PDSA cycle** (Plan–Do–**Study**–Act) becomes the harness's **base evaluation system**
- Always-on at the end of every action; specialist evaluations layer on top as follow-ups
- Deming insisted on **PDSA, not PDCA** — that doctrinal precision is preserved in an English canonical reference

**Tutorials & references**:

| Doc | What it covers |
|-----|----------------|
| 📜 [Worldview Mapping](harness/knowledge/lore/naruto-worldview.md) | How the Naruto worldview (Kakashi as the Gardener's archetype, Sages, Jutsu) maps 1:1 to harness components |
| 📘 [PDSA — Deming's Doctrine (English canon)](harness/knowledge/methodology/pdsa-deming.en.md) | Academic reference with primary sources. The "Study not Check" doctrine |
| ⚙️ [Base Evaluation Operating Rules (Korean)](harness/knowledge/methodology/evaluation-base-pdsa.md) | Two-tier (base + follow-up) evaluation structure and how it applies |
| 🥷 [Sage Deming Agent](harness/agents/sage-deming.md) | Invocation procedure, output format, anti-patterns |
| 🐸 [Toad Summoning Engine](harness/engine/toad-summoning.md) | Sage roster, summoning modes, recruitment procedure |
| 📝 [v1.4.0 Recruitment Log](harness/docs/v1.4.0.md) | Why this change, who's affected, why Deming was the first sage |

---

## 🌟 Hoshimori (星守) — The Star Keeper Who Threads the Constellation

> Where the Gardener tends flowers and the Sage applies doctrines,
> **Hoshimori threads the constellation (the knowledge graph).**

[[hoshimori|Hoshimori (Star Keeper)]] hails from the canonical Naruto location **Hoshigakure (星隠れの里, the Village Hidden Among Stars)**.
In the source canon the village protects a sacred "Star (星)" meteorite as a chakra source. In this harness, **the stars are documents** and **the constellation is the wiki-link graph**.

### Doctrine — link density ∝ value

> 1000 notes + 50 links < 100 notes + 500 links

[Karpathy's LLM Wiki pattern](https://aimaker.substack.com/p/llm-wiki-obsidian-knowledge-base-andrej-karphaty), [Anthropic's context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), and [A-Mem (NeurIPS 2025)](https://arxiv.org/abs/2502.12110) all agree — a knowledge base's value is determined by its **link density**.

### Open as an Obsidian vault

Open this repository as an [Obsidian](https://obsidian.md/) vault and every `.md` becomes a star, every `[[wikilink]]` an edge — the graph view **lights up like a constellation**. Hoshimori threads them all.

### Always-on — fires whenever docs change

Hoshimori activates **without explicit invocation** when:
- A new `.md` is added under README / `harness/` / `docs/`
- An existing doc gains a new reference to another doc
- `harness.config.json`'s agents/engine array changes
- A new version history (`harness/docs/vX.Y.Z.md`) is written

Constellation keeper details: [agent definition](harness/agents/hoshimori.md), [academic doctrine](harness/knowledge/methodology/zettelkasten-llm-era.md)

---

## 🗺️ Chizumori (地図守) — The Map Keeper Who Draws the Village

> Where the Star Keeper threads the constellation inside an Obsidian vault,
> **Chizumori draws the map shown to outsiders.**

[[chizumori|Chizumori]] hails from the canonical Naruto location **Konohagakure (木ノ葉隠れの里, the Hidden Leaf Village)**, specifically the Hokage Tower's records archive.
In this harness, Chizumori publishes the garden's current state as a static site at `Home/harness-view/`, deployed to GitHub Pages.

### Two roles

1. **🗺️ View Sync** — `Home/harness-view/scripts/sync-view.js` scans the `harness/` tree and emits `indexes/*.json` manifests + `data/pdsa-insight.json` (PDSA 4-axis aggregation). Bodies are never duplicated — only metadata is extracted.
2. **📡 View Publishing** — Pushing a `doc-v*` tag triggers `.github/workflows/pages.yml`, which runs sync + deploys to GitHub Pages.

### Static vs dynamic separation

- **Static**: every `.md` under `harness/` — the view fetches them directly via `../../harness/...` (no duplication).
- **Dynamic**: `indexes/*.json`, `data/pdsa-insight.json` — regenerated idempotently by sync-view.js.

### How to run

```bash
# Local preview
node Home/harness-view/scripts/sync-view.js
python -m http.server 8000 --directory Home

# Official release
git tag doc-v1.6.0
git push --tags   # GitHub Actions auto-syncs + deploys
```

Map keeper details: [agent definition](harness/agents/chizumori.md), [v1.6.0 recruitment log](harness/docs/v1.6.0.md)

---

## 🖌️ Sai (サイ) — The Ink Shinobi Who Brings Designs to Life

> Where Chizumori **shows** the village to outsiders,
> **Sai draws it first.** And the drawing comes alive as code.

[[sai|Sai]] is the canonical Naruto character from **Konohagakure**, an ink-painting shinobi trained in **Root (根, Ne)** before joining Team 7.
In the original, his signature jutsu **超獸偽畫 (Chōjū Giga, Super Beast Imitating Drawing)** lets beasts painted in his scroll leap out and move on their own.
In this harness, Sai is the **executor of the design-first principle** — the pencil design (`.pen`) is the single canon, and `Home/harness-view` code follows it into life.

### The design line — Sai paints, Chizumori shows

```
Sai (ink shinobi) — Chōjū Giga
   │  Updates Home/design/harness-view.pen
   │  Syncs Home/harness-view code
   ↓
Chizumori (map keeper)
   │  Manifests + GitHub Pages
   ↓
[The map outsiders walk past and read]
```

### Three principles of design-first

| Principle | Meaning |
|-----------|---------|
| **Single Canon** | `.pen` is the truth; code is its shadow |
| **Draw-then-Animate** | Design updates always precede code updates |
| **Debt Recovery** | Code may temporarily lead the canon, but every excursion must be reclaimed in the next cycle |

Debt policy lives in `harness.config.json` `design.debtPolicy` — 7 days unrecovered triggers a gardener warning, 30 days blocks the next minor release.

### Canon location

`Home/design/harness-view.pen` — visual canon of the village map (harness-view). 9 menu pages + a reusable sidebar component.
The `.pen` file is encrypted — Read/Edit are forbidden. All access goes through Pencil MCP tools (`mcp__pencil__*`).

### How to invoke

```
"sai — add a new menu"
"design-first sync — change sidebar active color"
"choujuu-giga"
"pencil-to-view"
```

| Document | Content |
|----------|---------|
| 🖌️ [Sai agent](harness/agents/sai.md) | Ink shinobi, evaluation axes, Pencil MCP guide |
| 🖌️ [Chōjū Giga engine](harness/engine/choujuu-giga.md) | 6-Phase design-first sync workflow |
| ⚖️ [design-first doctrine](harness/knowledge/methodology/design-first.md) | Three principles and where they apply |
| 🖌️ [Pencil design locations canon](harness/knowledge/design/pencil-design-locations.md) | The owner's knowledge — paths, color & typography mapping |
| 📝 [v1.7.0 recruitment log](harness/docs/v1.7.0.md) | Sai recruited + design-first introduced |

---

## Onboarding — until the garden opens

### Step 1: Open the garden (init)

```
/harness-creator init
```

You'll be asked for the harness name and description. The garden gets created:

```
harness/
├── harness.config.json   ← the garden's nameplate
├── agents/tamer.md       ← the Gardener (built-in)
├── knowledge/            ← sunlight — domain knowledge
├── engine/               ← water channels — workflows
├── docs/                 ← garden journal
└── logs/                 ← activity records
```

### Step 2: The gardener guides you

Once init finishes, the Gardener appears.
It shows the current garden state and suggests the first expert suited to your project.

```
The garden has opened — MyProject (v1.0.0)

The Gardener stands at the gate.
Right now, this garden has only the gardener.

Looking at the garden's name and description, I suggest these experts:
  · security-guard
  · performance-scout
  · test-sentinel

Accept the suggestion and I'll plant them for you.
```

### Step 3: Plant the flowers

Accept the suggestion, or add your own:

```
/harness-creator add new agent
```

### Step 4: Receive coaching

Once agents are planted, your code can receive expert review:

```
/harness-creator full review
```

Five experts analyze the code in parallel and deliver concrete improvements.

---

## Real case: "I just asked for a pyramid"

A user with limited development experience used Garden Harness for the first time.

```
User input              Garden Harness response
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Make a pyramid"      → 173 lines of .NET code + build + run
"Run a full review"   → 5 experts in parallel, overall grade B+
"Write a security doc"→ OWASP Top 10 report
```

In the process, the user learned naturally:

| What the garden taught | The textbook name |
|---------------------|-------------------|
| "Separate the method" | Single Responsibility Principle (SRP) |
| "Capture with StringWriter" | Testable design |
| "args unused → safe" | Attack-surface minimization |
| "Nice use of collection expressions" | Leveraging modern language features |

**They just asked for code to be written — and got a senior-level review from five developers.**

---

## Usage

### `/harness-creator` — use the garden

#### Plant flowers (authoring)

| Command | Description |
|---------|-------------|
| `/harness-creator init` | Initialize the garden |
| `/harness-creator explain the harness` | Report garden state |
| `/harness-creator improve the harness` | 3-axis evaluation + improvement plan |
| `/harness-creator update the harness` | Update to match project changes |
| `/harness-creator check the eval log` | Log analysis and trends |
| `/harness-creator add new agent` | Plant a new flower |
| `/harness-creator copy skill` | Grafting (接木) — transplant a skill from another garden |

#### Make flowers bloom (execution)

| Command | Description |
|---------|-------------|
| `/harness-creator full review` | Full review (all agents) |
| `/harness-creator review changes` | git-diff-based change review |
| `/harness-creator run the harness` | Same as full review |

### Garden design — structure verification & version management (built into creator)

Commands for shaping the harness internals. All built into `/harness-creator`.

| Command | Description |
|---------|-------------|
| `/harness-creator add new agent` | Agent suggestion → approval → creation (recruit workflow) |
| `/harness-creator verify structure` | Check config ↔ file consistency, 3-Layer balance |
| `/harness-creator bump version` | Version numbering + history authoring |
| `/harness-creator migrate` | Move a pre-2.1.0 garden to the Gardener naming (Mode F) |

---

## The garden's structure — three layers of soil

Garden Harness is made of three layers.

| Layer | Directory | Metaphor | Role |
|-------|-----------|----------|------|
| Layer 1 | `knowledge/` | Sunlight | Domain knowledge — the standard for judging what's right |
| Layer 2 | `agents/` | Nutrients | Expert agents — the entities performing review |
| Layer 3 | `engine/` | Water channels | Workflow — the order and scope review flows in |

Without sunlight, direction is lost;
without nutrients, no flower blooms;
without water, the flowers dry out.
Only when all three layers are in place does the code-flower bloom.

---

## With harness vs without

| | Claude alone | Garden Harness |
|---|--------------|-----------------|
| Code generation | ✓ | ✓ |
| Expert review | ✗ | 5 in parallel |
| OWASP security check | ✗ | Full Top 10 |
| Performance anti-pattern analysis | ✗ | 2-Pass scan |
| Concrete code coaching | ✗ | Line-specific fixes |
| Formal doc output | ✗ | Auto-generated reports |
| Activity log | ✗ | Every action auto-logged |
| Agent team management | ✗ | Add / remove / evaluate |

---

## Project structure

```
harness-kakashi/
├── .claude-plugin/marketplace.json           # Marketplace catalog
├── plugins/harness-kakashi/                  # Plugin distribution package
│   ├── .claude-plugin/plugin.json            #   Manifest
│   └── skills/
│       ├── harness-creator/                  #   Gardener skill (default)
│       │   ├── SKILL.md
│       │   ├── references/                   #   Reference docs
│       │   └── templates/harness/            #   init templates
│       ├── harness-chakra/                   #   Chakra Auditor skill (default)
│       │   └── SKILL.md
│       ├── harness-kakashi-creator/          #   deprecated alias → harness-creator
│       └── harness-chakra-kakashi/           #   deprecated alias → harness-chakra
│
├── harness/                                  # This repo's own harness (dev)
│   ├── harness.config.json
│   ├── agents/                               #   Agent definitions
│   ├── engine/                               #   Workflows
│   ├── knowledge/                            #   Domain knowledge
│   ├── logs/                                 #   Execution logs
│   └── docs/                                 #   Version history
│
└── projects/                                 # Sample projects
```

---

## Core concepts

| Concept | Metaphor | Description |
|---------|----------|-------------|
| **Harness** | Garden | Quality-management framework for the project |
| **Agent** | Flower | Expert performing a specific role (security, performance, tests, etc.) |
| **Gardener (Tamer)** | Caretaker | Meta-agent that manages the harness itself (formerly "Kakashi") |
| **Knowledge** | Sunlight | Domain knowledge the agents reference |
| **Engine** | Water channels | Workflow composing agents into execution |
| **Grafting (接木)** | Transplanting | Bringing a skill from another garden into yours (formerly "Sharingan") |

---

## Contributing to skill development

### Add a new agent

1. Write an agent markdown file under `harness/agents/`
2. Register it in the `agents` array in `harness/harness.config.json`
3. If needed, add a workflow under `harness/engine/`

Or run `/harness-creator add new agent` for a guided flow.

### Version policy — the plugin and the mother count separately

The distributed plugin and the mother harness use **decoupled, independent semver**:

| Target | Version files | What it tracks |
|--------|--------------|----------------|
| **Distributed plugin** | `.claude-plugin/marketplace.json` (`metadata.version` + `plugins[0].version`) and `plugins/harness-kakashi/.claude-plugin/plugin.json` (`version`) — **always bump all three together** | Changes to the distribution (`plugins/`). History: `plugins/harness-kakashi/CHANGELOG.md` |
| **Mother harness** | `harness/harness.config.json` (`version`) | Growth of this repo's own harness (agent recruits etc.). History: `harness/docs/v*.md` |

Plugin release checklist: ① finish `plugins/` changes → ② bump all three manifest versions together →
③ record in `CHANGELOG.md` → ④ sync `plugins/` → `.claude/skills/` (verify diff 0).

> **`plugins/` is the source of truth** — edit distributed skills (SKILL.md, references/, templates/)
> under `plugins/harness-kakashi/skills/` first, then copy to `.claude/skills/` (the local test copy).
> Keep only `tamer.md` under the distributed `templates/harness/agents/` — other agents are for users to recruit.

## License

MIT

---

## 🌟 Constellation

> Open this repository as an Obsidian vault — the graph view lights up. The Star Keeper [[hoshimori]] tends the constellation.

- [[README|🌐 한국어 README]] — Korean entry star
- [[naruto-worldview|🥷 Worldview Mapping]] — Gardener (archetype: Kakashi) / Sage / Hoshimori / Chizumori / Sai 1:1 mapping
- [[hoshimori|🌟 Hoshimori (Star Keeper)]] — Obsidian vault constellation keeper
- [[chizumori|🗺️ Chizumori (Map Keeper)]] — harness-view manifests & publishing
- [[sai|🖌️ Sai (Ink Shinobi)]] — design-first executor
- [[zettelkasten-llm-era|📚 Zettelkasten · Wiki-Tag Doctrine]] — Academic basis of the Star Keeper's doctrine
- [[tamer|🧑‍🌾 The Gardener]] — Meta agent (formerly "Kakashi")
- [[sage-deming|🐸 Sage Deming]] — PDSA base evaluation
- [[toad-summoning|🐸 Toad Summoning Engine]] — Sage invocation
- [[choujuu-giga|🖌️ Chōjū Giga Engine]] — design-first sync engine
- [[design-first|⚖️ design-first Doctrine]] — Sai's doctrine
- [[pencil-design-locations|🖌️ Pencil Design Locations Canon]] — Owner's knowledge
- [[pdsa-deming.en|📘 PDSA Doctrine (English canon)]]
- [[evaluation-base-pdsa|⚙️ Base Evaluation Operating Rules]]
- [[naruto-harness-story-tutorial.en|📖 Naruto Harness Story Tutorial (EN)]]
- [[pdsa-vs-pdca|📜 PDSA vs PDCA history]]
- [[v1.9.0|📝 v1.9.0 — Gardener naming (plugin 2.1.0)]]
- [[v1.7.0|📝 v1.7.0 — Sai recruited]]
