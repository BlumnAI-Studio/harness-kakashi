---
date: 2026-05-09T00:00:00Z
agent: tamer
type: improvement
mode: log-eval
trigger: "/harness-kakashi-creator 하네스뷰 펜슬디자인 위치를 담당자 지식저장.. 추후 하네스뷰는 펜슬뷰를 통해 디자인 개선이 있을 예정으로 design-fitst 입니다. 나루토 세계관이 맞는 Agent와 Flow 하네스업데이트해죠.."
sage_evaluation:
  pdsa:
    plan: "사이(Sai) 영입 + 초수의화(超獸偽畫) 엔진 + design-first 원칙 도입으로 펜슬 디자인을 단일 정전화한다"
    do: "agents/sai.md, engine/choujuu-giga.md, knowledge/design/pencil-design-locations.md, knowledge/methodology/design-first.md 신규 생성; naruto-worldview.md, chizumori.md, harness.config.json 갱신; v1.7.0 영입 기록 작성"
    study: "디자인-코드 정합성 첫 측정 = Aligned (drift 0); 단일 정전 준수 = Clean; 컴포넌트 재사용성 = Reusable (사이드바 1개로 9개 페이지 커버); 사이의 직속 다음 공정 = 치즈모리로 명시화하여 디자인 라인 정의됨"
    act: "v1.7.x 후속 — 사이가 menu.js drift 자동 점검; v1.8.0 후보 — .pen export 기능; 회고 회수 임무 — v1.6.x 코드 패턴을 .pen에 역으로 반영"
---

# 사이 영입 + design-first 원칙 도입 (v1.7.0)

## 실행 요약

사용자 요청 분석:
1. **하네스뷰 펜슬디자인 위치를 담당자 지식 저장** → 펜슬 디자인의 단일 정전 위치(`Home/design/harness-view.pen`)를 담당자 지식 문서로 정전화
2. **design-first 원칙 명문화** → harness-view 개선이 펜슬뷰를 통해 흐르는 운영 원칙 수립
3. **나루토 세계관 Agent + Flow 추가** → 디자인 담당 닌자와 워크플로우 영입

세계관 분석 결과 — 사이(サイ)가 명백한 적임자:
- Konohagakure 출신, 묵화 술법 사용자
- 시그너처 술법 **超獸偽畫(Chōjū Giga, 초수의화)** = "두루마리 그림이 살아 움직이는 술법"
- 정전을 그리고(=.pen), 살아나게 하는(=harness-view 코드) 흐름의 1:1 메타포

치즈모리(지도지기)와의 관계 분리도 명확:
- 사이 = 그린다 (시각 정전 + 코드 동기화)
- 치즈모리 = 보여준다 (매니페스트 + 퍼블리싱)

## 결과

### 신규 산출물
- `harness/agents/sai.md` — 묵화 닌자 사이 (specialist, design 도메인)
- `harness/engine/choujuu-giga.md` — 6-Phase design-first sync 엔진
- `harness/knowledge/design/pencil-design-locations.md` — 펜슬 디자인 위치 정전 (사이 owner / 치즈모리 co-owner)
- `harness/knowledge/methodology/design-first.md` — design-first 원칙 정전
- `harness/docs/v1.7.0.md` — 영입 기록

### 갱신 산출물
- `harness/harness.config.json`:
  - version: 1.6.1 → 1.7.0
  - agents 배열에 `sai` 추가 (총 16명)
  - engine 배열에 `choujuu-giga` 추가 (총 2개)
  - 신규 `design` 블록: principle, owner(sai), coOwner(chizumori), canonRoot, files, viewMirror, engine, doctrineDoc, locationsDoc, debtPolicy
  - lastUpdated: 2026-05-09
- `harness/knowledge/lore/naruto-worldview.md`:
  - 인물 표에 사이 row 추가
  - 술법 표에 超獸偽畫 row 추가
  - 별자리 4개 신규 위키링크 추가
- `harness/agents/chizumori.md`:
  - §7에 사이 row + §7.1 디자인 라인 흐름도 추가
  - §9 참조 + 별자리에 사이/초수의화/design-first/pencil-design-locations 추가

### 정원 구조 변화
- agents/ : 15 → 16 (sai 추가)
- engine/ : 1 → 2 (choujuu-giga 추가)
- knowledge/design/ : 신규 디렉토리 (1개 문서)
- knowledge/methodology/ : 3 → 4 (design-first 추가)
- 운영 원칙 추가: design-first (PDSA·정적/동적분리·Zettelkasten과 동급)

## 평가

### 정원지기 3축
- **워크플로우 개선도**: **A** — 시각 정전 부재(코드만으로 추론) → 단일 정전 도입(.pen). PR마다 흔들리던 일관성이 디자인 단계에서 보장됨
- **Claude 스킬 활용도**: **5/5** — Pencil MCP(이번 세션에서 9-frame 디자인 검증), Read/Write/Edit, harness-kakashi-creator 협업
- **하네스 성숙도**: **L5 유지** — knowledge(Layer 1)/agents(Layer 2)/engine(Layer 3) 3계층 모두 갱신, 평가축 신설(사이 3축)

### 단일 정전 vs Zettelkasten 충돌 점검
- 호시모리의 Zettelkasten은 **문자 정전(별자리)**, 사이의 single canon은 **시각 정전(.pen)** — 영역이 다르다
- 디자인 문서에도 별자리(위키링크) 부착하여 두 원칙 모두 만족시켰다 (sai.md, choujuu-giga.md, pencil-design-locations.md, design-first.md 모두 §🌟 별자리 보유)

### 표준 스킬 오염 점검
- 새 트리거(초수의화·choujuu-giga·design-first sync 등)는 모두 `harness/agents/sai.md`, `harness/engine/choujuu-giga.md` frontmatter에 등록 — 표준 SKILL.md 미오염 ✅
- 자동 발견(scan-based)으로 매칭됨 — skill-separation 원칙 준수

## 다음 단계 제안

1. **사이의 첫 임무 — 회고 회수**: v1.6.x 코드 패턴(md-modal, 사이드바 active 표시 등)을 .pen 정전에 역으로 반영. design-debt 0 시점 확립
2. **drift 점검 자동화**: menu.js의 menu id가 .pen의 page/{id} 와 일치하는지 자동 검사 (사이 호출 시 Phase 0에서 수행하도록 엔진 보강)
3. **CSS 변수 동기화**: `Home/harness-view/css/main.css` 의 hex 변수와 .pen 노드의 fill/stroke hex가 매칭되는지 점검 스크립트 (치즈모리의 sync-view에 hook 추가 검토)
4. **버전 태그 + 퍼블리싱**: v1.7.0 영입 기록을 `doc-v1.7.0` 태그로 마킹 → 치즈모리가 GitHub Pages 배포

## PDSA 다음 사이클 가설

- **가설**: design-first 원칙이 도입되면, 신규 페이지·컴포넌트 추가 시 PR 회수율(시각 일관성 회귀 PR 수 / 전체 PR 수)이 감소한다
- **측정 방법**: v1.7.0 시점부터 6개월 — 시각 회귀로 인한 follow-up PR 카운트 vs v1.5.0~v1.6.1 평균
- **검증 시점**: v1.8.x 또는 v1.9.x 영입 기록에서 회고
