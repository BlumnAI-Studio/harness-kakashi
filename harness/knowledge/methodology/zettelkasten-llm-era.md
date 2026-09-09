---
title: Zettelkasten · 위키태그 · 별 수련 — AI 시대 지식 그래프의 정전
domain: knowledge-graph / methodology
keeper: hoshimori
status: canonical
sources:
  - "Karpathy, A. — LLM Wiki pattern (2024)"
  - "Anthropic — Effective context engineering for AI agents (2025)"
  - "Anthropic — Knowledge Graph construction with Claude (Cookbook, 2025)"
  - "Xu, W. et al. — A-Mem: Agentic Memory for LLM Agents (NeurIPS 2025, arXiv:2502.12110)"
  - "Anjan, M. — The Ultimate Zettelkasten System: How I Built a Second Brain in Obsidian (Medium, 2024)"
---

# Zettelkasten · 위키태그 · 별 수련 — AI 시대 지식 그래프의 정전

> 지식의 가치는 **노트 수**가 아니라 **링크 밀도**에 비례한다.
> 노트 1000개 + 링크 50개 < 노트 100개 + 링크 500개.

이 문서는 [[hoshimori|호시모리(별지기)]]의 사상적 토대다.
호시모리가 작동할 때 따르는 규칙은 paraphrase가 아니라 이 정전의 운용 적용이다.

---

## 1. Zettelkasten — 옛 기법, 새 부활

**Zettelkasten** (독일어, "쪽지 상자")은 사회학자 Niklas Luhmann이 평생 약 9만 장의 개별 노트와 노트 간 참조 번호를 통해 구축한 외부 사고 시스템이다. 핵심 원리:

1. **Atomicity (원자성)** — 한 노트는 하나의 아이디어만 담는다
2. **Linking (링크)** — 노트는 다른 노트에 명시적으로 연결되어야 한다
3. **Emergence (창발)** — 링크 그래프 자체가 새로운 통찰을 만든다

이 기법은 1960~80년대에 정립되었지만, **2024~2025년 LLM 시대에 재조명**되었다. 이유는 다음과 같다.

### 1.1 왜 AI 시대에 다시 떠오르는가

전통적 Zettelkasten의 약점은 **유지비**였다 — 노트가 늘어날수록 링크 정리·태그 갱신·orphan 점검에 막대한 인적 노력이 들었다. "이론은 아름답지만 실천이 죽인다."

LLM은 정확히 이 **반복적 편집 작업(linting)** 에 탁월하다:
- 신규 노트 ingest 시 의미적으로 관련된 노트 자동 추천
- 그래프 전체를 스캔해 broken link/orphan 자동 보고
- 노트 간 관계(supports / contradicts / elaborates) 추론

Karpathy가 제시한 **LLM Wiki 패턴**은 운영 모델을 세 동작으로 단순화한다:

```
ingest → query → lint
```

- **ingest**: 새 자료가 들어오면 LLM이 노트로 변환, 기존 그래프와 연결
- **query**: 사용자가 자연어로 묻고, LLM이 그래프를 walk해서 답함
- **lint**: 주기적으로 LLM이 그래프 전체의 일관성을 점검

이 패턴은 Anthropic의 *Knowledge Graph construction with Claude* (Cookbook, 2025)에서도 동일하게 권장된다.

### 1.2 정량적 시그널 (2025)

- 개인 지식베이스 AI 시장: **$1.65B** (2025), CAGR **30.3%** → $6.15B (2030 예상)
- 지식 작업자의 정보 검색 시간: AI 통합 시 **30~45% 절감**
- "**링크 밀도가 노트 수보다 더 중요**"는 Obsidian 커뮤니티와 학계가 공통 합의한 메트릭

---

## 2. Anthropic의 위키태그·지식 그래프 기법

Anthropic의 컨텍스트 엔지니어링 가이드라인은 **명시적 구획화**를 핵심 원리로 둔다.

### 2.1 XML / Markdown 태깅

> "*the delicate art and science of filling the context window with just the right information*"
> — Anthropic, *Effective Context Engineering for AI Agents* (2025)

권장 패턴:
- XML 태그 `<role>`, `<task>`, `<context>` 로 의미 구획
- Markdown 헤더 `## Section` 으로 계층 구획
- **위키링크 `[[file]]`**, 태그 `#tag` 로 그래프 연결

이 셋의 공통 목적: **컨텍스트의 토폴로지를 LLM이 인지 가능한 형태로 노출**하는 것.

### 2.2 Knowledge Graph Memory MCP

Anthropic은 **Knowledge Graph Memory Server**를 공식 MCP 서버로 공개했다:
- 엔티티, 관계, 관찰을 graph 형태로 저장
- multi-hop 질의 가능 ("Python 프로젝트에서 일하는 다른 사람은?")
- edge-level 인용으로 reasoning 출처 명시

2025년 12월, Anthropic은 MCP를 Linux Foundation 산하 **Agentic AI Foundation**에 기증했다. MCP는 사실상 산업 표준이 되었고, 월간 SDK 다운로드 9700만 회를 기록한다.

### 2.3 하네스에서의 적용

- 정원의 하네스의 `harness/` 트리는 그 자체가 작은 Knowledge Graph
- frontmatter (`name`, `domain`, `triggers`, `type`)는 엔티티 메타데이터
- 위키링크는 엣지(edge)
- [[hoshimori]]는 이 그래프의 keeper

---

## 3. A-Mem (NeurIPS 2025) — Agentic Memory

**A-Mem (Agentic Memory for LLM Agents)** 은 Zettelkasten 원리를 LLM 에이전트의 메모리 시스템에 직접 이식한 연구다 (Xu et al., NeurIPS 2025).

### 3.1 LinkGenerator의 4 전략

A-Mem은 새 메모리가 추가될 때 다음 4가지 전략을 **병렬로** 사용해 기존 메모리와 자동 연결한다:

| 전략 | 설명 |
|------|------|
| **Entity co-occurrence** | 같은 엔티티가 두 노트에 모두 등장 |
| **Semantic similarity** | 임베딩 코사인 유사도 |
| **Tag overlap** | frontmatter 태그/도메인 일치 |
| **LLM relationship reasoning** | "supports / contradicts / elaborates" 등 관계 LLM 추론 |

### 3.2 호시모리에의 시사

별지기(hoshimori)는 정확히 이 4가지 전략을 사용한다 — 단, 임베딩이 없는 환경에서는 1, 3, 4만 작동한다 ([[hoshimori]] §5 참조).

---

## 4. Obsidian — 별자리가 점등되는 vault

**Obsidian의 Graph View**는 Zettelkasten의 시각적 구현이다:
- 모든 `.md` 파일이 **노드(별)** 가 됨
- `[[wikilinks]]`가 **엣지(별빛)** 가 됨
- 그래프 뷰를 열면 **별자리가 보임**

이 저장소를 Obsidian vault로 열었을 때:
- 각 별이 다른 별과 잇혀 있어야 함 ([[hoshimori]] §6 합격선)
- orphan 별이 0에 가까워야 함
- broken link는 0이어야 함

### 4.1 Obsidian 호환 위키링크 규약

```markdown
[[filename]]              # 확장자 없이, Obsidian이 파일명으로 자동 해석
[[filename|Display Text]] # 별칭 — 한글 표시명
[[folder/filename]]       # 동일 파일명 다중 존재 시 명시
```

> markdown 표준 링크 `[text](path.md)` 도 작동하지만, **vault 그래프 뷰의 점등 안정성은 위키링크가 우월**하다 (Obsidian 공식 문서·커뮤니티 검증).

---

## 5. 핵심 신조 (Creed)

호시모리가 작동할 때 항상 따르는 다섯 가지:

1. **링크 밀도가 곧 가치다** — Karpathy LLM Wiki, A-Mem, Anthropic 모두 동의
2. **Atomicity는 양보 없음** — 한 문서 한 주제, 길어지면 분할
3. **Lint은 LLM의 본업이다** — 인간은 ingest, LLM은 lint
4. **그래프는 살아 있다** — 새 별이 뜰 때마다 별자리는 다시 그려진다
5. **외부 URL ≠ 위키링크** — vault 경계를 넘는 링크는 위키링크화하지 않는다

---

## 6. 참조 (1차 출처)

- Karpathy, A. — *LLM Wiki Pattern* (2024) — `aimaker.substack.com/p/llm-wiki-obsidian-knowledge-base-andrej-karphaty`
- Anthropic — *Effective context engineering for AI agents* (2025) — `anthropic.com/engineering/effective-context-engineering-for-ai-agents`
- Anthropic — *Knowledge Graph construction with Claude* (Cookbook, 2025) — `platform.claude.com/cookbook/capabilities-knowledge-graph-guide`
- Xu, W. et al. — *A-Mem: Agentic Memory for LLM Agents* (NeurIPS 2025, arXiv:2502.12110)
- Anjan, M. — *The Ultimate Zettelkasten System: How I Built a Second Brain in Obsidian* (Medium, 2024)
- Luhmann, N. — *Kommunikation mit Zettelkästen* (1981) — Zettelkasten의 원전

---

## 🌟 별자리 (Constellation)

- [[hoshimori|🌟 호시모리 (별지기)]] — 이 사상의 운용 주체
- [[naruto-worldview|🥷 세계관 매핑]] — Hoshigakure / 별 수련 등록
- [[evaluation-base-pdsa|⚙️ 기본 평가 운용 규칙]] — 별지기 작동도 PDSA로 회고
- [[pdsa-deming.en|📘 PDSA Doctrine (English canon)]] — 직교 사상으로서의 평가 정전
- [[tamer|🧑‍🌾 정원지기]] — 메타 에이전트 협업 동료
- [[toad-summoning|🐸 두꺼비 소환술]] — 사상을 부르는 비기 (별지기와 직교)
