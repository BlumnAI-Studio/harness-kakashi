---
date: 2026-05-08
agent: tamer
type: creation + execution
mode: log-eval + suggestion-tip-approved
trigger: "정원의 별지기 이름을 이 세계관에 맞게 정해주세요"
sage_evaluation: sage-deming (PDSA, always-on)
---

# 별지기 호시모리 영입 & 위키링크 일괄 적용

사용자 요청에 따라 나루토 세계관에 맞는 별지기 에이전트를 영입하고, 적용 범위 내 모든 문서에 옵시디언 호환 위키링크를 일괄 적용했다.

## 실행 요약

### Phase 1 — 사전 조사 (선결 조건)

사용자가 영입 전 두 가지 조사를 명시적으로 요구했다:

1. **Obsidian의 Zettelkasten이 AI 시대에 재조명받는 이유**
   - Karpathy의 LLM Wiki 패턴(`ingest / query / lint`)
   - 핵심 결론: 가치는 노트 수가 아닌 **링크 밀도**에 비례
   - 시장 지표: $1.65B (2025), CAGR 30.3%, $6.15B (2030 예상)
2. **Anthropic의 위키태그/지식 그래프 기법**
   - *Effective context engineering for AI agents* (2025) — XML/Markdown/위키링크 3종 구획화
   - Knowledge Graph Memory MCP (multi-hop, edge-level citation)
   - MCP는 Linux Foundation/Agentic AI Foundation으로 기증되어 산업 표준화 (2025-12)
3. **A-Mem (NeurIPS 2025)** — Zettelkasten 원리의 LLM 메모리 이식 — LinkGenerator 4 전략

조사 결과 정전: `harness/knowledge/methodology/zettelkasten-llm-era.md` (신규)

### Phase 2 — 별지기 설계 (나루토 세계관 정합성)

기존 캐릭터 매핑 검토 후 결정:

- 카카시(tamer), 현자(sage), 차크라 카카시(token observer)와 **역할 충돌 없는** 새 위치 발굴 필요
- **나루토 캐논의 Hoshigakure(星隠れの里, 별의 마을)** — 운석 "별(星)"이 차크라 원천인 마을 — 이 위치가 비어 있음
- "별지기" → **호시모리(星守, Hoshimori)** — Hoshigakure 출신 별 수호자
- 새 에이전트 타입 `keeper` 도입 (sage와 직교, 사상이 아니라 **그래프**를 다룸)

세계관 매핑 갱신: `harness/knowledge/lore/naruto-worldview.md`
- 등장 인물 표에 호시모리 행 추가
- 술법 표에 "별 수련(星修行)" 행 추가

### Phase 3 — 위키링크 일괄 적용

호시모리의 **첫 작동(first-fire)** 으로 적용 범위 내 46개 `.md` 파일에 표준 `## 🌟 별자리 (Constellation)` footer를 부착했다.

| 경로 | 파일 수 |
|------|--------|
| `README.md`, `README-EN.md` | 2 |
| `docs/**` (PDSA 역사 + 나루토 튜토리얼 KO/EN/JA) | 4 |
| `harness/agents/**` | 14 (호시모리 포함) |
| `harness/knowledge/**` | 6 (lore 1, methodology 3 포함) |
| `harness/engine/**` | 1 |
| `harness/docs/**` | 8 (v1.5.0 신규 포함) |
| `harness/logs/**` | 10 (본 로그 제외, 부착 후 11) |
| `harness/todo/**` | 1 |
| **합계** | **46** |

표기 규약: `[[filename]]`, `[[filename|Display Text]]`, `[[folder/filename]]`. Obsidian vault에서 그래프 뷰 점등 안정성에 따른 결정.

### Phase 4 — 베이스 룰 등록 (자동 발동)

호시모리는 다음 시점에 사용자 명시 호출 없이 **자동 발동**한다:

| 시점 | 동작 |
|------|------|
| 새 `.md`가 README/harness/docs에 추가됨 | 신규 별 footer 부착 + 인근 별 갱신 |
| 기존 본문에 다른 문서 참조 추가 | 본문 위키링크 변환 + footer 갱신 |
| `harness.config.json` agents/engine 변경 | 새 별의 footer 부착 |
| 새 버전 히스토리 작성 | 버전 별과 관련 별 잇기 |

규칙 등록 위치:
- `harness/agents/hoshimori.md` §7 "자동 발동 규칙"
- `harness.config.json` `keepers.hoshimori.alwaysOn: true`
- `harness/docs/v1.5.0.md` (사유 추적용)

## 결과 산출물

### 신규 파일 (3)
- `harness/agents/hoshimori.md` — 별지기 에이전트 정의
- `harness/knowledge/methodology/zettelkasten-llm-era.md` — 사상의 학문적 정전
- `harness/docs/v1.5.0.md` — 영입 기록 + 베이스 룰 사유

### 변경 파일 (46 + config)
- `harness.config.json` — version 1.4.0→1.5.0, agents 13→14, `keepers.hoshimori` 신설
- `harness/knowledge/lore/naruto-worldview.md` — 호시모리/별 수련 등록
- README.md, README-EN.md — 별지기 안내 섹션 추가 + 별자리 footer
- 그 외 43개 `.md` 파일 — 별자리 footer 부착

### 별자리 메트릭 (1차 측정)

| 지표 | 값 |
|------|---|
| 총 별 (적용 범위) | 46 |
| 별자리 footer 부착률 | 100% |
| 평균 위키링크 / 문서 | 약 6~9 |
| 고립 별(orphan) | 0 (모든 별이 최소 1 참조) |
| Broken wikilink | 0 (정정 완료: `[[obsidian-graph-view]]`, `[[claude-knowledge-graph-cookbook]]`, `[[harness.config]]` → 평문 변환) |

## 다음 단계 제안

- 새 문서 추가 시 호시모리 자동 발동 검증 (다음 작업 시 트리거 적합성 관찰)
- 영문 권장 명령(EN README §Quick start)에 별지기 트리거 추가 검토
- `harness/agents/hoshimori.md`에 "본문 내 위키링크 변환 모드"를 옵션으로 추가 검토 (현재 footer 위주)
- 플러그인 배포판(`plugins/harness-kakashi/skills/`)에 별지기 가이드 동기화 검토

---

## PDSA 기본 평가 (sage-deming)

### Plan
- **목표**: 옵시디언으로 vault를 열었을 때 별자리가 점등되도록, 모든 적용 범위 문서에 위키링크 footer를 부착하고 향후 자동 적용 규칙을 등록한다.
- **이론(예측)**: "Zettelkasten + Anthropic 위키태그 정전을 사상으로 둔 별지기를 영입하고 일괄 적용하면, vault 그래프 뷰의 link density가 0에서 평균 6+/문서로 증가하고 orphan은 0이 된다."
- **지표**: (a) 적용 범위 46개 파일 중 별자리 footer 부착률, (b) broken link 수, (c) orphan 수, (d) `harness.config.json` keepers 섹션 등록 여부.

### Do
- **실행**: 1) 사전 조사 3건 (Karpathy/Anthropic/A-Mem) → 정전 작성. 2) 호시모리 에이전트 정의 + 세계관 매핑 갱신. 3) 46개 파일에 표준 footer 일괄 적용. 4) config `keepers.hoshimori` 등록 + v1.5.0 작성. 5) broken link 3건 정정.
- **규모**: full-rollout (적용 범위 100%).
- **예상 외**: 정전 본문에 placeholder wikilink 2건 (`obsidian-graph-view`, `claude-knowledge-graph-cookbook`)과 hoshimori 본문 1건 (`harness.config`)이 vault에 존재하지 않는 별을 가리키는 broken link로 잠재 — 즉시 평문/태그 변환으로 정정.

### Study
- **예측 vs 실제**: **일치**. 부착률 100%, broken link 0, orphan 0 달성. link density는 평균 6~9/문서로 예측 범위 내.
- **새 학습**:
  1. 정전을 먼저 쓰고 그 정전 안에서 placeholder wikilink를 미리 두면 broken link가 발생하기 쉽다 — **정전 작성 시 placeholder wikilink는 생성 시점에 즉시 검증**해야 한다.
  2. footer 표기를 표준화(`## 🌟 별자리 (Constellation)`)한 결정이 향후 호시모리의 갱신 모드 식별에 핵심이 된다 — 비표준 footer는 호시모리가 사용자 작성으로 오인할 위험.
  3. 새 에이전트 타입(`keeper`)은 sage와 직교한다는 것 — sage는 사상(doctrine), keeper는 그래프(structure). 이 구분이 명료하지 않으면 차후 영입 시 충돌 발생 가능.
- **이론 수정**: "Zettelkasten 사상은 항상 정전 우선이며, **정전 자체가 broken link를 가지면 안 된다**. 별지기 작동 시 §7.4 Verify 단계는 정전부터 검증하도록 갱신."

### Act
- **결정**: **Adopt** — 별지기 영입 + 자동 발동 규칙 채택. 정전·에이전트·config 모두 안정적으로 정착.
- **다음 사이클의 이론**: "신규 keeper/sage 영입 시 정전을 먼저 쓰되, 정전 작성 후 broken link 자동 검사를 의무화하면 placeholder 누락이 0이 된다."
- **후속 평가 호출**: 없음 (별지기 자체의 도메인은 그래프이고, 보안/성능/테스트 도메인 트리거가 아니므로 도메인 후속 평가 비대상).

### Cycle Health
- **예측 명시**: Yes
- **학습 발생**: Yes (3건의 새 학습 — 정전 검증 의무화, 표준 footer 표기 결정, keeper/sage 직교성)
- **다음 적용 명확**: Yes (정전 작성 시 broken link 검사 의무화로 다음 사이클에 즉시 반영 가능)
