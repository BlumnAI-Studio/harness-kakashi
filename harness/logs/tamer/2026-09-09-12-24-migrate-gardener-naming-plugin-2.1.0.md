---
date: 2026-09-09T12:24:00+09:00
agent: tamer
type: migration
mode: migrate
command: "/harness-creator migrate (마더 정원 자기 적용) + 플러그인 2.1.0 릴리스"
---

# 정원지기 네이밍 전환 — 카카시 → 정원지기, 플러그인 2.1.0

## 실행 요약

사용자 요청: 하네스의 메타(카카시)를 **정원지기**로 바꾸고 "정원의 하네스"로 개편. 플러그인 명령은 `/harness-creator`로 단축.
동작은 동일. 설치명·프로젝트명(`harness-kakashi`)은 유지. 기존 버전에서 업그레이드 시 리네이밍이 되도록 마이그레이션 지원.
지침에 카카시 규칙이 남아 있을 수 있으므로 정원지기 = 카카시 하위 호환. 노출되는 도움말은 정원지기로 통일.

사용자 확인 2건: 차크라 스킬도 `/harness-chakra`로 단축 / 배포판 버전은 2.0.0이 이미 origin에 있으므로 **2.1.0**.

작업 순서:
1. `plugins/` (source of truth) — 스킬 디렉토리 `git mv` 2건, 본문 문구 전환, Mode F(Migrate) 신설, 이름 규칙 섹션 추가, config 스키마 1.2.0, log-template enum 확장
2. deprecated 별칭 스킬 2종 신설 (`harness-kakashi-creator`, `harness-chakra-kakashi` → 새 명령 위임)
3. 매니페스트 3곳 2.1.0, CHANGELOG 2.1.0 항목
4. README / README-EN — 브랜드·명령·업그레이드 안내
5. 마더 정원에 Mode F 적용 — config 1.2.0·v1.9.0, tamer.md 정원지기 정렬, docs/README, agents-and-evaluation, lore 주석
6. 마을 지도(harness-view) 문자열·아이콘 판정·news.json
7. `.claude/skills/` 동기화 (diff 0)

## 결과

- 배포 플러그인 **2.1.0**: 4 스킬 디렉토리(정식 2 + 별칭 2), Mode A~F
- 마더 정원 **1.9.0**: `harness/docs/v1.9.0.md`
- 변경 파일 약 40개 (`git status` 참조). 로그·구 버전 문서·스토리 튜토리얼·prompt 원문은 건드리지 않음
- 잔여 '카카시' 표기(배포 스킬 내): 이름 규칙(하위 호환)·Mode F 절차 설명·네임스페이스(`harness-kakashi`, `kakashi-harness`)만 — 의도된 것

## 평가

### Plan
정원 은유로 메타 에이전트를 재정의하고, 이름만 바꾸되 (a) 구 지침 호환 (b) 설치 경로 불변 (c) 기록 불변 (d) 업그레이드 경로 제공 — 네 조건을 모두 만족시킨다는 가설.
기대: 기존 사용자가 `/plugin` 업데이트 → `/harness-creator migrate` 두 단계로 전환 완료.

### Do
위 실행 요약 1~7. 마더 정원 자체에 Mode F를 먼저 적용해 절차의 빈 곳을 확인했다 — 마더 tamer.md가 "조련사" 상태로 배포 템플릿과 역방향 drift(2.0.0 잔여)였음이 드러나 함께 정렬.

### Study
- (a) 호환: SKILL.md "이름 규칙" + 별칭 스킬 + 차크라 구 트리거 유지 — 충족. 단, 별칭 스킬이 스킬 목록에 '카카시'를 노출한다 — 3.0.0 제거까지의 의도된 trade-off
- (b) 설치 경로: 매니페스트 name/설치명 무변경 — 충족
- (c) 기록: logs/·docs/v*.md 무변경 — 충족. 대신 `mode: kakashi-copy` 구 값을 읽기 규칙으로 흡수
- (d) 업그레이드: Mode F 절차 문서화 — **실행 검증은 미완**. 실제 2.0.x 설치본에서 업데이트 → migrate 스모크 테스트가 남음
- 부수 발견: harness-view 코드가 `.pen` 정전을 앞섰다 (design-first 부채)
- 정원지기 3축 (Mode F는 하네스 자체 개편이므로 적용): 워크플로우 개선도 **B** (온보딩 문구 단일 은유로 정리, 실측 전) / Claude 스킬 활용도 **4** (skill-creator·별칭 위임 구조 활용) / 하네스 성숙도 **L4** (변화 없음 — 구조가 아니라 이름의 변화)

### Act
- 사용자 확정 결정을 메모리에 반영 (배포판 컨셉 메모리 갱신)
- 다음 사이클 후보: 외부 2.0.x 설치본 업그레이드 스모크 테스트, `.pen` 부채 회수, 3.0.0에서 별칭 제거

## 다음 단계 제안

- [승격] `harness/todo/2026-09-09-design-debt-harness-view-gardener-brand.md` — `.pen` 사이드바 "카카시 하네스" → "정원의 하네스" (사이, 7일 경고 정책)
- 외부 프로젝트에 2.0.0 설치 → 2.1.0 업데이트 → `/harness-creator migrate` 스모크 테스트 (2.0.0 로그의 미해소 항목과 통합)
- `Home/harness-view` 인덱스 재생성(`node Home/harness-view/scripts/sync-view.js`) 후 `doc-v1.9.0` 태그로 마을 지도 배포
