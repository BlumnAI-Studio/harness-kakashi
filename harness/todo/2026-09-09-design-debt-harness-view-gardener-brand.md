# [design-debt] 마을 지도 브랜드 텍스트 — .pen 정전 회수

**등록**: 2026-09-09 (v1.9.0 정원지기 네이밍)
**담당**: [[sai|사이]] (초수의화), 공동: [[chizumori|치즈모리]]
**정책**: `harness.config.json` `design.debtPolicy` — 7일 미회수 시 정원지기 경고, 30일 시 다음 마이너 차단

## 부채 내용

정원지기 네이밍 전환에서 `Home/harness-view` **코드**의 브랜드 문자열을 먼저 바꿨다 — 정전(`Home/design/harness-view.pen`)이 아직 따라오지 않았다.

| 위치 | 코드 (현재) | .pen 정전 (현재) |
|------|-----------|----------------|
| 사이드바 `sb-name` | 정원의 하네스 | 카카시 하네스 |
| 사이드바 `sb-logo` | 🧑‍🌾 | 🥷 |
| 브레드크럼 접두 | 🧑‍🌾 정원의 하네스 / | 🥷 카카시 하네스 / |
| `<title>` | 정원의 하네스 — 마을 지도 | (확인 필요) |

## 회수 절차

1. `초수의화 발동` — Pencil MCP로 `harness-view.pen` 사이드바 컴포넌트 텍스트·로고 갱신
2. `harness/knowledge/design/pencil-design-locations.md`에 브랜드 문자열 위치 기록
3. 코드 ↔ 정전 대조 후 이 파일 삭제 + `harness/logs/sai/`에 회수 로그

## 참고

- [[v1.9.0|📝 v1.9.0 — 정원지기 네이밍]]
- [[design-first|⚖️ design-first 원칙 정전]] — Debt Recovery
