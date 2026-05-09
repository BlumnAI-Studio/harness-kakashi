---
title: 펜슬 디자인 위치 정전 — Pencil Design Locations Canon
domain: design
status: canonical
owner: sai
co-owner: chizumori
---

# 🖌️ 펜슬 디자인 위치 정전

이 문서는 **사이(Sai)** 의 단일 정전이며, **치즈모리(Chizumori)** 가 참조하는 부속 지식이다.
펜슬 디자인 파일(.pen)의 위치·구조·운용 규칙을 정의한다.

> **펜슬 디자인의 위치를 잃으면 정전을 잃는다.** 코드만 남고 디자인은 사라진다 — design-first의 가장 흔한 실패 모드.

---

## 1. 위치

| 파일 | 절대 경로 | 역할 |
|------|---------|------|
| `harness-view.pen` | `Home/design/harness-view.pen` | **마을 지도(harness-view) 정전** — 9개 메뉴 페이지 + reusable 사이드바 |

> 향후 .pen 파일이 추가되면 이 표를 갱신한다. 모든 .pen은 `Home/design/` 하위에 둔다.

### 1.1 디렉토리 규약

```
Home/
├── design/                  ← 디자인 정전 디렉토리 (사이 영역)
│   ├── harness-view.pen     ← 마을 지도 정전
│   └── (향후 추가 .pen)
├── harness-view/            ← 정전을 따르는 코드 (치즈모리 영역)
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── data/
│   └── indexes/
└── ...
```

---

## 2. 단일 정전 원칙

### 2.1 .pen은 진실, 코드는 그림자

- `.pen` 파일에 정의된 레이아웃·색상·타이포·컴포넌트는 **진실(canon)** 이다
- `Home/harness-view/**` 코드는 그 진실의 **그림자(shadow)** 이며, drift가 0이 되도록 유지한다
- drift가 발견되면 사이가 디자인 또는 코드를 갱신해 일치시킨다

### 2.2 .pen은 암호화 — 도구로만 접근

- `.pen` 파일은 암호화되어 있어 **Read/Edit/Grep 절대 금지**
- 모든 접근은 `mcp__pencil__*` 도구를 거친다
- 외부 git 도구는 .pen을 binary로 취급 — diff 표시되지 않음

> .pen에 직접 텍스트 편집 시도는 파일 손상 위험이 있다. 항상 Pencil MCP로 작업한다.

---

## 3. harness-view.pen 구조

현재 (v1.7.0 기준) `harness-view.pen` 구조:

### 3.1 캔버스 레이아웃 (절대 좌표)

```
(60, 60)    title-banner             2880×80
(60, 180)   sec1: 🥷 정원
(60, 230)   page/dashboard           1400×800
(1540, 230) page/worldview           1400×800
(60, 1070)  sec2: 🌱 정원지기
(60, 1120)  page/agents              1400×800
(1540, 1120) page/engine             1400×800
(60, 1960)  sec3: ☀️ 햇빛
(60, 2010)  page/knowledge           2880×800 (full-width)
(60, 2850)  sec4: 📜 정원 일지
(60, 2900)  page/docs                1400×800
(1540, 2900) page/logs               1400×800
(60, 3740)  sec5: 🌟 별과 지도
(60, 3790)  page/pdsa                1400×800
(1540, 3790) page/about              1400×800
(3060, 230) sidebar (reusable)       240×800
```

### 3.2 페이지 프레임 명명 규약

- 모든 페이지 프레임은 `page/{menu-id}` 이름
- `menu-id` 는 `Home/harness-view/js/config/menu.js` 의 `id` 와 정확히 일치
- 새 메뉴 추가 시: menu.js와 .pen 둘 다 업데이트 (사이가 .pen, chizumori가 menu.js 까지의 라우팅 검토)

### 3.3 reusable 컴포넌트

| 컴포넌트 | 역할 | 인스턴스 사용 |
|----------|------|--------------|
| `sidebar` | 사이드바 헤더+내비+푸터 | 9개 페이지 모두 (descendants로 active 항목만 오버라이드) |

신규 reusable 승급 기준: **같은 시각 패턴이 3회 이상 반복**되면 reusable로 분리.

---

## 4. 색상 — CSS 변수와의 매칭

`Home/harness-view/css/main.css` 의 변수와 .pen의 hex 색상은 **반드시 일치**해야 한다.

| CSS 변수 | Hex | 용도 |
|----------|-----|------|
| `--bg` | `#fbf7ee` | parchment 배경 |
| `--bg-soft` | `#f3ecd8` | 보조 배경 |
| `--paper` | `#fffdf7` | 카드 배경 |
| `--ink` | `#1f2a37` | 본문 텍스트 |
| `--ink-soft` | `#4b5563` | 보조 텍스트 |
| `--leaf` | `#2f7a4d` | Konoha leaf green (active) |
| `--leaf-soft` | `#b9dfc6` | active 배경 |
| `--flame` | `#d97706` | sage flame |
| `--star` | `#c9a227` | hoshigakure gold |
| `--line` | `#e0d7be` | 경계선 |
| `--link` | `#1d4ed8` | 링크 색 |

> .pen에서 색을 바꾸면 CSS 변수도 바꾼다. 그 반대도 마찬가지. **drift 금지**.

---

## 5. 타이포그래피 매칭

| 요소 | fontSize | fontWeight | 용도 |
|------|---------|-----------|------|
| 페이지 타이틀 | 22 | 700 | 배너 h2 |
| 섹션 헤더 | 13~16 | 700 | panel-title |
| 카드 타이틀 | 14 | 700 | strong |
| 본문 | 13 | 400 | p |
| 메타 | 11~12 | 400 | muted |
| 사이드바 메뉴 | 14 | 400 (active 700) | sb-item |
| 사이드바 섹션 | 10 | 700 (letterSpacing 1) | sb-section |
| stat 숫자 | 28 | 700 | 대시보드 카운트 |

---

## 6. Pencil MCP 도구 안내 (요약)

전체 가이드는 [[sai|사이 에이전트]] §3 참조. 가장 자주 쓰는 호출:

```
get_editor_state include_schema:true       # 시작 시 1회
batch_get filePath nodeIds readDepth       # 노드 구조 확인
batch_design filePath input                # 변경 일괄 실행
snapshot_layout filePath problemsOnly:true # 문제 점검
get_screenshot filePath nodeId             # 시각 검증 (작은 노드 우선)
find_empty_space_on_canvas direction width height padding  # 새 프레임 위치
```

### 6.1 batch_design 핵심 함수

| 함수 | 의미 |
|------|------|
| `I(parent, nodeData)` | Insert — 새 노드 삽입, 자동 ID 반환 |
| `U(id, props)` | Update — 속성 부분 업데이트 |
| `R(id, fullNode)` | Replace — 노드 전체 교체 |
| `C(srcId, parent, overrides)` | Copy — 노드 복사 |
| `M(id, parent, index?)` | Move — 부모 이동 |
| `D(id)` | Delete |
| `G(id, source, prompt)` | Image — 프레임 fill로 이미지 적용 |

> 함수 호출 1줄당 1 ops. 한 batch에 너무 많이 묶지 않는다 — 실패 시 전체 롤백.

---

## 7. drift 점검 체크리스트

사이 호출 시 매번 다음 체크:

- [ ] `Home/design/harness-view.pen` 의 페이지 프레임 명단이 `js/config/menu.js` 의 menu id 와 일치
- [ ] .pen의 색이 `css/main.css` 의 CSS 변수와 일치
- [ ] reusable 사이드바의 메뉴 항목이 menu.js와 일치 (개수·라벨·아이콘)
- [ ] 9개 페이지 모두 `placeholder:false` (작업 미완료 표식 없음)
- [ ] design-debt 라벨이 7일 이상 묵힌 항목 없음

---

## 8. design-debt 라벨 운용

긴급 핫픽스 등으로 **코드가 디자인을 앞서 갈 때**:

1. 코드 변경 PR/커밋 메시지에 명시적 표기:
   ```
   feat(harness-view): md-modal 추가

   design-debt: Home/design/harness-view.pen 갱신 필요
   ```
2. 다음 사이 호출 시 사이가 .pen에 반영
3. 반영 완료 후 design-debt 항목 회수 (다음 커밋 메시지에 "design-debt resolved")

**누적 한계**:
- 7일 이상 미회수 = 정원지기(tamer)에게 자동 경고
- 30일 이상 = 다음 마이너 릴리스 차단

---

## 9. 안티패턴

- ❌ `.pen` 을 Read/Edit/Grep으로 직접 열기 → 손상 위험
- ❌ 코드만 변경하고 .pen 미갱신 → drift 누적, 단일 정전 위반
- ❌ .pen만 변경하고 코드 미반영 → 시각만 새것, 운영은 옛것
- ❌ menu.js와 .pen의 메뉴 id 불일치
- ❌ CSS 변수와 .pen hex 불일치
- ❌ 같은 패턴 4회 이상 인스턴스인데 reusable로 안 만들기

---

## 10. 참조

- [[sai|🖌️ 사이 (묵화 닌자)]] — 정전의 owner
- [[chizumori|🗺️ 치즈모리 (지도지기)]] — co-owner, 매니페스트 갱신 담당
- [[choujuu-giga|🖌️ 초수의화 엔진]] — 정전을 사용하는 워크플로우
- [[design-first|⚖️ design-first 원칙 정전]] — 사상 출처

---

## 🌟 별자리 (Constellation)

- [[sai|🖌️ 사이 (묵화 닌자)]] — owner
- [[chizumori|🗺️ 치즈모리 (지도지기)]] — co-owner
- [[choujuu-giga|🖌️ 초수의화 엔진]]
- [[design-first|⚖️ design-first 원칙]]
- [[naruto-worldview|🥷 세계관 매핑]]
