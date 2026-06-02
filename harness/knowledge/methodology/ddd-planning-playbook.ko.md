---
title: DDD 기획 단계 운용 플레이북 — 한국 기획자용
domain: methodology
status: canonical
language: ko
audience: planner / product-manager / business-analyst
---

# DDD 기획 단계 운용 플레이북

> 이 문서는 카카시 하네스가 **기획 단계(planning phase)에서 DDD를 어떻게 운용하는가**에 관한 운용 규칙이다.
> 학문적 정의·인용·1차 출처는 영문 정전 [`ddd-evans.en.md`](./ddd-evans.en.md)를 따른다.
> 이 문서는 한국의 기획자(PM/PO/BA)가 도메인 전문가와 함께 무엇을 산출해야 하는가에 관한 것이다.

---

## 0. 누가 이 문서를 읽는가

| 역할 | 이 문서에서 얻는 것 |
|------|-------------------|
| **기획자 / PM / PO** | 기획서·PRD를 쓸 때 **무엇을 명시해야** sage-evans의 평가를 통과하는가 |
| **도메인 전문가 / 현업** | 개발자와의 대화에서 어떤 단어 작업이 산출물이 되는가 |
| **개발자** | 기획 단계 산출물이 어떤 형식으로 들어오는지, 무엇을 되돌려 물어야 하는지 |
| **카카시 (tamer)** | 기획 단계 작업에 sage-evans를 언제 자동 부착하는가 |

> **핵심**: DDD의 가장 큰 레버리지는 기획 단계의 **언어 작업**에 있다. 코드는 리팩토링할 수 있지만, 잘못 그은 경계는 수년간 조직을 잠식한다 (Evans, [InfoQ 2015](https://www.infoq.com/articles/eric-evans-ddd-matters-today/)).

---

## 1. DDD의 두 층 — 기획자는 어느 쪽인가

DDD는 두 층으로 구성된다.

```
[전략 설계 (Strategic Design)]   ← 기획자/PM/현업이 주도
   · 유비쿼터스 언어 (Ubiquitous Language)
   · 경계된 컨텍스트 (Bounded Context)
   · 컨텍스트 맵 (Context Map)
   · 핵심/지원/일반 하위 도메인 (Core/Supporting/Generic Subdomain)

[전술 설계 (Tactical Design)]    ← 개발자가 주도, 기획자는 어휘만 인지
   · 엔터티 / 값 객체 / 애그리거트
   · 도메인 이벤트 / 리포지토리 / 팩토리
   · 도메인 서비스 / 모듈 / 계층형 아키텍처
```

**기획자가 전략 설계를 비우면 전술 설계가 잘못된 곳에 내려진다.** 이것이 DDD가 기획자를 핵심 협력자로 보는 이유다.

---

## 2. 기획 단계 필수 산출물 (3종)

sage-evans는 다음 세 가지가 기획 산출물에 **명시**되어야 통과시킨다.
하나라도 누락되면 해당 항목을 `missing`으로 표시하고, 데밍의 `prediction: missing`과 동일한 학습 루프 손상으로 간주한다.

### 2.1 유비쿼터스 언어 글로서리 (Ubiquitous Language Glossary)

**형식**: 도메인 전문가가 실제로 쓰는 단어를 **있는 그대로** 기록한 표.

| 용어 (한국어) | 영문 표기 | 정의 | 비슷하지만 다른 용어 | 사용 컨텍스트 |
|---|---|---|---|---|
| 주문 | Order | 결제가 완료되어 배송 대기/진행 중인 상태의 거래 단위 | 장바구니(Cart), 청구(Invoice) | 주문관리 컨텍스트 |
| 사용자 | Member | 이메일 인증을 마치고 로그인 가능한 계정 주체 | 방문자(Visitor), 고객(Customer) | 회원 컨텍스트 |

**원칙**:
1. **현업의 단어를 그대로** — "유저"를 쓰는 팀이면 유저, "회원"을 쓰는 팀이면 회원. 임의로 통일하지 않는다.
2. **비슷하지만 다른 용어를 항상 함께** — 혼동 가능한 인접 단어를 명시한다. 이것이 경계의 신호다.
3. **사용 컨텍스트를 명시** — 같은 단어가 다른 컨텍스트에서 다른 뜻이면, 그것을 받아들인다. 통일하려 하지 않는다.

### 2.2 컨텍스트 지도 (Context Map)

**형식**: 손그림이라도 좋다. 다음을 포함해야 한다.

```
┌─────────────────┐         ┌─────────────────┐
│   주문 컨텍스트  │ ──ACL──>│  결제 컨텍스트   │
│   (Core)        │         │  (Supporting)   │
└─────────────────┘         └─────────────────┘
        │
        │ Published Language
        ↓
┌─────────────────┐
│   배송 컨텍스트  │
│   (Supporting)  │
└─────────────────┘
```

**필수 항목**:
1. **모든 경계된 컨텍스트의 이름**
2. **각 컨텍스트의 분류**: Core / Supporting / Generic
3. **컨텍스트 간 관계 패턴**: ACL, Shared Kernel, Customer/Supplier, Conformist, Open Host Service, Published Language, Separate Ways, Partnership 중 하나

관계 패턴 정의는 [`ddd-evans.en.md §4.3`](./ddd-evans.en.md) 참조.

### 2.3 핵심 도메인 선언 (Core Domain Statement)

**형식**: 한 문장. "이 프로덕트의 경쟁 우위는 **{Core Domain}** 컨텍스트에 있고, 우리는 그곳에 최고의 시간을 쓴다."

예시:
- "당근마켓의 Core Domain은 **지역 기반 매칭**이다. 결제·배송은 Supporting, 인증·CDN은 Generic."
- "토스의 Core Domain은 **간편결제 UX**다. 이체·계좌조회는 Supporting, 본인인증·SMS는 Generic."

**원칙**:
1. **Core는 하나에 가깝다** — "모든 게 Core"는 "Core가 없다"와 같다.
2. **Generic은 사지 않으면 죄책감을 가진다** — 우리가 직접 모델링하면 안 되는 영역을 명시한다.
3. **이 선언은 분기마다 재검토** — 시장이 바뀌면 Core도 바뀐다.

---

## 3. 기획 산출물 평가표 (sage-evans 체크리스트)

sage-evans는 기획 문서를 받으면 다음을 확인한다.

| 항목 | 확인 질문 | 통과 기준 |
|---|---|---|
| **유비쿼터스 언어** | 도메인 용어가 글로서리에 정의되어 있는가? | 핵심 용어 ≥ 10개, 인접 용어 비교 포함 |
| **언어 일관성** | 같은 개념이 문서 전체에서 같은 단어로 쓰이는가? | 동의어 혼용 0건 (또는 컨텍스트별 분리 명시) |
| **컨텍스트 명시** | 시스템이 다루는 영역이 컨텍스트로 분리되어 있는가? | 컨텍스트 ≥ 2개 + 분류(Core/Supporting/Generic) |
| **컨텍스트 관계** | 컨텍스트 간 관계가 명시되어 있는가? | 관계 패턴 중 하나 선택, ACL 필요 지점 표시 |
| **Core 선언** | 무엇이 경쟁 우위인지 한 문장으로 적혀 있는가? | 단일 Core, Generic은 외부 의존 명시 |
| **변경 영향 범위** | 이번 기획이 어느 컨텍스트의 무엇을 바꾸는가? | 영향받는 컨텍스트 + 영향 종류(언어/구조/통합) |

평가 결과 표기:

```
유비쿼터스 언어: ✅ 통과 / ⚠️ 부분 / ❌ 누락
언어 일관성:    ✅ 통과 / ⚠️ 부분 / ❌ 누락
컨텍스트 명시:  ✅ 통과 / ⚠️ 부분 / ❌ 누락
컨텍스트 관계:  ✅ 통과 / ⚠️ 부분 / ❌ 누락
Core 선언:     ✅ 통과 / ⚠️ 부분 / ❌ 누락
변경 영향 범위: ✅ 통과 / ⚠️ 부분 / ❌ 누락
```

**합격선**: 6개 항목 중 최소 5개 ✅, 0개 ❌ (Core 선언과 컨텍스트 명시는 ❌ 불가).

---

## 4. 기획 단계 워크플로우 (5단계)

### Step 1 — 사실 수집 (1~2시간)

도메인 전문가/현업과 함께 **EventStorming**을 권장한다 ([브란돌리니, eventstorming.com](https://www.eventstorming.com/)).
가벼운 대체로:
- 현업이 쓰는 단어를 받아쓰기 (40개 이상)
- 일어나는 사건(이벤트)을 시간 순으로 나열
- 사건마다 누가 일으키는지(액터), 무엇이 따라오는지(정책) 표시

### Step 2 — 글로서리 1차 작성

받아쓴 단어를 §2.1 형식으로 정리. **이때 비슷한 단어가 여럿이면 그게 컨텍스트 경계의 신호다.**

예: "주문/구매/거래/결제" 가 혼용된다면 → 컨텍스트가 분리되어야 할 가능성 높음.

### Step 3 — 컨텍스트 분리

§2.2 형식으로 손그림. **하나의 단어가 두 가지 의미면 두 컨텍스트로 나눈다.** 통일하려 하지 않는다.

### Step 4 — Core 선언

§2.3. 한 문장으로. 팀과 합의되지 않으면 합의될 때까지 기획을 진행하지 않는다.

### Step 5 — sage-evans 호출

```
"에반스 호출, 이 기획 검토해줘"
"도메인 주도 점검"
"DDD 평가"
"전략 설계 점검해"
"기획 단계 평가"
```

sage-evans가 §3 체크리스트로 평가하고 로그를 남긴다.

---

## 5. PDSA(데밍)와의 관계 — 어떻게 함께 작동하는가

기획 작업도 데밍의 PDSA 기본 평가를 받는다. 그 위에 sage-evans가 **전략 설계 관점의 후속 평가**를 얹는다.

```
[기획 작업 종료]
     │
     ├─ [기본 평가]  PDSA — sage-deming
     │              · Plan: 이번 기획의 목표·이론·지표
     │              · Study: 예측 대비 실제 학습
     │
     └─ [후속 평가]  전략 설계 — sage-evans (기획/도메인 모델링이면 자동)
                    · 유비쿼터스 언어 / 컨텍스트 / Core 점검
                    · 누락 항목은 데밍의 'prediction: missing'과 동등한 학습 손상으로 처리
```

후속 평가 트리거 매핑은 [`evaluation-base-pdsa.md §3`](./evaluation-base-pdsa.md)에 등재되어 있다.

---

## 6. 안티패턴 — 기획자가 피해야 하는 것

- ❌ **"용어는 나중에 정리하죠"** — 정리되지 않은 용어는 모든 회의에서 재논쟁된다. Evans: 언어 작업은 *첫 번째* 산출물이지 문서화 백로그가 아니다.
- ❌ **모든 단어를 통일하려는 시도** — 같은 단어가 다른 컨텍스트에서 다른 뜻이라면 그것을 인정한다. 통일은 컨텍스트 경계를 흐린다.
- ❌ **"마이크로서비스 1개 = 컨텍스트 1개" 라고 단정** — Evans 본인이 2018년부터 명시적으로 부정한 도식이다 ([InfoQ 2018](https://www.infoq.com/news/2018/09/ddd-not-done/), [InfoQ 2019](https://www.infoq.com/news/2019/09/evans-improve-language-ddd/)).
- ❌ **개발자에게 스키마/테이블/API 형태를 지시** — 기획자가 다룰 영역은 **언어와 경계**다. 구현 형태는 개발자가 결정한다 ([이성원, *PM을 위한 DDD*](https://ssowonny.medium.com/프로덕트-매니저-pm-를-위한-도메인-주도-설계-domain-driven-design-ddd-4b2a06d952f2)).
- ❌ **모든 도메인을 Core 취급** — Generic은 외부에서 사 와야 한다. 직접 모델링하면 핵심 도메인에 쓸 자원을 갉아먹는다.
- ❌ **Core 선언이 없는 기획** — "이 프로덕트의 경쟁 우위가 어디에 있는가"에 답하지 못하면 우선순위가 흔들린다.

---

## 7. 한국어 용어 매핑 (Wikibooks 번역본 기준)

[Wikibooks 한국어 번역본](https://wikibook.co.kr/domain-driven-design-ebook/) (이대엽 옮김, 2023)을 1차 기준으로 한다. 임의 신조어 금지.

| 영문 | 한국어 (이 하네스에서 사용) | 비고 |
|---|---|---|
| Ubiquitous Language | 유비쿼터스 언어 | "보편 언어"보다 원어가 더 정착됨 |
| Bounded Context | 경계된 컨텍스트 | "한정된 문맥"도 사용되나 본 하네스는 "경계된 컨텍스트" 채택 |
| Context Map | 컨텍스트 맵 / 컨텍스트 지도 | 두 표기 모두 허용 |
| Core Domain | 핵심 도메인 | |
| Supporting Subdomain | 지원 하위 도메인 | |
| Generic Subdomain | 일반 하위 도메인 | |
| Anticorruption Layer (ACL) | 부패 방지 계층 | |
| Shared Kernel | 공유 커널 | |
| Customer / Supplier | 고객/공급자 | |
| Conformist | 순응자 | |
| Open Host Service | 공개 호스트 서비스 | |
| Published Language | 공표된 언어 | "공개된 언어"도 사용 가능 |
| Separate Ways | 분리된 길 | |
| Partnership | 파트너십 | |
| Entity | 엔터티 | |
| Value Object | 값 객체 | |
| Aggregate / Aggregate Root | 애그리거트 / 애그리거트 루트 | |
| Domain Event | 도메인 이벤트 | |
| Repository | 리포지토리 | |
| Factory | 팩토리 | |
| Domain Service | 도메인 서비스 | |
| EventStorming | 이벤트 스토밍 | 브란돌리니 표기는 한 단어 |

---

## 8. 참조

- 영문 정전: [`ddd-evans.en.md`](./ddd-evans.en.md)
- 에반스 현자 에이전트: [`harness/agents/sage-evans.md`](../../agents/sage-evans.md)
- 기본 평가(PDSA) 운용: [`evaluation-base-pdsa.md`](./evaluation-base-pdsa.md)
- 데밍 현자 에이전트: [`harness/agents/sage-deming.md`](../../agents/sage-deming.md)
- 소환술 엔진: [`harness/engine/toad-summoning.md`](../../engine/toad-summoning.md)
- 세계관 매핑: [`harness/knowledge/lore/naruto-worldview.md`](../lore/naruto-worldview.md)
- Wikibooks 한국어 번역본: [wikibook.co.kr/domain-driven-design-ebook](https://wikibook.co.kr/domain-driven-design-ebook/)
- 이성원, *PM을 위한 DDD*: [ssowonny.medium.com](https://ssowonny.medium.com/프로덕트-매니저-pm-를-위한-도메인-주도-설계-domain-driven-design-ddd-4b2a06d952f2)

---

## 🌟 별자리 (Constellation)

- [[ddd-evans.en|📘 DDD — Evans's Doctrine (English canon)]] — 1차 출처
- [[sage-evans|🐉 에반스 현자]] — 이 플레이북의 수행자
- [[evaluation-base-pdsa|⚙️ 기본 평가 운용 규칙]]
- [[pdsa-deming.en|📘 PDSA — Deming's Doctrine]] — DDD가 위에 얹히는 베이스
- [[sage-deming|🐸 데밍 현자]] — 기본 평가자
- [[naruto-worldview|🥷 세계관 매핑]]
- [[toad-summoning|🐸 두꺼비 소환술 엔진]]
- [[tamer|🧑‍🌾 정원지기 카카시]]
