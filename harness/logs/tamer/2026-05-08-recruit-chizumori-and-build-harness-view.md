---
date: 2026-05-08
agent: tamer
type: creation
mode: log-eval + suggestion-tip-approved
trigger: "정원의 별지기 이름을 이 세계관에 맞게 정해주세요 / 마을의 지도지기를 만든후 하네스 뷰동기화·하네스뷰 퍼블리싱 역할을 주세요"
sage_evaluation: sage-deming (PDSA, always-on)
---

# 지도지기 치즈모리 영입 & harness-view + GitHub Pages 신설

사용자 요청에 따라 `D:\Code\AI\AgentZeroLite\Home\harness-view` 참조 분석 후, 카카시 하네스 전용 마을 지도(harness-view)를 구축하고 GitHub Pages 배포를 준비했다. 나루토 세계관에 맞는 새 keeper "치즈모리(地図守, Chizumori)"를 영입했다.

## 실행 요약

### Phase 1 — 참조 하네스뷰 분석

`D:\Code\AI\AgentZeroLite\Home\harness-view`를 Explore subagent로 깊게 분석한 결과 핵심 패턴 도출:

- **단일 빌드 스크립트**(`build-indexes.js`)가 `harness/`를 스캔해 `indexes/*.json` 매니페스트만 생성 (본문 복제 X)
- **PDSA insight**(`data/pdsa-insight.json`): Plan/Do/Study/Act 4축, bilingual, sources[]+tried/solved/remaining/learned
- **GitHub Pages 배포**: `doc-v*` 태그 → Actions에서 빌드 + 저장소 전체 artifact 업로드 → 뷰가 `../../`로 원본 fetch
- **정적 vs 동적 라인**: 빌드 시점에 그어짐. 뷰는 stateless.

### Phase 2 — 치즈모리(지도지기) 설계

나루토 세계관 정합성:
- 호시모리(별지기)와 같은 `keeper` 계열, 다른 도메인 ([[hoshimori]] = vault 내부, chizumori = 외부 공개)
- 출신: **Konohagakure(木ノ葉隠れの里)** 호카게 타워 기록실 — 마을 청사진/영토 지도 관리자가 캐논 위치
- 술법: **지도술(地図術)** — 정적 사이트 시각화 + 퍼블리싱
- 두 역할 명시: 役 1(뷰동기화), 役 2(뷰 퍼블리싱)
- 정적/동적 분리 원칙을 §3에 명문화 (사용자 핵심 요구)
- 평가축 3축: 지도 정합성 / 빌드 멱등성 / 정적·동적 분리

### Phase 3 — Home/harness-view/ 구축

```
Home/
├── index.html            (Home → harness-view redirect)
└── harness-view/
    ├── index.html        (SPA entry, marked + mermaid CDN)
    ├── css/              (main, components, md — Konoha 잎사귀 톤)
    ├── js/
    │   ├── app.js        (router, hash 기반)
    │   ├── config/menu.js
    │   ├── utils/        (dom, loader)
    │   └── views/        (9개: dashboard, worldview, agents, engine,
    │                      knowledge, docs, logs, pdsa, about)
    ├── data/news.json    (bilingual hand-authored)
    ├── indexes/          (sync-view.js가 생성)
    └── scripts/sync-view.js
```

루트 `index.html`도 추가 (Pages 진입을 `Home/harness-view/`로 redirect).

### Phase 4 — sync-view.js (Node 빌드 스크립트)

8개 산출물 생성:
- `_meta.json`, `agents.json`(15), `knowledge.json`(7), `engine.json`(1), `docs.json`(8 + 컨트리뷰터), `logs.json`(11), `worldview-graph.json`(인물 6 / 술법 6)
- `data/pdsa-insight.json` — `harness/logs/**/*.md`의 H3 섹션(`### Plan/Do/Study/Act`)을 파싱해 4축 집계, sources[] 부착, bilingual `{ko, en}`

핵심 규약:
- frontmatter, 제목, 첫 문단만 매니페스트에 포함 → **본문 복제 0건**
- git contributor 통계는 `harness/docs` 경로만 한정
- `_meta.json` 외에는 두 번 실행 시 결과 동일 (멱등성 검증 완료)

실행 결과:
```
agents      : 15
knowledge   : 7
engine      : 1
docs        : 8 (commits: 8)
logs        : 11
pdsa        : 0 tried / 1 solved / 0 remaining
worldview   : 6 chars / 6 jutsu
✅ 완료 — 879 ms
```

### Phase 5 — GitHub Pages 워크플로우

`.github/workflows/pages.yml`:
- **트리거**: `push tags: ['doc-v*']` OR `workflow_dispatch`
- **단계**: checkout (full history) → Node 20 setup → sync-view.js 실행 → 저장소 전체 artifact 업로드 → deploy-pages
- **개념**: 의도된 릴리스 게이트 — 일상 푸시는 영향 없음

### Phase 6 — 문서 + 별자리 업데이트

- `harness/knowledge/lore/naruto-worldview.md` — 치즈모리/지도술 등록
- `harness/harness.config.json` — v1.5.0→1.6.0, agents 14→15, `keepers.chizumori` 신설
- `harness/docs/v1.6.0.md` 신규 (영입 기록)
- README/README-EN — 치즈모리 안내 섹션 추가
- v1.5.0 별자리 footer 갱신 (v1.6.0 link 추가)

## 결과 산출물

### 신규 파일 (총 16+)
- `harness/agents/chizumori.md` — 지도지기 정의
- `harness/docs/v1.6.0.md` — 영입 기록
- `Home/index.html` (redirect)
- `Home/harness-view/index.html` (SPA)
- `Home/harness-view/css/{main,components,md}.css` (3)
- `Home/harness-view/js/app.js`, `config/menu.js`, `utils/{dom,loader}.js` (4)
- `Home/harness-view/js/views/{dashboard,worldview,agents,engine,knowledge,docs,logs,pdsa,about}.js` (9)
- `Home/harness-view/data/news.json`
- `Home/harness-view/scripts/sync-view.js`
- `Home/harness-view/indexes/*.json` (자동 생성, 7개)
- `Home/harness-view/data/pdsa-insight.json` (자동 생성)
- `.github/workflows/pages.yml`
- 루트 `index.html`
- 본 로그 파일

### 변경 파일
- `harness.config.json`, `harness/knowledge/lore/naruto-worldview.md`, `README.md`, `README-EN.md`, `harness/docs/v1.5.0.md`

## 평가

### 정원지기(tamer) 3축
- 워크플로우 개선도: **A** — 정원의 외부 가시성이 0에서 GitHub Pages 배포로 도약
- Claude 스킬 활용도: **5/5** — Bash, Write, Edit, Agent(Explore) 협업적으로 사용
- 하네스 성숙도: **L4 → L5 진입** — keeper 계열이 2명이 되면서 관리 영역 명확화 (vault / pages)

### 치즈모리(chizumori) 3축
- 지도 정합성: **OK** — 매니페스트 카운트가 실제 `harness/` 파일 수와 일치 (agents 15, logs 11 등)
- 빌드 멱등성: **Idempotent** — `_meta.json` 외 모든 파일 두 번 실행 시 동일
- 정적/동적 분리: **Clean** — `indexes/`/`data/`에 본문 복제 0건 (frontmatter+제목만)

## 다음 단계 제안

- `sync-view.js`에 자동 트리거 hook 추가 검토 — 호시모리 자동 발동과 페어링
- 뷰 dashboard에 mermaid 다이어그램 추가 (전체 에이전트 협업도)
- bilingual EN 자동 채우기 — 현재는 ko 텍스트가 en 슬롯에도 들어감
- `data/news.json` 자동 합성 모드 — git tag/log 기반으로 highlights 자동 생성

## 첫 배포 실행 — 학습 흡수 (2026-05-08 16:42~16:46)

`doc-v1.6.0` 태그 푸시로 첫 자동 배포 시도. 3종 실패 → 수정 → 성공:

| Run | 결과 | 실패 원인 | 수정 |
|-----|------|----------|------|
| 1차 (tag) | build OK / deploy 거부 | github-pages 환경 정책 default(main only)가 태그 거부 | `deployment_branch_policy`를 custom으로 + `doc-v*` 태그 정책 추가 |
| 1차 (rerun) | build OK / deploy 실패 | Pages source가 `legacy` | `gh api -X PUT .../pages -f build_type=workflow` |
| 2차 (workflow_dispatch) | build OK / deploy 거부 | 환경 정책에 `main` 브랜치 미포함 | `main` 브랜치 정책 추가 |
| 2차 (rerun) | ✅ 성공 / 그러나 _meta.json 404 | Jekyll이 `_` prefix 제외 | `.nojekyll` 추가 + dispatch |
| 3차 (workflow_dispatch) | ✅ **완전 성공** | — | — |

라이브 엔드포인트 검증 (모두 200 OK):
- `/Home/harness-view/` (진입)
- `/Home/harness-view/indexes/_meta.json` (sync 결과)
- `/Home/harness-view/js/app.js` (모듈)
- `/harness/agents/chizumori.md` (정적 원본 — 뷰가 `../../harness/...`로 fetch)

이 학습은 [[chizumori]] §役 2 절차의 **사전 점검(pre-flight)** 단계와 트러블슈팅 사전에 흡수되어, 향후 새 저장소·첫 배포 시 자동 진단된다.

---

## PDSA 기본 평가 (sage-deming)

### Plan
- **목표**: 카카시 하네스의 정원 모습을 GitHub Pages로 외부에 공개하는 정적 사이트(harness-view)를 구축하고, 그 운영 책임을 가진 새 keeper(치즈모리)를 영입한다. 정적 문서는 복제 없이 참조하고, PDSA 등 동적 분석은 뷰 동기화 단계에서만 작동하도록 명확히 분리한다.
- **이론(예측)**: "AgentZeroLite 참조 패턴(단일 빌드 스크립트 + 매니페스트 + ../../로 원본 fetch + 태그 게이트 배포)을 그대로 적용하면, 정원이 자랄수록 한 줄 명령(`node sync-view.js`)으로 지도가 갱신되고, 인간이 손으로 쓴 narrative와 자동 생성 매니페스트가 충돌하지 않는다."
- **지표**: (a) 매니페스트 카운트가 실제 `harness/` 파일과 일치, (b) `sync-view.js` 두 번 실행 결과 동일(멱등), (c) `indexes/`/`data/`에 본문 복제 0건, (d) `pages.yml`이 `doc-v*` 게이트로만 트리거.

### Do
- **실행**: 1) Explore agent로 참조 분석. 2) 치즈모리 에이전트 정의 + 세계관 등록. 3) Home/harness-view 구조 (index, 3 css, 13 js 파일) 작성. 4) sync-view.js 작성 + 1차 실행 검증. 5) pages.yml 작성. 6) v1.6.0 + README 갱신 + v1.5.0 footer 갱신. 7) 2차 실행으로 멱등성 확인.
- **규모**: full-rollout (사이트 전체 신설).
- **예상 외**: PDSA 집계가 0/1/0/no 인 것 — 14일 윈도우 안에 PDSA 블록을 가진 로그가 1건뿐(이전 sage-deming 영입 로그). 아직 학습 모집단이 작다는 정확한 신호. 대시보드가 비어 보이는 것이 아니라 **현실 그대로** 보여주는 게 맞다.

### Study
- **예측 vs 실제**: **일치**. 매니페스트 카운트 정합 OK, 멱등성 idempotent, 정적/동적 분리 clean(본문 복제 0건), pages.yml 게이트 정상.
- **새 학습**:
  1. 정적/동적 분리 원칙은 **빌드 시점**에 그어진다 — sync 스크립트가 본문을 직렬화하지 않고 frontmatter+제목만 추출하는 것이 핵심. 이 한 줄 규칙이 향후 view 확장의 가드레일.
  2. PDSA 집계의 모집단이 작을 때(N=1)도 그대로 노출하는 것이 데밍 정신에 맞다 — paraphrase로 채워넣지 않는다 (Plan-only 원칙과 동형).
  3. keeper 계열의 도메인 분리가 명료해졌다: hoshimori=vault 내부 그래프, chizumori=외부 공개 지도. 다음 keeper 영입 시 이 직교성을 따라야 한다.
- **이론 수정**: "정적/동적 분리는 단순 디렉토리 분리가 아니라 **'본문 복제 금지' + '멱등 빌드' + '게이트된 배포'** 3원칙의 결합이다. 향후 keeper/sage 영입 시 도메인이 외부 공개를 포함하면 이 3원칙을 의무화한다."

### Act
- **결정**: **Adopt** — 치즈모리 영입 + harness-view + Pages 배포 모두 안정 채택.
- **다음 사이클의 이론**: "PDSA 모집단이 작을 때 sync 결과를 손으로 보충하지 않고 그대로 두면, '학습이 모이지 않았다'가 가장 정직한 신호이며 이 자체가 PDSA의 다음 입력이 된다."
- **후속 평가 호출**: 없음 (도메인 트리거 없음 — 보안/성능/테스트 외).

### Cycle Health
- **예측 명시**: Yes
- **학습 발생**: Yes (3건 — 정적/동적 분리의 빌드 시점 원칙, 작은 N의 정직한 노출, keeper 도메인 직교성)
- **다음 적용 명확**: Yes (3원칙 의무화 + 작은 N 그대로 노출)

---

## 🌟 별자리 (Constellation)

- [[chizumori|🗺️ 치즈모리 (지도지기)]] — 영입된 지도지기
- [[hoshimori|🌟 호시모리 (별지기)]] — keeper 자매
- [[v1.6.0|📝 v1.6.0 영입 기록]]
- [[v1.5.0|📝 v1.5.0]] — 직전 버전
- [[naruto-worldview|🥷 세계관 매핑]]
- [[sage-deming|🐸 데밍 현자]] — PDSA 사상 출처
- [[evaluation-base-pdsa|⚙️ 기본 평가 운용 규칙]]
- [[zettelkasten-llm-era|📚 Zettelkasten · 위키태그 정전]] — 정적/동적 분리 원리
- [[tamer|🧑‍🌾 정원지기 카카시]]
