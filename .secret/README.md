# .secret/ — 개인 키 저장소

> 이 디렉터리는 **나만 접근 가능한 private 저장소** 안에서 운영되는 키 보관소다.
> 외부 공개되거나 공유되는 일이 없다는 전제로 평문 JSON을 사용한다.
> 키 파일인 json은 

## 원칙

- **서비스 1개 = 파일 1개**. 키 추가는 새 `.json` 파일 한 개 만들면 끝.
- 모든 파일은 **평면 JSON**. 스키마/검증 도구 없음.
- 사용 예제(curl/Python 스니펫)는 `samples/` 안에 placeholder로 보관.

## 현재 등록된 서비스

| 파일 | 용도 |
|------|------|
| `openai.json` | OpenAI ChatGPT |
| `gemini.json` | Google Gemini (텍스트 + 이미지) |
| `notion.json` | Notion API (ntn CLI, Internal Integration Token) |
| `webnori-wiki.json` | wiki.webnori.com (설치형 Confluence) |
| `atlassian-confluence.json` | blumnai.atlassian.net (Confluence Cloud) |
| `local-ai-macmini.json` | Mac mini 40GB (OpenAI 호환 LLM) |
| `local-ai-amd.json` | AMD AI 128GB (OpenAI 호환 LLM) |
| `local-comfyui.json` | LAN ComfyUI Z-Image-Turbo |
| `x.json` | (별도 OAuth 토큰 — 자체 관리) |

## 키 읽기 패턴

### Python

```python
import json, pathlib
cfg = json.loads(pathlib.Path("D:/MYNOTE/.secret/gemini.json").read_text(encoding="utf-8"))
api_key = cfg["api_key"]
```

### Node.js

```js
import { readFileSync } from "node:fs";
const cfg = JSON.parse(readFileSync("D:/MYNOTE/.secret/webnori-wiki.json", "utf-8"));
```

### Bash (jq)

```bash
jq -r .api_key .secret/openai.json
```

## 키 추가·갱신 절차

1. 새 서비스를 등록할 때: `.secret/{service-name}.json` 생성, 평면 JSON으로 작성.
2. 기존 키 갱신: 해당 파일을 직접 편집.
3. 사용 예제가 필요하면 `samples/{service-name}.md` 추가 (키는 `jq -r .api_key .secret/...` 로만 표기).

## 참고하는 스킬·스크립트

- `.claude/skills/image-gen/scripts/providers/gemini_provider.py` → `.secret/gemini.json`
- `.claude/skills/notion-cli/scripts/ntn-wrapper.ps1` (PowerShell `ntn` 함수) → `.secret/notion.json`
- `.claude/skills/notion-cli/scripts/wsl-bootstrap.sh` (WSL `.bashrc` 토큰 로더) → `.secret/notion.json`
- `.claude/skills/webnori-wiki/scripts/wiki-api.mjs` → `.secret/webnori-wiki.json`
- `.codex/skills/confluence-api-writing/scripts/confluence_api.py` → `.secret/atlassian-confluence.json`
- `.claude/skills/confluence-writing/SKILL.md` (이미지 첨부 단계) → `.secret/atlassian-confluence.json`

## 안티패턴

| 안티패턴 | 올바른 방법 |
|----------|-------------|
| 같은 키를 여러 파일에 중복 저장 | 서비스당 파일 하나만 |
| `samples/` 안에 평문 키 박기 | placeholder + `jq -r ... .secret/X.json` |
| 스킬 스크립트에서 정규식으로 키 패턴(`AIza...`) 추출 | JSON 키 경로(`.api_key`)로 직접 접근 |
