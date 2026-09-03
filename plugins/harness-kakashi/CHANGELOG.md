# Changelog — harness-kakashi 플러그인

배포판 버전은 마더 하네스(`harness/harness.config.json`)의 버전과 **디커플링된 자체 semver**다.
마더 버전은 이 저장소의 이용 기록(정원 성장사)을 추적하고, 이 파일은 배포물의 변경만 추적한다.

## 2.0.0 (2026-09-04) — 라이트웨이 재정비

**Breaking**: `harness-build` 스킬 제거 → 2스킬 체계(creator + chakra).

- ✂️ 사용자용 `harness-build` 스킬을 `harness-kakashi-creator`에 통합
  - Mode E(Build & Verify) 신설: 구조 검증 / 버전 관리
  - 에이전트·엔진 스켈레톤은 recruit-workflow로 이동
- 🔧 스킬 설치 경로 하드코딩 제거 — 마켓플레이스 설치 시 `init` 파손 버그 수정
  (템플릿 복사를 스킬 베이스 디렉토리 기준으로, 차크라 로그 폴백을 워크스페이스로)
- 🐸 `references/recruit-workflow.md` 신설 — 5-파일 영입 패턴, specialist/sage/keeper 타입,
  라이트웨이 영입 원칙 (전문가는 배포하지 않는다, 필요할 때 하나씩)
- 📖 `references/recruit-catalog.md` 신설 — 마더 정원 실전 검증 전문가 명부 1페이지
- 📋 `templates/harness/templates/log-template.md` 신설 — 로그 frontmatter 스키마 강제,
  mode enum 10종, PDSA 본문 H3 규칙
- ⚖️ `references/evaluation.md` 평가 통합 원칙 — 기본 축 하나, 합성 등급 금지
- 🧬 config 스키마 1.1.0 — `evaluation`/`keepers`/`design` 선택 확장 필드 문서화

## 1.4.0 (2026-04-24)

- 버전 문자열만 갱신 (콘텐츠는 1.3.0과 동일)

## 1.3.0 (2026-04-20)

- 🥷 `harness-chakra-kakashi`(차크라 감사) 스킬 추가 — 2스킬 구조 시작
- 버전 3파일 정렬

## 1.2.0 이전

- 마더 하네스 버전과 통합 관리되던 시기 — `harness/docs/v*.md` 참조
