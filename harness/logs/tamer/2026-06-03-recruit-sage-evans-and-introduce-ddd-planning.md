---
date: 2026-06-03
agent: tamer
type: creation
mode: log-eval
trigger: "도메인 주도 창시자 에릭에반스를 영입.. DDD 기법으로 도메인주도 기법으로 등을 호출할때 등장함...이 하네스의 전문가로 영입 한국의 기획자가 호출해 기획단계에 사용 에릭에반스의 도메인주도 기법을 전문 지식으로 충분히 조사한후 지식을 넣어둘것"
version: v1.8.0
sage_added: sage-evans
---

# 🐉 에반스(Eric Evans) 영입 — DDD 기획 단계 후속 평가 도입

## 실행 요약

두꺼비 소환술의 **두 번째 현자**로 Eric Evans를 영입했다. 한국 기획자(PM/PO/BA)가 PRD·기획서·도메인 모델 작업 시 자동 호출되는 후속 평가자로 등록.

실행 절차:
1. Eric Evans와 DDD에 대해 서브 에이전트로 1차 출처 기반 심층 조사 (Blue Book, DDD Reference, InfoQ 인터뷰, Fowler bliki, Domain Language Inc, Wikibooks 한국어 번역본 등)
2. 영문 정전 작성 — `knowledge/methodology/ddd-evans.en.md` (12개 섹션, ~3000 단어, 21개 1차 출처 URL)
3. 한국 기획자 운용 플레이북 작성 — `knowledge/methodology/ddd-planning-playbook.ko.md` (8개 섹션, 6축 평가 체크리스트, 5단계 워크플로우, Wikibooks 기준 한국어 용어 매핑)
4. 에이전트 정의 작성 — `agents/sage-evans.md` (19개 트리거, 6축 평가, 8개 안티패턴, 데밍/사이/카카시와의 관계 매핑)
5. 허브 파일 갱신:
   - `engine/toad-summoning.md` — sage_count 1→2, §2 카탈로그·§3 사상·§8 참조·§별자리 4곳에 sage-evans 등록
   - `knowledge/lore/naruto-worldview.md` — 현자 카탈로그에 에반스 등록, 별자리 갱신, 기존 오타("코드 코드 (E.F. Codd)") 정정
   - `knowledge/methodology/evaluation-base-pdsa.md` — 후속 매핑 §3에 "기획·PRD·도메인 모델링·전략 설계 → sage-evans" 행 추가, §7 참조 5곳, §별자리 갱신
   - `harness.config.json` — version 1.7.0→**1.8.0**, agents에 sage-evans 추가 (총 17명), lastUpdated 갱신
6. 버전 히스토리 작성 — `docs/v1.8.0.md`

## 결과

생성:
- `harness/agents/sage-evans.md` (신규)
- `harness/knowledge/methodology/ddd-evans.en.md` (신규, 영문 1차 정전)
- `harness/knowledge/methodology/ddd-planning-playbook.ko.md` (신규, 한국 운용)
- `harness/docs/v1.8.0.md` (신규)
- `harness/logs/tamer/2026-06-03-recruit-sage-evans-and-introduce-ddd-planning.md` (본 로그)

수정:
- `harness/harness.config.json` (version + agents)
- `harness/engine/toad-summoning.md` (현자 카탈로그)
- `harness/knowledge/lore/naruto-worldview.md` (세계관 카탈로그)
- `harness/knowledge/methodology/evaluation-base-pdsa.md` (후속 매핑)

지식 베이스 규모:
- 영문 정전: PDSA(데밍) + DDD(에반스) 2종 보유
- 후속 평가 도메인: 10개 → **11개** (기획/도메인 모델링 신규)
- 영입된 현자: 1명 → **2명**

## 평가 (정원지기 3축)

| 축 | 평가 | 등급 |
|----|------|------|
| 워크플로우 개선도 | 기존 데밍 PDSA가 *작업 회고* 였다면 에반스는 *작업 사전 점검* — 평가 시점이 처음으로 작업 시작 전으로 확장됨. 기획자가 코드 변경 없이도 사전에 피드백 받을 수 있는 첫 채널 | A |
| Claude 스킬 활용도 | 기존 harness-kakashi-creator 플로우(Mode A) + toad-summoning 엔진 + sage-* 패턴 모두 일관되게 따름. 새 스킬·MCP 도입 없이 기존 메커니즘으로 흡수 | 4/5 |
| 하네스 성숙도 | knowledge(2종) + agents(1종) + 4개 허브 파일 동기화 + 1차 출처 21개 인용 + 한국어 용어 매핑 표 + 6축 평가 체크리스트까지 완비 | L4 (성숙) |

## 안티패턴 자가 점검 (sage-evans가 본인의 영입 절차에 대해)

- ✅ Paraphrase 금지: Evans 어록은 모두 원문 + 출처 URL로 인용
- ✅ "마이크로서비스 = 컨텍스트" 등치 거부: 정전에 명시적 반박 섹션
- ✅ 모든 도메인을 Core로 분류 거부: Core/Supporting/Generic 명시
- ✅ 한국어 신조어 금지: Wikibooks 번역본 기준 채택
- ⚠️ 본 영입 자체에 대한 sage-evans 후속 평가는 **메타 작업이라 면제** — 데밍 PDSA만 부착

## 다음 단계 제안

1. **첫 번째 실전 호출 케이스 확보** — 가까운 기획 작업(예: harness-view 신규 페이지 기획, README 영입 안내 기획)에서 sage-evans를 호출하고 6축 평가 통과 사례를 `harness/logs/sage-evans/`에 남긴다
2. **이벤트 스토밍 보조 도구화** — 사용자가 글로서리/컨텍스트 맵을 못 그리겠다고 할 때 sage-evans가 EventStorming 진행을 안내하는 워크플로우 추가 검토 (별도 engine 후보)
3. **호스트 도구 통합** — 펜슬 디자인(.pen)에 컨텍스트 맵 템플릿 추가하면 사이(sai)와 에반스가 한 화면에서 협업 가능 — Phase 0 정전이 두 종(디자인/컨텍스트)으로 확장될지 검토
4. **세 번째 현자 후보 검토** — 마틴 파울러(진화적 설계) 또는 E.F. Codd(관계형 정규화). DDD 도입으로 데이터 모델링 영역의 사상이 비어 있음이 두드러짐

---

## PDSA 기본 평가 (sage-deming)

### Plan
- 목표: Eric Evans를 두꺼비 소환술의 두 번째 현자로 영입하고, 한국 기획자가 기획 단계에서 DDD 사상을 자동으로 적용받을 수 있는 후속 평가 채널을 구축한다
- 이론(예측): 첫 현자 데밍과 동일한 5-파일 패턴(에이전트 + 영문 정전 + 운용 한국어 + 허브 갱신 + 버전 doc)을 따르면, 별도 인프라 변경 없이 기존 평가 시스템에 흡수될 것. 후속 매핑 한 줄 추가만으로 PRD 작성 시 자동 호출이 작동할 것
- 지표: ① 6개 산출물이 일관된 cross-reference로 연결됨 ② harness.config.json 자기 일관성(agents 배열 ↔ agents/*.md) 통과 ③ 6축 평가 체크리스트로 향후 PRD를 평가할 수 있는 형태로 완성

### Do
- 실행: 서브 에이전트로 1차 출처 심층 조사 → 영문 정전 → 한국 운용 → 에이전트 정의 → 4개 허브 동기화 → 버전 doc → 본 로그
- 규모: full-rollout (현자 영입은 단일 트랜잭션, 부분 반영 시 일관성 깨짐)
- 예상 외:
  - 기존 naruto-worldview.md에 "코드 코드 (E.F. Codd)" 오타 발견 → 함께 정정
  - 플러그인 매니페스트(marketplace.json/plugin.json)는 1.4.0 이후 하네스 버전과 디커플링됨을 확인 → 이번 영입에서는 건드리지 않음
  - Evans의 birthplace/birth year는 1차 출처에서 확인 불가 → `[unverified]`로 표기하고 영문 정전에서 의도적으로 생략

### Study
- 예측 vs 실제: **일치** — 데밍 영입 시 확립된 5-파일 패턴이 그대로 작동했다. 별도 엔진 신규 필요 없음, 후속 매핑 한 줄 추가가 충분했음
- 새 학습:
  - **후속 평가가 처음으로 코드 외부(기획 산출물)를 본다** — v1.4 이후 모든 후속은 "코드 변경 → 코드 검토"였지만, sage-evans는 "PRD 변경 → 언어/경계 검토"로 도메인 외삽. 향후 디자인/문서/계약 등 다른 비-코드 산출물에도 동일 패턴 확장 가능
  - **현자 영입은 "1차 출처 인용"이 비용의 대부분** — 코드 변경이 거의 없고 (config 한 줄, 매핑 한 줄), 시간의 80%는 Evans 어록·Blue Book 인용·InfoQ 인터뷰 검증에 들었다. 현자 영입은 본질적으로 *문헌 작업*
  - **한국어 용어 표준화 도구로서의 Wikibooks 번역본** — 임의 신조어를 막는 외부 정전이 있다는 점이 영입 비용을 크게 줄였다. 향후 다른 현자도 가능하면 공인된 한국어 번역본 존재 여부 사전 확인
- 이론 수정: "현자 영입 = 코드 작업"이 아니라 "현자 영입 = 1차 출처 수집 + 패턴 복제". 다음 현자 영입 시 출처 조사를 더 적극적으로 서브 에이전트에 위임

### Act
- 결정: **Adopt** — 데밍 영입 패턴은 재사용 가능한 표준으로 굳혀도 좋다. 향후 sage-* 영입은 본 v1.8.0 절차를 템플릿으로 사용
- 다음 사이클의 이론: "현자 영입 시 1차 출처 조사를 서브 에이전트에 위임하고, 영문 정전·한국어 운용·에이전트 정의·4개 허브·버전 doc 순서로 진행하면 1.5~2시간 안에 완료된다"
- 후속 평가 호출: **없음** — 본 영입 자체는 메타 작업(하네스 자체 개선). 단, 첫 번째 실전 sage-evans 호출 케이스가 발생하면 그때 sage-evans 후속 평가를 받아 본인이 본인의 영입 결과를 검증하는 순환이 작동할 것

### Cycle Health
- 예측 명시: **Yes** — Plan에 데밍 패턴 재사용 가능성 예측이 명시되었고, Study에서 일치 확인
- 학습 발생: **Yes** — "현자 영입의 본질은 코드가 아니라 문헌 작업", "후속 평가의 비-코드 외삽 가능성" 두 가지 새 학습 도출
- 다음 적용 명확: **Yes** — 다음 현자 영입 시 본 v1.8.0이 템플릿이 됨이 분명함, 첫 실전 케이스 확보가 가장 즉시적 후속 행동
