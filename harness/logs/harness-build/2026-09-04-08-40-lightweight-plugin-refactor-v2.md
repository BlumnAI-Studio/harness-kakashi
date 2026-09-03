---
date: 2026-09-04T08:40:00+09:00
agent: harness-build
type: release-prep
mode: Mode 1 + Mode 2 + Mode 3 + Mode 5
---

# 배포판 라이트웨이 재정비 — 플러그인 v2.0.0

## 변경 대상

- `plugins/harness-kakashi/skills/harness-build/` — **삭제** (creator로 통합)
- `plugins/harness-kakashi/skills/harness-kakashi-creator/SKILL.md` — 경로 수정, Mode E 신설, Mode B 영입 확장, 로그 스키마 강화, config 스키마 1.1.0
- `plugins/harness-kakashi/skills/harness-kakashi-creator/references/recruit-workflow.md` — 신설
- `plugins/harness-kakashi/skills/harness-kakashi-creator/references/recruit-catalog.md` — 신설
- `plugins/harness-kakashi/skills/harness-kakashi-creator/references/evaluation.md` — 평가 통합 원칙 추가
- `plugins/harness-kakashi/skills/harness-kakashi-creator/references/skill-separation.md` — 마더 절차 참조 제거
- `plugins/harness-kakashi/skills/harness-kakashi-creator/templates/harness/templates/log-template.md` — 신설
- `plugins/harness-kakashi/skills/harness-chakra-kakashi/SKILL.md` — 로그 폴백 경로 수정
- `plugins/harness-kakashi/CHANGELOG.md` — 신설 (배포판 독립 히스토리)
- `plugins/harness-kakashi/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` — 1.4.0 → **2.0.0**
- `README.md`, `README-EN.md` — 스킬 표 2종 체계, 버전 디커플링 정책
- `.claude/skills/harness-build/SKILL.md` — 동명이술 해소 반영, Mode 5 디커플링 절차

## 변경 내용

**컨셉**: 배포판은 "전문가를 담는 상자"가 아니라 "전문가를 영입하는 도구".
발굴한 전문가를 항상 영입하는 게 목적이 아니며, 영입은 사용자의 선택이다.
이용 기록(로그 13건 + todo) 분석에서 나온 6개 개선점을 단계별 커밋으로 반영:

1. **경로 버그 수정** — init 템플릿 복사·차크라 로그가 `.claude/skills/` 하드코딩이라
   마켓플레이스 설치 시 파손 → 스킬 베이스 디렉토리(`{SKILL_DIR}`)/워크스페이스 기준으로
2. **2스킬 체계** — 사용자용 harness-build를 creator에 흡수(Mode E 신설), 동명이술 충돌 해소
3. **영입 워크플로우 증류** — 두꺼비 소환술의 5-파일 패턴 일반화, specialist/sage/keeper
   타입 판정, config 확장 필드(evaluation/keepers/design) 스키마 문서화 (콘텐츠는 미배포)
4. **영입 카탈로그** — 마더 검증 전문가 명부 1페이지 (골라서 영입, 복사 금지·원천 재분석)
5. **로그 템플릿 강제** — mode enum 10종, trigger/command 택1, PDSA 본문 H3 규칙,
   합성 등급 금지 (todo `2026-04-19-log-schema-and-eval-alignment.md` 묶음 A·B·C 해소)
6. **버전 디커플링 명문화** — 배포판 자체 semver + CHANGELOG, 매니페스트 3곳 동시 갱신
   체크리스트 (v1.5~1.8 드리프트 재발 방지)

## 테스트 결과

- `plugins/` ↔ `.claude/skills/` diff 0 확인 (creator, chakra)
- 배포판 templates/harness/agents/ → tamer.md만 포함 확인
- 매니페스트 3곳 2.0.0 일치 확인
- 저장소 내 `harness-build` 잔여 참조: 마더 스킬(의도) + README 통합 안내 문구만 남음

## 비고

- PDSA CLI(`pdsa` 프로젝트 `harness-kakashi`) 사이클 #1로 본 작업의 Plan/Do/Study/Act 기록
- 마더 하네스 버전(1.8.0)은 디커플링 정책에 따라 이번 릴리스에서 변경하지 않음
- 미해소 잔여: 마더 자신의 기존 로그 13건 retrofit 여부, 마더 tamer.md ↔ 배포 템플릿 역방향 drift —
  별도 후속 (todo 갱신 예정 아님, 이번 작업 범위 밖)
