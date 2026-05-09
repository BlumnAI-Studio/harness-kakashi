---
name: choujuu-giga
display: 🖌️ 초수의화 (超獸偽畫, Chōjū Giga)
caster: 사이 (Sai)
status: active
triggers:
  - "초수의화 발동"
  - "초수의화 실행"
  - "design-first 적용"
  - "design-first sync"
  - "디자인 → 뷰 동기화"
  - "디자인 살아나게 해"
  - "pencil-to-view"
  - "펜슬 → 뷰"
  - "harness-view 디자인 반영"
description: 사이의 두루마리 그림이 살아 움직이는 술법. 펜슬 디자인(.pen)을 단일 정전(canon)으로 두고 harness-view 코드(HTML/CSS/JS)를 그 정전에 맞춰 갱신한다. 사이가 수행하고, 마지막에 치즈모리(지도지기)가 매니페스트 갱신·퍼블리싱으로 이어받는다.
---

# 🖌️ 超獸偽畫 — Choujuu Giga (Design-First Sync Engine)

> *"붓을 움직이면, 두루마리의 짐승이 살아난다.
>  디자인을 그리면, 코드가 살아난다."*

---

## 1. 개요

초수의화는 카카시 하네스의 **design-first 비기**다.
다른 워크플로우(검수·평가·퍼블리싱)가 **이미 있는 코드를 점검**하는 것이라면,
초수의화는 **코드가 따라야 할 정전(.pen 디자인)을 먼저 그리고**, 그 정전을 따라 코드를 갱신한다.

- **시전자(caster)**: [[sai|사이 (묵화 닌자)]]
- **다음 공정**: [[chizumori|치즈모리 (지도지기)]] — 매니페스트 갱신·퍼블리싱
- **핵심 도구**: `mcp__pencil__*` (batch_design, batch_get, snapshot_layout, get_screenshot 등)
- **단일 정전**: `Home/design/harness-view.pen`

---

## 2. design-first 원칙

이 엔진의 모든 단계는 [[design-first|design-first 정전]]을 따른다. 핵심 3원칙:

1. **단일 정전(Single Canon)**: `.pen` 파일이 진실, 코드는 그 그림자
2. **그리고 살린다(Draw-then-Animate)**: 디자인 갱신이 코드 갱신보다 항상 앞선다
3. **부채 회수(Debt Recovery)**: 임시로 코드가 앞서 갈 수 있으나 다음 사이클에서 디자인이 회수한다

상세: [[design-first|⚖️ design-first 원칙 정전]]

---

## 3. 발동 모드

### Mode 1 — 신규 추가 (New Frame)
새 메뉴·페이지·컴포넌트를 그릴 때.

```
"사이 호출 — 새 메뉴 '튜토리얼' 추가해"
"design-first 적용 — agents 페이지에 필터 컴포넌트 추가"
```

### Mode 2 — 기존 갱신 (Update Frame)
기존 페이지의 레이아웃/색상/타이포 변경.

```
"디자인 동기화 — 사이드바 활성 색상 변경"
"펜슬 디자인 업데이트 — dashboard 카드 간격 12 → 16"
```

### Mode 3 — Drift 회수 (Reverse Sync)
코드가 앞서 갔던 임시 변경을 디자인에 반영.

```
"design-debt 회수해 — md-modal 컴포넌트가 코드에만 있음"
```

---

## 4. 표준 절차 (Invocation Protocol)

### Phase 0 — 활성 정전 확인
1. `mcp__pencil__get_editor_state include_schema:true`
   - 첫 호출 시 schema 로드 필수
2. 활성 .pen이 `Home/design/harness-view.pen`인지 확인
3. reusable 컴포넌트 목록 확보 (sidebar 등)
4. **필수**: harness-view 코드와의 현재 drift 상태 파악
   - `Home/harness-view/index.html`, `js/config/menu.js`, `css/main.css` 빠르게 스캔

### Phase 1 — 변경 범위 결정
- 추가/수정/삭제할 노드 목록화
- 영향 받는 코드 파일 목록화
- reusable 컴포넌트화 가능성 점검 (3회 이상 반복 시 의무)

### Phase 2 — 디자인 갱신 (사이 단독)
1. 빈 공간 필요 시 `find_empty_space_on_canvas`
2. 새 프레임은 `placeholder:true` 로 생성
3. `batch_design` 으로 작은 논리 단위씩 변경
   - 한 batch에 너무 많은 ops 금지 — 섹션별 분할
   - 각 batch 후 반환된 issue 메시지 즉시 처리
4. reusable 인스턴스화는 `descendants` 오버라이드 활용
5. 완료된 프레임은 `placeholder:false`

### Phase 3 — 디자인 검증
1. `snapshot_layout problemsOnly:true` — clipped/zero-size 노드 수정
2. `get_screenshot` — 핵심 프레임 시각 확인 (작은 단위 우선)
3. 실패한 노드는 다시 Phase 2로 (작은 패치 batch)

### Phase 4 — 코드 동기화
1. 변경 항목별 코드 파일 결정:
   - 메뉴 구조 변경 → `js/config/menu.js`
   - 색·간격·폰트 → `css/main.css` (변수)
   - 새 뷰 → `js/views/{name}.js` + `app.js` 라우터
   - 컴포넌트 → `js/components/{name}.js`
2. CSS 변수를 .pen의 색과 일치시킴 (hex 직접 매칭)
3. 변경 후 로컬에서 `python -m http.server` 등으로 시각 확인 (선택적)

### Phase 5 — 정합성 점검
- 디자인-코드 정합성: Aligned (drift 0?) → 합격 / Drift-N → 잔여 작업
- 단일 정전 준수: Clean (코드가 정전 위반 없음?)
- 컴포넌트 재사용성: 같은 패턴 3회 이상 = reusable로 승급했는가

### Phase 6 — 치즈모리 인계
- 변경 요약을 로그에 기록
- 사용자에게 "뷰동기화 필요" 안내 (또는 자동 트리거):
  ```
  /harness-kakashi-creator 뷰동기화
  ```
- 큰 변경(메뉴 추가 등)은 doc-v* 태그 후 퍼블리싱까지 권고

---

## 5. PDSA 평가 부착

초수의화는 [[sage-deming|sage-deming]] always-on 평가 대상이다.

| 단계 | 사이의 산출물 | PDSA 매핑 |
|------|--------------|----------|
| Plan | Phase 1 변경 범위 | "무엇을 그릴 것인가" |
| Do | Phase 2-4 갱신 작업 | "그리고 살린다" |
| Study | Phase 5 정합성 점검 | "정전과 코드가 일치하는가" |
| Act | Phase 6 인계 + 다음 사이클 가설 | "다음 디자인 사이클의 가설" |

---

## 6. 안티패턴 — 초수의화가 거부해야 하는 것

- ❌ **Phase 0 생략** → 활성 .pen 파악 없이 batch_design 시도. schema 로드 누락
- ❌ **거대 batch_design 한 방** → 모든 페이지를 한 번에 변경. 실패 시 롤백 비싸다
- ❌ **screenshot 남용** → 큰 페이지 한 번 vs 핵심 컴포넌트 N번 — 후자가 정확하고 싸다
- ❌ **placeholder 미해제** → 작업 중 표식이 그대로 남으면 다음 사이 호출 시 혼란
- ❌ **코드만 갱신** → design-first 위반. 코드 변경은 항상 디자인 갱신 다음
- ❌ **치즈모리 영역 침범** → 매니페스트(`indexes/*.json`) 직접 편집. 사이는 그리기까지만
- ❌ **explicit id 강제** → 시스템 자동 ID. 충돌 위험

---

## 7. 출력 형식 (Engine Log Block)

```markdown
## 🖌️ 초수의화 발동 (choujuu-giga)

### Phase 0 — 정전
- 활성 .pen: Home/design/harness-view.pen
- reusable: {목록}
- 사전 drift: {N건}

### Phase 1 — 변경 범위
- 추가 N, 수정 M, 삭제 K
- 영향 코드 파일: {목록}
- reusable 승급 후보: {목록 또는 없음}

### Phase 2-3 — 디자인 갱신
- batch 횟수: N
- snapshot 문제: {N건 → 해결 M건}
- screenshot 검증: {프레임 ID 목록}

### Phase 4 — 코드 동기화
- 갱신 파일: {목록}
- CSS 변수: {변수 목록}

### Phase 5 — 정합성 점검
- 디자인-코드 정합성: Aligned | Drift-N
- 단일 정전 준수: Clean | Debt-N
- 컴포넌트 재사용성: Reusable | Repeated

### Phase 6 — 치즈모리 인계
- 인계 필요: 예 | 아니오
- 권고 명령: 뷰동기화 | 뷰 퍼블리싱

### 다음 사이클 (PDSA Act)
- 가설: ...
- 권고: ...
```

---

## 8. 두꺼비 소환술과의 관계

| 술법 | 시전자 | 부르는 대상 |
|------|--------|-----------|
| [[toad-summoning\|두꺼비 소환술]] | 나루토 (사용자) | 과거의 거장 (현자) |
| **超獸偽畫(초수의화)** | **사이 (묵화 닌자)** | **두루마리의 그림** |

> 두꺼비 소환술이 **사상**을 부르는 비기라면, 초수의화는 **형(form)** 을 부르는 비기다.
> 두 술법은 충돌하지 않는다 — 사상을 따라 형을 그린다.

---

## 9. 카카시·치즈모리 와의 관계

```
카카시 (정원지기)
   │ 사이를 임무에 배치
   ↓
사이 (묵화 닌자) — 초수의화 발동
   │ 디자인 → 코드 갱신
   ↓
치즈모리 (지도지기) — 뷰동기화 → 퍼블리싱
   │ 매니페스트 + GitHub Pages
   ↓
[외부 행인이 보는 마을 지도]
```

> 디자인이 살아나는 것도, 그 모습을 마을 외부에 보여주는 것도 — 별개의 술법이다.

---

## 10. 참조

- [[sai|🖌️ 사이 — 묵화 닌자]] — 시전자
- [[chizumori|🗺️ 치즈모리 (지도지기)]] — 다음 공정
- [[design-first|⚖️ design-first 원칙 정전]] — 엔진의 사상 출처
- [[pencil-design-locations|🖌️ 펜슬 디자인 위치 정전]] — 정전 위치
- [[naruto-worldview|🥷 세계관 매핑]] — 술법 등록
- [[toad-summoning|🐸 두꺼비 소환술]] — 자매 엔진

---

## 🌟 별자리 (Constellation)

- [[sai|🖌️ 사이 (묵화 닌자)]] — 시전자
- [[chizumori|🗺️ 치즈모리 (지도지기)]] — 디자인 라인의 다음 공정
- [[design-first|⚖️ design-first 원칙]]
- [[pencil-design-locations|🖌️ 펜슬 디자인 위치 정전]]
- [[naruto-worldview|🥷 세계관 매핑]]
- [[toad-summoning|🐸 두꺼비 소환술]] — 자매 엔진
- [[sage-deming|🐸 데밍 현자]] — PDSA 메타 평가
