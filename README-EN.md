# Harness-Kakashi

![A Harness Must Be PDSA, Not PDCA](docs/PDSA.png)

<sub>📖 [Explore the historical background of PDSA →](docs/pdsa-vs-pdca.md)</sub>

> Just call out "Kakashi Harness." That's all it takes.

🌐 **Languages**: [한국어](README.md) · **English**

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin for assembling AI expert agent teams and automating code quality management.

---

## 🔬 Research direction — Why a harness should be PDSA

Kakashi Harness is researching **PDSA (Plan-Do-Study-Act)** as the methodology behind a sustainable improvement loop.
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

---

## What is this?

The harness is a garden, and agents are the flowers that bloom inside it.

Like Kakashi-sensei from Naruto — not fighting directly, but placing the right expert agent in the right place at the right time.
And once the Sharingan (写輪眼) awakens — you can copy any skill just by seeing it.

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

After cloning, follow your Codex version's import procedure to import `plugins/harness-kakashi/skills/harness-kakashi-creator/SKILL.md` (and `harness-build/SKILL.md` if you need it). See your Codex version's official docs for the exact steps.

> The `.agents/skills/` compatibility wrapper shipped in earlier versions has been removed. Codex's import feature is more robust and removes the cost of maintaining the same skill in two places.

### Included skills

| Skill | Command | Role | Install |
|-------|---------|------|---------|
| **harness-kakashi-creator** | `/harness-kakashi-creator` | Use the garden — manage agents, review code, evaluate | Default |
| **harness-build** | `/harness-build` | Design the garden — directly design agents / engines / knowledge | Optional |

- **harness-kakashi-creator**: needed by every user. From harness init to adding experts to code review.
- **harness-build**: for users who want to customize the harness directly. Design agent specs, define engine workflows, validate structure.

---

## Quick start: 4 lines is all it takes

```
/harness-kakashi-creator init            ← Open the garden
/harness-kakashi-creator add new agent   ← Plant a flower
/harness-kakashi-creator write code      ← Generate code
/harness-kakashi-creator full review     ← Receive coaching
```

> Note: the skill also accepts Korean triggers (`전체 점검해`, `새 에이전트 추가해`). Both work.

---

## 🐸 Toad Summoning Jutsu (口寄せの術) — Recruit a Sage

> Where Kakashi (the Gardener) **copies techniques (術) with the Sharingan**,
> Naruto (the user) **summons the doctrines (思想) of past masters with the Toad Summoning Jutsu**.

The harness's ultimate technique. Summon a domain master (a *Sage*) and apply their doctrine to your work directly.

**First sage recruited — W. Edwards Deming (the father of QA)**

- The **PDSA cycle** (Plan–Do–**Study**–Act) becomes the harness's **base evaluation system**
- Always-on at the end of every action; specialist evaluations layer on top as follow-ups
- Deming insisted on **PDSA, not PDCA** — that doctrinal precision is preserved in an English canonical reference

**Tutorials & references**:

| Doc | What it covers |
|-----|----------------|
| 📜 [Worldview Mapping](harness/knowledge/lore/naruto-worldview.md) | How Naruto / Kakashi / Sages / Jutsu map 1:1 to harness components |
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
/harness-kakashi-creator init
```

You'll be asked for the harness name and description. The garden gets created:

```
harness/
├── harness.config.json   ← the garden's nameplate
├── agents/tamer.md       ← Gardener Kakashi (built-in)
├── knowledge/            ← sunlight — domain knowledge
├── engine/               ← water channels — workflows
├── docs/                 ← garden journal
└── logs/                 ← activity records
```

### Step 2: The gardener guides you

Once init finishes, Gardener Kakashi appears.
He shows the current garden state and suggests the first expert suited to your project.

```
The garden has opened — MyProject (v1.0.0)

Gardener Kakashi stands at the gate.
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
/harness-kakashi-creator add new agent
```

### Step 4: Receive coaching

Once agents are planted, your code can receive expert review:

```
/harness-kakashi-creator full review
```

Five experts analyze the code in parallel and deliver concrete improvements.

---

## Real case: "I just asked for a pyramid"

A user with limited development experience used Kakashi Harness for the first time.

```
User input              Kakashi Harness response
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Make a pyramid"      → 173 lines of .NET code + build + run
"Run a full review"   → 5 experts in parallel, overall grade B+
"Write a security doc"→ OWASP Top 10 report
```

In the process, the user learned naturally:

| What Kakashi taught | The textbook name |
|---------------------|-------------------|
| "Separate the method" | Single Responsibility Principle (SRP) |
| "Capture with StringWriter" | Testable design |
| "args unused → safe" | Attack-surface minimization |
| "Nice use of collection expressions" | Leveraging modern language features |

**They just asked for code to be written — and got a senior-level review from five developers.**

---

## Usage

### `/harness-kakashi-creator` — use the garden

#### Plant flowers (authoring)

| Command | Description |
|---------|-------------|
| `/harness-kakashi-creator init` | Initialize the garden |
| `/harness-kakashi-creator explain the harness` | Report garden state |
| `/harness-kakashi-creator improve the harness` | 3-axis evaluation + improvement plan |
| `/harness-kakashi-creator update the harness` | Update to match project changes |
| `/harness-kakashi-creator check the eval log` | Log analysis and trends |
| `/harness-kakashi-creator add new agent` | Plant a new flower |
| `/harness-kakashi-creator copy skill` | Activate Sharingan — clone a skill |

#### Make flowers bloom (execution)

| Command | Description |
|---------|-------------|
| `/harness-kakashi-creator full review` | Full review (all agents) |
| `/harness-kakashi-creator review changes` | git-diff-based change review |
| `/harness-kakashi-creator run the harness` | Same as full review |

### `/harness-build` — design the garden (optional install)

An advanced tool for designing and customizing the harness internals.

| Command | Description |
|---------|-------------|
| `/harness-build design an agent` | Design agent spec directly (triggers, eval axes, procedures) |
| `/harness-build write knowledge doc` | Build domain knowledge under `knowledge/` |
| `/harness-build design an engine` | Define a workflow pipeline |
| `/harness-build verify structure` | Check config ↔ file consistency, 3-Layer balance |
| `/harness-build bump version` | Version numbering + history authoring |

**When to use it?**
- If you're happy with the suggestions from `/harness-kakashi-creator add new agent` → you don't need build.
- If you want to **directly define** agent eval axes, severity classification, review procedures → `/harness-build`.

---

## The garden's structure — three layers of soil

Kakashi Harness is made of three layers.

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

| | Claude alone | Kakashi Harness |
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
│       ├── harness-kakashi-creator/          #   Garden-use skill (default)
│       │   ├── SKILL.md
│       │   ├── references/                   #   Reference docs
│       │   └── templates/harness/            #   init templates
│       └── harness-build/                    #   Garden-design skill (optional)
│           └── SKILL.md
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
| **Gardener (Tamer)** | Caretaker | Meta-agent that manages the harness itself |
| **Knowledge** | Sunlight | Domain knowledge the agents reference |
| **Engine** | Water channels | Workflow composing agents into execution |
| **Sharingan** | Copy ability | The power to clone an existing skill by seeing it |

---

## Contributing to skill development

### Add a new agent

1. Write an agent markdown file under `harness/agents/`
2. Register it in the `agents` array in `harness/harness.config.json`
3. If needed, add a workflow under `harness/engine/`

Or run `/harness-build design an agent` for a guided flow.

### Version update

| File | Field |
|------|-------|
| `.claude-plugin/marketplace.json` | `metadata.version`, `plugins[0].version` |
| `plugins/harness-kakashi/.claude-plugin/plugin.json` | `version` |

## License

MIT

---

## 🌟 Constellation

> Open this repository as an Obsidian vault — the graph view lights up. The Star Keeper [[hoshimori]] tends the constellation.

- [[README|🌐 한국어 README]] — Korean entry star
- [[naruto-worldview|🥷 Worldview Mapping]] — Kakashi / Sage / Hoshimori / Chizumori / Sai 1:1 mapping
- [[hoshimori|🌟 Hoshimori (Star Keeper)]] — Obsidian vault constellation keeper
- [[chizumori|🗺️ Chizumori (Map Keeper)]] — harness-view manifests & publishing
- [[sai|🖌️ Sai (Ink Shinobi)]] — design-first executor
- [[zettelkasten-llm-era|📚 Zettelkasten · Wiki-Tag Doctrine]] — Academic basis of the Star Keeper's doctrine
- [[tamer|🧑‍🌾 Gardener Kakashi]] — Meta agent
- [[sage-deming|🐸 Sage Deming]] — PDSA base evaluation
- [[toad-summoning|🐸 Toad Summoning Engine]] — Sage invocation
- [[choujuu-giga|🖌️ Chōjū Giga Engine]] — design-first sync engine
- [[design-first|⚖️ design-first Doctrine]] — Sai's doctrine
- [[pencil-design-locations|🖌️ Pencil Design Locations Canon]] — Owner's knowledge
- [[pdsa-deming.en|📘 PDSA Doctrine (English canon)]]
- [[evaluation-base-pdsa|⚙️ Base Evaluation Operating Rules]]
- [[naruto-harness-story-tutorial.en|📖 Naruto Harness Story Tutorial (EN)]]
- [[pdsa-vs-pdca|📜 PDSA vs PDCA history]]
- [[v1.7.0|📝 v1.7.0 — Sai recruited]]
