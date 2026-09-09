---
name: harness-kakashi-creator
description: |
  (deprecated 별칭) 정원지기 스킬의 구 명령. 플러그인 2.1.0부터 /harness-creator 로 단축됐다.
  이 스킬은 자동 트리거하지 않는다. /harness-kakashi-creator 로 호출되면 동일 인자로 /harness-creator 를 실행한다.
  3.0.0에서 제거 예정.
argument-hint: "[명령] [요구사항]"
---

# /harness-kakashi-creator → /harness-creator (별칭)

이 명령은 **정원지기(`/harness-creator`)의 구 명칭**이다. 동작은 완전히 같다 — 이름만 짧아졌다.

## 동작

1. Skill 도구로 `harness-creator`를 **동일한 `$ARGUMENTS`** 로 호출한다. 다른 처리는 하지 않는다.
2. 호출 결과 보고의 **맨 앞에** 다음 한 줄을 덧붙인다 (한 세션에 1회만):

```
ℹ️ /harness-kakashi-creator 는 /harness-creator 로 이름이 바뀌었습니다 (동작 동일). 구 네이밍 정리는 `/harness-creator migrate`.
```

## 규칙

- 여기서 하네스 로직을 직접 수행하지 않는다 — 항상 `harness-creator`에 위임한다.
- "카카시 하네스"는 정원지기의 구 명칭이다. 사용자 지침에 남은 '카카시' 규칙은 정원지기 규칙으로 해석된다 (자세한 규칙은 `harness-creator` SKILL.md "이름 규칙").
