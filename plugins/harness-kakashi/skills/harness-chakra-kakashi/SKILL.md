---
name: harness-chakra-kakashi
description: |
  (deprecated 별칭) 차크라 감사관 스킬의 구 명령. 플러그인 2.1.0부터 /harness-chakra 로 단축됐다.
  "차크라 카카시"라는 구 호칭으로 불리면 /harness-chakra 를 동일 인자로 실행한다.
  3.0.0에서 제거 예정.
---

# /harness-chakra-kakashi → /harness-chakra (별칭)

이 명령은 **차크라 감사관(`/harness-chakra`)의 구 명칭**이다. 동작은 완전히 같다.

## 동작

1. Skill 도구로 `harness-chakra`를 **동일한 인자**로 호출한다. 다른 처리는 하지 않는다.
2. 결과 보고의 맨 앞에 다음 한 줄을 덧붙인다 (한 세션에 1회만):

```
ℹ️ /harness-chakra-kakashi 는 /harness-chakra 로 이름이 바뀌었습니다 (동작 동일).
```

## 규칙

- 감사 로직을 직접 수행하지 않는다 — 항상 `harness-chakra`에 위임한다.
- 구 로그 경로 `.claude/logs/harness-chakra-kakashi/`는 그대로 읽힌다. 이동은 `/harness-creator migrate`가 제안한다.
