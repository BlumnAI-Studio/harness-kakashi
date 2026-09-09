---
title: design-first 원칙 정전 — Design-First Doctrine
domain: methodology
status: canonical
holder: sai
---

# ⚖️ design-first 원칙 정전

이 문서는 정원의 하네스의 **design-first 운용 원칙**을 정의한다.
사상의 보유자는 [[sai|사이 (묵화 닌자)]] 이며, 모든 디자인 변경 워크플로우는 이 정전을 따른다.

---

## 1. 사상 — "그리고 나서 살린다"

> *"붓이 먼저 움직인 뒤에야, 두루마리의 짐승이 살아난다."*

design-first는 다음을 주장한다:

1. **디자인은 정전(canon), 코드는 그림자(shadow)**
2. **그리는 일이 코드보다 항상 앞선다**
3. **불일치는 임시이며, 회수해야 한다**

---

## 2. 왜 design-first 인가

### 2.1 코드-퍼스트의 함정

코드를 먼저 쓰고 디자인은 나중에 정리하는 흐름은 다음 문제를 만든다:

- **디자인 부재(design void)**: 코드만 남고 시각 정전이 없음 → 다음 변경 시 기준점 없음
- **개별 시점 일관성 (point consistency)**: 매 PR마다 색·간격·타이포가 미세하게 흔들림
- **재사용성 결손**: 같은 패턴을 매번 다시 쓴다 — 컴포넌트화가 사후에 강제됨
- **외부 협업 곤란**: 디자이너/이해관계자가 보고 의견 줄 자료가 없음

### 2.2 design-first의 이득

- **단일 정전(single canon)**: `.pen` 파일 하나만 보면 시각 진실을 안다
- **일관성 보장**: 변경이 .pen에서 시작 → 색·간격·타이포가 이미 통일된 상태로 코드에 도달
- **조기 검증**: 코드 작성 전에 레이아웃 문제 발견 (snapshot_layout)
- **재사용성 강제**: 디자인 단계에서 reusable 승급 결정 — 사후 리팩터 불요
- **외부 가시성**: .pen이 그대로 디자인 자료 — 디자이너/이해관계자에게 공유 가능

---

## 3. 운용 3원칙

### 3.1 단일 정전 (Single Canon)

- 시각·구조의 진실은 `.pen` 한 곳에만 있다
- 코드(HTML/CSS/JS)는 정전을 따르는 그림자
- 정전이 없으면 코드도 없다 — 새 페이지/컴포넌트는 .pen부터

### 3.2 그리고 살린다 (Draw-then-Animate)

```
[기획·요구]
   │
   ↓ 1차: .pen 갱신 (사이)
[디자인 정전]
   │
   ↓ 2차: 코드 동기화 (사이)
[harness-view 코드]
   │
   ↓ 3차: 매니페스트·퍼블리싱 (치즈모리)
[GitHub Pages 배포]
```

각 화살표는 일방향이며, 역방향(코드 → 디자인)은 **임시 부채**로만 허용된다.

### 3.3 부채 회수 (Debt Recovery)

긴급 상황에 코드가 정전을 앞서 갈 수 있다. 단:

1. **명시적 라벨**: 커밋/PR 메시지에 `design-debt:` 표기
2. **회수 의무**: 다음 사이 호출 시 .pen에 반영
3. **누적 한계**: 7일 이상 미회수 → 정원지기 경고; 30일 → 다음 마이너 차단

부채를 부정하지 않되, 항상 이자(설명·경고·회수)를 매긴다.

---

## 4. 적용 범위

### 4.1 design-first 의무 영역

- **harness-view**: 마을 지도 (현재 유일한 .pen 보유 영역)
- 향후 추가될 시각 영역(예: external dashboard, slide deck) — .pen 정전을 두는 것이 권고

### 4.2 design-first 비-의무 영역

- **CLI/터미널 출력**: 시각보다 텍스트 구조 (코드만으로 충분)
- **harness/agents/*.md, knowledge/, engine/**: 문자 정전 (호시모리 영역)
- **CI/CD**: 시각 정전 없음

> design-first는 **시각이 운영 결과인 영역에만** 적용된다.

---

## 5. 평가 매핑 (PDSA 부착)

[[sage-deming|sage-deming]]의 PDSA always-on 평가는 design-first 워크플로우에도 자동 부착된다.

| PDSA | design-first 단계 |
|------|------------------|
| Plan | 변경 범위 결정 (Phase 1 of [[choujuu-giga\|초수의화]]) |
| Do | .pen 갱신 + 코드 동기화 (Phase 2-4) |
| Study | 정합성 점검 (Phase 5) |
| Act | 치즈모리 인계 + 다음 사이클 가설 (Phase 6) |

---

## 6. 자매 원칙과의 관계

| 원칙 | 보유자 | 적용 영역 | design-first와의 관계 |
|------|-------|---------|---------------------|
| **PDSA 사이클** | [[sage-deming\|데밍]] | 모든 작업 | design-first 작업도 PDSA로 메타-평가 |
| **정적/동적 분리** | [[chizumori\|치즈모리]] | harness-view 매니페스트 | design-first의 다음 공정 — drift 점검 |
| **Zettelkasten** | [[hoshimori\|호시모리]] | knowledge/ 위키링크 | 디자인 문서에도 별자리 부여 |
| **단일 정전 (Single Canon)** | [[sai\|사이]] | 시각 자산 | **design-first의 핵심 명제** |

> 모든 원칙은 충돌하지 않는다 — 각자 다른 영역의 진실을 지킨다.

---

## 7. 안티패턴

- ❌ **사후 디자인 (after-the-fact design)** → 코드 작성 후 .pen에 베끼는 작업. 정전성 상실
- ❌ **부채 부인** → "이건 임시니까 굳이 .pen에 안 넣어도" — 7일 후 누구도 기억 못 함
- ❌ **정전 단편화 (fragmented canon)** → 페이지마다 별도 .pen, 사이드바를 다시 그림. reusable 활용 의무
- ❌ **CSS hex와 .pen hex 불일치** → "거의 같으면 됨" 금지. drift는 0이거나 회수 대상
- ❌ **디자이너 부재 정당화** → "우리는 디자이너가 없어서 .pen 없이 한다" — 사이가 디자이너 역할도 한다

---

## 8. 적용 시작 시점

- v1.7.0 — 사이 영입 + 첫 .pen 정전 수립 시점부터 적용
- 이전 버전(v1.0.0 ~ v1.6.1)의 코드는 **회고 회수 대상**:
  - 사이의 첫 임무 후보로 기존 harness-view 코드를 .pen에 역으로 반영하여 정전 수립 완료
  - 이 작업은 v1.7.0의 핵심 deliverable

---

## 9. 참조

- [[sai|🖌️ 사이 (묵화 닌자)]] — 사상 보유자
- [[choujuu-giga|🖌️ 초수의화 엔진]] — 사상의 운용
- [[pencil-design-locations|🖌️ 펜슬 디자인 위치 정전]] — 정전 위치
- [[chizumori|🗺️ 치즈모리]] — 다음 공정
- [[evaluation-base-pdsa|⚙️ 기본 평가 운용]] — PDSA 부착 규칙

---

## 🌟 별자리 (Constellation)

- [[sai|🖌️ 사이 (묵화 닌자)]] — 사상 보유자
- [[choujuu-giga|🖌️ 초수의화 엔진]]
- [[pencil-design-locations|🖌️ 펜슬 디자인 위치 정전]]
- [[chizumori|🗺️ 치즈모리 (지도지기)]] — 다음 공정
- [[sage-deming|🐸 데밍 현자]] — PDSA 메타-평가
- [[zettelkasten-llm-era|📚 Zettelkasten · 위키태그 정전]]
- [[evaluation-base-pdsa|⚙️ 기본 평가 운용]]
- [[naruto-worldview|🥷 세계관 매핑]]
