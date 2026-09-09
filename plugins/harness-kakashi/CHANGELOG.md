# Changelog — harness-kakashi 플러그인 (정원의 하네스)

배포판 버전은 마더 하네스(`harness/harness.config.json`)의 버전과 **디커플링된 자체 semver**다.
마더 버전은 이 저장소의 이용 기록(정원 성장사)을 추적하고, 이 파일은 배포물의 변경만 추적한다.

## 2.1.0 (2026-09-09) — 정원지기 네이밍 (카카시 → 정원지기)

**Breaking(명령명)**: 스킬 명령 단축 — `/harness-kakashi-creator` → **`/harness-creator`**, `/harness-chakra-kakashi` → **`/harness-chakra`**.
구 명령은 deprecated 별칭 스킬로 남아 새 명령에 위임한다 (3.0.0 제거 예정). **동작 방식은 동일** — 이름과 문구만 바뀐다.

- 🧑‍🌾 메타 에이전트의 사용자 노출 이름 **카카시 → 정원지기** — 정원을 가꾸는 정원지기 컨셉으로 안내·도움말·온보딩 문구 통일.
  "카카시"는 구 명칭으로 하위 호환 (SKILL.md "이름 규칙": 정원지기 = 카카시 — 지침에 남은 '카카시' 규칙은 정원지기 규칙으로 해석)
- 🌱 스킬 복사 은유 **사륜안 → 접목(接木)**. Mode C `Kakashi Copy` → `Skill Copy`, 로그 디렉토리/mode `kakashi-copy` → `skill-copy`
  (구 로그 값은 동일하게 읽음, 기존 파일은 이동하지 않음)
- 🥷 차크라 스킬 페르소나 **차크라 카카시 → 차크라 감사관**. 로그 폴백 경로 `.claude/logs/harness-chakra/`
- 🔁 **Mode F: Migrate** 신설 — `/harness-creator migrate`. 2.0.x 이전 `init` 하네스의 config(`$schemaVersion` 1.2.0)·tamer.md·docs/README.md·log-template 을
  정원지기 네이밍으로 전환하고, CLAUDE.md 등 잔여 참조는 목록만 보고. 활성화 시 구 네이밍을 감지하면 안내 한 줄만 덧붙인다 (자동 실행 금지)
- 🧬 config 스키마 1.2.0 — `$schema: "kakashi-harness"`는 네임스페이스로 **유지**, `$schemaVersion`만 올림
- 📋 log-template — `type` enum에 `migration`, `mode` enum에 `migrate` 추가
- 📦 **유지되는 것**: 플러그인/마켓플레이스 설치명(`harness-kakashi@harness-kakashi-skills`), 저장소명, `$schema` 값 — 설치·업데이트 경로는 그대로

**업그레이드**: `/plugin` 에서 `harness-kakashi` 업데이트 → `/harness-creator migrate` (기존 하네스가 있는 경우).

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
