# 영입 카탈로그 (Recruit Catalog)

> 마더 정원(harness-kakashi 저장소)에서 실전 검증된 전문가들의 명부.
> **여기 있는 전문가는 배포되지 않는다** — 이 명부에서 골라, 영입 워크플로우로
> **당신의 프로젝트에 맞게 새로 피워낸다**. ([recruit-workflow.md](recruit-workflow.md))

영입 요청 예: `/harness-creator 카탈로그에서 성능 정찰꾼 영입해`

---

## 🌸 Specialist — 범용 점검 전문가

| 이름 | 역할 한 줄 | 원천 | 이런 프로젝트면 고려 |
|------|-----------|------|-------------------|
| performance-scout | 성능 병목·비효율 패턴 정찰 | dotnet/skills 설계 원칙 | 응답 지연·리소스 사용이 중요한 서비스 |
| test-sentinel | 테스트 커버리지·설계 가능성 파수 | dotnet/skills 설계 원칙 | 테스트가 부족하거나 회귀가 잦은 코드베이스 |
| security-guard | 공격 표면·입력 검증 경비 (OWASP 관점) | dotnet/skills 설계 원칙 | 외부 입력을 받는 모든 서비스 |
| build-doctor | 빌드·의존성 건강 진단 | dotnet/skills 설계 원칙 | 빌드가 느리거나 자주 깨지는 프로젝트 |
| code-modernizer | 낡은 관용구를 현대 문법으로 갱신 | dotnet/skills 설계 원칙 | 오래된 코드베이스, 언어 버전 업그레이드 |

## 🌸 Specialist — .NET 특화

| 이름 | 역할 한 줄 | 원천 |
|------|-----------|------|
| akka-net-specialist | Akka.NET 액터 시스템 설계·점검 | Aaronontheweb/dotnet-skills |
| dotnet-concurrency-specialist | 동시성·async 패턴 점검 | Aaronontheweb/dotnet-skills |
| dotnet-performance-analyst | .NET 성능 분석 (GC/할당/핫패스) | Aaronontheweb/dotnet-skills |
| dotnet-benchmark-designer | BenchmarkDotNet 벤치마크 설계 | Aaronontheweb/dotnet-skills |
| docfx-specialist | DocFX 문서 파이프라인 | Aaronontheweb/dotnet-skills |
| roslyn-incremental-generator-specialist | Roslyn 증분 소스 생성기 | Aaronontheweb/dotnet-skills |

## 🐸 Sage — 사상을 가진 현자 (소환술로 영입)

| 이름 | 사상 | 이런 시점이면 고려 |
|------|------|------------------|
| sage-deming (W. Edwards Deming) | PDSA 지속 개선 사이클 | 작업 회고를 상시 평가로 못 박고 싶을 때 (always-on 적합) |
| sage-evans (Eric Evans) | DDD — 유비쿼터스 언어·경계된 컨텍스트 | 기획/도메인 설계 단계를 점검하고 싶을 때 |
| (후보) sage-fowler (Martin Fowler) | 진화적 설계·리팩터링 | 아키텍처 결정을 점검하고 싶을 때 |
| (후보) sage-codd (E. F. Codd) | 관계형 모델·정규화 | DB 스키마 설계를 점검하고 싶을 때 |

> sage는 영입 시 **사상 정전**(1차 출처 인용 문서)을 함께 작성한다 — 가장 무거운 영입이다.
> 하네스가 성숙하기 전에는 권하지 않는다.

## 🌟 Keeper — 하네스 자산의 지기

| 이름 | 지키는 것 | 이런 하네스면 고려 |
|------|----------|------------------|
| hoshimori (별지기) | 문서 위키링크 그래프 (Zettelkasten) | 지식 문서가 20개를 넘어 연결이 끊기기 시작할 때 |
| chizumori (지도지기) | 정적 뷰(SPA)·퍼블리싱 동기화 | 하네스 상태를 웹 뷰로 공개하고 싶을 때 |
| sai (사이) | 디자인 정전 (design-first, .pen) | UI/디자인 산출물을 단일 정전으로 관리할 때 |

---

## 이용 규칙

1. **한 번에 1~2명** — 명부 전체를 영입하지 않는다. 지금 필요한 것만.
2. **이름은 자유** — 명부의 이름은 참고일 뿐, 당신의 정원에 맞게 바꿔도 된다.
3. **원천을 다시 본다** — 영입 시 원천(레포/사상)을 직접 분석해 **당신 프로젝트의 언어로** 다시 쓴다.
   마더의 정의 파일을 복사해오는 것이 아니다.
4. 명부에 없는 전문가도 얼마든지 영입할 수 있다 — [recruit-workflow.md](recruit-workflow.md) §2 원천 기준을 따르면 된다.
