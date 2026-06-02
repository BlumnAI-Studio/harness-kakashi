---
name: notion-cli
description: |
  Notion REST API를 CLI/스크립트로 호출하는 스킬.
  `.secret/notion.json` 의 Internal Integration Token을 런타임에 로드해
  curl 기반 호출(주 경로)과 Notion 공식 ntn CLI(보조 경로)를 함께 제공한다.

  다음 상황에서 반드시 이 스킬을 사용할 것:
  - "Notion API CLI 호출", "ntn 설치", "notion-curl 사용"
  - 특정 Notion 페이지의 메타/본문 블록을 자동화/CI에서 페치
  - Notion MCP(`mcp__claude_ai_Notion__*`)가 막힌 워크스페이스에 접근해야 할 때
  - `.secret/notion.json` 형태의 토큰을 다른 컴퓨터에 부트스트랩

  스킬 생성/수정 시에는 반드시 skill-creator 스킬을 활용할 것.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Notion CLI Skill — `curl` 주 경로 + `ntn` 보조 경로

검증된 호출 경로(✅)와 실패한 경로(❌)가 명확히 나뉜다.
**기본은 `notion-curl.sh` 를 쓴다**. `ntn` 본체는 설치·헬스체크·향후 OAuth 흐름을 위해 같이 둔다.

## 1. 핵심 사실 (v1.2 검증)

| 항목 | 결과 | 비고 |
|------|------|------|
| Internal Integration Token (`ntn_...`) 직접 REST 호출 | ✅ 동작 | `Authorization: Bearer <token>` + `Notion-Version` 헤더 |
| `ntn doctor` / `ntn --version` / `ntn login` | ✅ 동작 | 헬스체크용 |
| `ntn api -X GET /v1/pages/<id>` | ❌ "no workspace selected" | PAT 만으로는 부족, `ntn login`(OAuth) 또는 `NOTION_WORKSPACE_ID` 필요 |
| `ntn pages create / update` (stdin 마크다운) | ✅ 동작 | workspace_id 자동 주입 필요 — `notion-publish.sh` 가 처리 |
| `ntn pages create` — 마크다운 H1 → 페이지 title 자동 매핑 | ❌ 안 됨 | `properties.title`은 빈 배열로 생성되고 H1은 본문 `heading_1` 블록으로만 들어감. **별도 PATCH 필요** (§13) |
| 페이지 메타 조작 (`PATCH /v1/pages/<id>`, `GET /v1/pages/<id>`, `GET /v1/blocks/<id>/children`) | ✅ PowerShell 네이티브 가능 | `Invoke-RestMethod` 한 줄. WSL/ntn 불필요 (§13) |
| `ntn files create` (multipart) | ❌ Free plan 거부 | "free plan does not support multipart uploads" |
| **단일파트 File Upload API + image 블록 PATCH** | ✅ **동작 (v1.2 검증)** | **`notion-publish.sh attach`가 자동화** |
| `/v1/search` (POST) | ⚠️ indexing 지연 | 새 connection 후 즉시는 0건 — 캐시 |
| `/v1/pages/<id>`, `/v1/blocks/<id>/children` | ✅ 즉시 반영 | 페이지 존재·권한 확인에 사용 |
| 페이지를 Integration에 연결 (Notion UI) | 필수 | "Could not find page" 404의 근본 원인 |

> **결론**: 페이지 페치·블록 페치·검색은 `notion-curl.sh` , 페이지 본문 작성은 `notion-publish.sh create|update`, 이미지 첨부는 `notion-publish.sh attach`. `ntn api`와 `ntn files create`는 직접 사용하지 않는다.

## 2. 기본 설정

| 항목 | 값 |
|------|-----|
| `ntn` 본체 | WSL `~/.local/bin/ntn` (v0.14.0+) |
| `notion-curl.sh` | `.claude/skills/notion-cli/scripts/notion-curl.sh` |
| 시크릿 파일 | `.secret/notion.json` (repo 루트 기준) |
| 시크릿 스키마 | `{ "base_url": "...", "api_key": "ntn_..." }` |
| WSL 토큰 자동주입 | `~/.bashrc` 의 marker 블록 (`wsl-bootstrap.sh`가 추가) |
| 환경변수 override | `NOTION_SECRET_PATH`, `NOTION_CLI_WSL_DISTRO`, `NOTION_API_VERSION` |
| Notion API 버전 | `2022-06-28` (안정) |

## 3. 스킬 자산

```
.claude/skills/notion-cli/
├── SKILL.md
└── scripts/
    ├── install.ps1         # Windows + WSL 부트스트랩 오케스트레이터
    ├── wsl-bootstrap.sh    # WSL ntn 설치 + .bashrc PATH·토큰 로더 (idempotent)
    ├── ntn-wrapper.ps1     # PowerShell `ntn` 함수 (PROFILE에서 dot-source)
    ├── notion-curl.sh      # REST API helper (whoami / page / blocks / search / raw)
    └── notion-publish.sh   # 페이지 create / update / attach (단일파트 이미지 업로드)
```

### notion-publish.sh 서브커맨드 요약

| 서브커맨드 | 동작 | 예시 |
|:---|:---|:---|
| `create <parent_id> <md_file\|->` | `ntn pages create` 래퍼, workspace_id 자동 주입 | `notion-publish.sh create $PARENT page.md` |
| `update <page_id> <md_file\|->` | `ntn pages update` 래퍼 | `notion-publish.sh update $PAGE page.md` |
| `attach <page_id> <image> [after_block_id]` | **단일파트 File Upload API** + image 블록 PATCH | `notion-publish.sh attach $PAGE diagram.png $CALLOUT_ID` |
| (백워드 호환) `<parent_id> <md_file>` | = create | — |

## 4. 주 사용법 — `notion-curl.sh`

### Windows (PowerShell)

```powershell
$skill = "D:\MYNOTE\.claude\skills\notion-cli\scripts\notion-curl.sh"
wsl -d Ubuntu-24.04 -- bash $skill whoami
wsl -d Ubuntu-24.04 -- bash $skill page   34db85459d5580f2a56ae5b07653a370
wsl -d Ubuntu-24.04 -- bash $skill blocks 34db85459d5580f2a56ae5b07653a370 50
wsl -d Ubuntu-24.04 -- bash $skill search "AI-DOC"
wsl -d Ubuntu-24.04 -- bash $skill raw GET /databases/<db_id>
```

### WSL bash 직접

```bash
SKILL=/mnt/d/MYNOTE/.claude/skills/notion-cli/scripts/notion-curl.sh
$SKILL whoami
$SKILL page   <page_id>
$SKILL blocks <page_id> 100
$SKILL search "키워드"
$SKILL raw POST /pages '{"parent":{"page_id":"..."},"properties":{...}}'
```

### 출력 예시 — `page <id>` 성공

```json
{
  "object": "page",
  "id": "34db8545-9d55-80f2-a56a-e5b07653a370",
  "url": "https://www.notion.so/AI-DOC-...",
  "properties": { "title": { "title": [{ "plain_text": "AI-DOC" }] } }
}
```

## 5. 보조 사용법 — `ntn` (PowerShell wrapper)

`$PROFILE` 의 dot-source 블록 덕에 새 PowerShell 세션에서 `ntn` 함수가 노출된다.

```powershell
ntn --version          # ✅ 동작
ntn doctor             # ✅ 동작 (CLI version / config / workspace 경고 확인)
ntn --help             # ✅ 동작
ntn login              # 🔧 워크스페이스 선택이 필요할 때만 (OAuth 브라우저 흐름)
ntn api -X GET ...     # ❌ "no workspace selected" — 대신 notion-curl.sh 사용
```

> `ntn` 자체에 일관된 워크스페이스 컨텍스트가 필요한 워크플로우(예: `pages create`, `datasources query`)가 등장하면 `ntn login` 으로 OAuth 인증을 추가한다. 그전까지는 `notion-curl.sh` 로 충분하다.

## 6. Integration 발급 + 페이지 연결

토큰만으로는 부족하다. **각 페이지(또는 부모 페이지)에 Integration이 명시적으로 연결돼야** 한다.

### 6-1. 토큰 발급 (최초 1회)

1. https://www.notion.so/profile/integrations
2. `+ New integration`
3. Type: **Internal** / Name: `mynote` 등 / 사용할 Workspace 선택
4. **Capabilities** 체크 — 보통 모두 켜기:
   - Read content / Update content / Insert content
   - Read user info (with email은 선택)
   - Read comments / Insert comments
5. `Save` → 상세 페이지 → `Show` → `ntn_...` 토큰 복사
6. `.secret/notion.json` 작성:
   ```json
   {
     "base_url": "https://www.notion.so/<workspace-home>",
     "api_key": "ntn_<token>"
   }
   ```

### 6-2. 페이지에 Integration 연결 (404 방지)

대상 페이지(또는 부모 페이지)에서:

1. 페이지 우측 상단 `⋯` (More options) — `Share` 버튼 아님
2. 메뉴 아래쪽 `Connections` 섹션
3. `+ Add connections` → 검색창에 정확히 `mynote` (또는 본인 Integration 이름)
4. 선택 → `Confirm`

또는 Integration 상세 페이지 `Access` 탭에서 페이지를 직접 선택:
- https://www.notion.so/profile/integrations/internal/&lt;integration_id&gt;

> **상속 규칙**: 부모 페이지에 연결하면 모든 하위 페이지가 자동 상속된다.
> 워크스페이스 홈에 한 번만 연결하는 게 가장 편하다.

### 6-3. 연결 확인

```powershell
# 직접 페치 — indexing 지연 없이 즉시 반영
wsl -d Ubuntu-24.04 -- bash D:\MYNOTE\.claude\skills\notion-cli\scripts\notion-curl.sh page <page_id>
```

404가 200(JSON 본문)으로 바뀌면 성공.

## 7. 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| `404 object_not_found` + "Make sure the relevant pages are shared with your integration" | Integration이 페이지에 미연결 | §6-2 절차로 연결 |
| `401 unauthorized` | 토큰 잘못됨/만료 | `.secret/notion.json` 의 `api_key` 재확인, `whoami` 로 검증 |
| `ntn api` "no workspace selected" | PAT는 워크스페이스 자동 선택 안 됨 | `notion-curl.sh` 로 우회 (또는 `ntn login`) |
| `/v1/search` 가 0건 | indexing 지연 (~30초~수분) | `/v1/pages/<id>` 직접 페치로 검증 |
| PowerShell `ntn: command not found` | `$PROFILE` 미로드 | `. $PROFILE` 또는 PowerShell 재시작 |
| WSL 에서 `ntn` 없음 | `.bashrc` 미로드 | `source ~/.bashrc` 또는 새 셸 |
| `Export-ModuleMember can only be called from inside a module` | dot-sourced 스크립트에서 모듈 cmdlet 호출 | 발생 안 함 (v1.1 에서 제거됨) |

## 8. 다른 컴퓨터 부트스트랩 (1줄)

```powershell
# 1) 저장소 clone + .secret/notion.json 수동 배치
# 2) WSL Ubuntu 준비 (wsl --install -d Ubuntu-24.04 등)
# 3) 한 줄 실행:
& "<repo>\.claude\skills\notion-cli\scripts\install.ps1" -Verify
```

`install.ps1` 동작:
1. WSL distro 자동 감지 (`-WSLDistro` 로 명시 가능)
2. WSL 안에서 `wsl-bootstrap.sh` → ntn 설치 + `.bashrc` PATH·토큰 로더 (markers idempotent)
3. PowerShell `$PROFILE` 에 `ntn-wrapper.ps1` dot-source 라인 추가 (markers idempotent, 인라인 함수 자동 제거)
4. `-Verify` 시 `ntn doctor` 호출

## 9. 안티패턴

| 안티패턴 | 이유 | 올바른 방법 |
|----------|------|-------------|
| Notion API를 `ntn api` 로 호출 | PAT는 workspace 자동 선택 안 됨 → 404 회피 못 함 | `notion-curl.sh` 우선 |
| `.bashrc`/`$PROFILE`에 토큰 평문 박기 | 평문 자격증명 노출 | `.secret/notion.json` 런타임 로드만 사용 |
| 시크릿 파일 경로 하드코딩 | 다른 PC에서 깨짐 | 스크립트 경로 기준 자동 추론 + `NOTION_SECRET_PATH` override |
| WSL distro 하드코딩 (`Ubuntu-24.04`) | 다른 PC의 distro 다름 | `wsl -l -q` 자동 감지 + `NOTION_CLI_WSL_DISTRO` override |
| `/v1/search` 로 페이지 존재 검증 | indexing 지연 — false negative | `/v1/pages/<id>` 직접 페치 |
| 페이지 단위로만 Integration 연결 | 매번 반복 작업 | 부모/홈 페이지에 한 번 연결 → 상속 |
| Notion MCP 가능한데 `ntn` 우회 사용 | MCP가 더 안전·간편 | MCP 우선, 자동화·CI·MCP 막힌 워크스페이스에서만 ntn/curl |
| 페이지 메타 조작(title PATCH, 단건 fetch 등)에 WSL+ntn 띄우기 | 마크다운 변환 필요 없는 호출에 WSL 부팅 비용 낭비 | PowerShell `Invoke-RestMethod` 직접 호출 (§13) |
| vault frontmatter가 포함된 .md 를 그대로 publish | YAML `---` 블록이 노션에 그대로 들어가 페이지 상단이 더러워짐 | publish 전에 frontmatter strip (§13.3) |
| `ntn pages create` 직후 title 확인 없이 종료 | properties.title 이 빈 배열로 만들어져 사이드바에 "Untitled" 로 표시됨 | create 응답에서 `properties.title.title` 길이 확인 → 0이면 §13.1 title PATCH |
| dot-sourced .ps1 에서 `Export-ModuleMember` | 모듈 전용 cmdlet | dot-source는 caller scope에 자동 노출, 호출 자체 불필요 |

## 10. 관련 자산

- 시크릿: `.secret/notion.json` (gitignored 컨벤션 — repo는 private)
- 시크릿 컨벤션: `.secret/README.md`, `.secret/samples/notion.md`
- Notion MCP 1차 채널 스킬: `notion-common-skill`
- 비교 스킬(같은 패턴, REST 직접): `webnori-wiki` (Node.js, `.secret/webnori-wiki.json`)

## 11. 변경 이력

| 버전 | 날짜 | 변경 |
|------|------|------|
| 1.0.0 | 2026-05-16 | 초안 — ntn 부트스트랩 + PowerShell wrapper + WSL bashrc 토큰 로더 |
| 1.0.1 | 2026-05-16 | `ntn-wrapper.ps1` 에서 `Export-ModuleMember` 제거 (dot-source 모드에서 모듈 cmdlet 호출 오류) |
| 1.1.0 | 2026-05-16 | `notion-curl.sh` 추가 — REST API 직접 호출이 주 경로로 격상 |
| 1.1.1 | 2026-05-16 | `notion-publish.sh` 추가 (create), `ntn pages create` workspace 자동 주입 |
| 1.1.2 | 2026-05-16 | `notion-publish.sh` v1.1 — `update` 서브커맨드 추가 + back-compat 2-인자 호출 유지 |
| **1.2.0** | **2026-05-17** | **`notion-publish.sh attach` 서브커맨드 — 단일파트 File Upload API + image 블록 PATCH로 Free-plan 호환 이미지 자동 첨부 (5MB 이하). `after_block_id`로 정확 위치 삽입 가능. Notion MCP 차단/수동 드래그-드롭 우회 첫 자동화 케이스.** |
| **1.3.0** | **2026-05-25** | **§13 신설 — `ntn pages create`의 H1→title 자동 매핑 실패 발견. PowerShell 네이티브 `Invoke-RestMethod` 패턴 정식화 (title PATCH, 페이지 메타 fetch, frontmatter strip). WSL 없이 메타 조작 가능. 안티패턴 3건 추가.** |

## 12. 이미지 첨부 워크플로우 (v1.2)

3단계 자동 처리 (스크립트 내부):

```
1) POST /v1/file_uploads  body={"mode":"single_part","filename":"...","content_type":"..."}
   → 응답: { id, upload_url, status:"pending" }

2) POST <upload_url>  multipart/form-data  file=@<path>
   → 응답: { status:"uploaded" }

3) PATCH /v1/blocks/<page_id>/children
   body={
     "after": "<callout_block_id>"  (선택),
     "children": [{
       "type": "image",
       "image": { "type": "file_upload", "file_upload": { "id": "<upload_id>" } }
     }]
   }
   → 응답: { results: [{ type:"image", image:{ type:"file", file:{ url:"https://prod-files-secure.s3..." } } }] }
```

**제약**:
- Free plan: 단일파트만 (5MB 이하), `ntn files create`의 기본 multipart 모드는 거부됨
- `after_block_id` 미지정 시 페이지 끝에 append
- 업로드된 파일의 S3 URL은 만료 시간이 있지만 Notion이 영구 호스팅 (block 안에 file_upload reference 유지)

**callout 플레이스홀더 + attach 패턴** (Type B*에서 사용):
1. 마크다운에 `<callout icon="📊" color="blue_bg">[이미지 #N] 파일: name.png</callout>` 삽입 → `notion-publish.sh update`
2. `notion-curl.sh raw GET /blocks/<page_id>/children` 로 페이지 블록 조회
3. callout block ID를 텍스트 매칭으로 식별
4. `notion-publish.sh attach <page_id> <image> <callout_id>` × N
5. (선택) 업로드 완료 후 callout 본문은 `DELETE /v1/blocks/<callout_id>` 로 제거 가능 — image는 별도 block ID라 보존됨

## 13. PowerShell 네이티브 메타 조작 (v1.3, 2026-05-25 추가)

**원칙**: 마크다운 → 노션 블록 변환이 필요한 경우에만 WSL+`ntn`을 띄운다. 그 외의 모든 페이지 메타 조작(title PATCH, properties 변경, 페이지/블록 fetch)은 **PowerShell `Invoke-RestMethod` 한 줄**로 끝난다. WSL 부팅 비용도 인용 escape 지옥도 없다.

### 작업 매트릭스

| 작업 | 도구 | 이유 |
|------|------|------|
| 마크다운 본문 → 노션 블록(heading/list/code/table 등) 자동 변환 게시 | **`ntn pages create/update`** (WSL 경유) | 마크다운 파서가 ntn 안에만 있음 |
| 페이지 title PATCH, properties 변경 | **PowerShell `Invoke-RestMethod`** | 단순 REST PATCH |
| 페이지 메타·블록 단건 fetch | **PowerShell `Invoke-RestMethod`** | 단순 REST GET |
| 검색, 워크스페이스 user 조회 | PowerShell 또는 `notion-curl.sh` | 단순 REST |
| 이미지 첨부 (단일파트 업로드 + 블록 PATCH) | **`notion-publish.sh attach`** | 멀티파트 form-data 핸들링 편의 |

### 13.1. 페이지 title PATCH (가장 흔한 후처리)

`ntn pages create` 직후 `properties.title.title`이 빈 배열이면 H1이 title로 안 들어간 것. 다음 패턴으로 패치:

```powershell
$secret  = Get-Content "D:\MYNOTE\.secret\notion.json" -Raw | ConvertFrom-Json
$pageId  = "<page_id_without_dashes_or_with>"
$title   = "MS Agent Governance Toolkit vs Google AX — two opposite layers of 2026 agent infrastructure"

$body = @{
    properties = @{
        title = @{
            title = @(
                @{ type = "text"; text = @{ content = $title } }
            )
        }
    }
} | ConvertTo-Json -Depth 10 -Compress

$headers = @{
    "Authorization"  = "Bearer $($secret.api_key)"
    "Notion-Version" = "2022-06-28"
}

# UTF-8 byte 전달 — 한글/em-dash/이모지 보존
$bytes = [System.Text.Encoding]::UTF8.GetBytes($body)

$resp = Invoke-RestMethod -Method Patch `
    -Uri "https://api.notion.com/v1/pages/$pageId" `
    -Headers $headers -Body $bytes `
    -ContentType "application/json; charset=utf-8"

"title_set: $($resp.properties.title.title[0].plain_text)"
"url:       $($resp.url)"
"public:    $($resp.public_url)"
```

**핵심 포인트:**
- `Body`에 string 그대로 넘기면 PS가 멋대로 ASCII로 재인코딩해 em-dash(`—`)/한글이 깨질 수 있음 → **`[System.Text.Encoding]::UTF8.GetBytes($body)`로 byte array 전달**.
- `-ContentType` 에 `charset=utf-8` 명시.
- `ConvertTo-Json -Depth 10` 필수 (Notion 객체가 중첩 깊음).
- 응답의 `url`은 title 변경 후 자동으로 slug 포함 URL로 갱신됨 (`/MS-Agent-...-36bb...` 형태).

### 13.2. 페이지/블록 fetch (단건)

```powershell
$secret = Get-Content "D:\MYNOTE\.secret\notion.json" -Raw | ConvertFrom-Json
$headers = @{ "Authorization" = "Bearer $($secret.api_key)"; "Notion-Version" = "2022-06-28" }

# 페이지 메타
Invoke-RestMethod -Uri "https://api.notion.com/v1/pages/<page_id>" -Headers $headers

# 블록 children (최대 100건)
Invoke-RestMethod -Uri "https://api.notion.com/v1/blocks/<page_id>/children?page_size=100" -Headers $headers
```

이런 단건 fetch에 WSL 띄우는 건 낭비.

### 13.3. Vault frontmatter strip 후 publish

vault `.md` 에 옵시디언 frontmatter가 있으면 publish 전에 떼야 한다. 떼지 않으면 YAML `---` 블록이 노션 상단에 그대로 들어가 더러워짐.

**WSL bash (`notion-publish.sh` 와 함께 쓸 때):**

```bash
SRC='/mnt/d/MYNOTE/Tech/.../2026-05-25-foo.md'
TMP="$(mktemp -t notion-XXXX.md)"
awk 'BEGIN{n=0}/^---$/{n++;next}n>=2' "$SRC" > "$TMP"
bash /mnt/d/MYNOTE/.claude/skills/notion-cli/scripts/notion-publish.sh create <parent_id> "$TMP"
rm -f "$TMP"
```

**PowerShell 네이티브 strip (참고):**

```powershell
$lines = Get-Content "D:\MYNOTE\Tech\...\2026-05-25-foo.md"
$dashIdxs = (0..($lines.Count-1)) | Where-Object { $lines[$_] -eq '---' } | Select-Object -First 2
if ($dashIdxs.Count -eq 2) {
    $body = $lines[($dashIdxs[1]+1)..($lines.Count-1)] -join "`n"
} else {
    $body = $lines -join "`n"
}
# $body 를 임시 파일에 쓴 뒤 WSL 의 notion-publish.sh 에 전달
```

본문 변환은 여전히 ntn 필요해서 한 단계는 WSL 경유. 하지만 frontmatter strip은 어느 쪽에서 해도 동일.

### 13.4. 표준 1회성 publish 흐름 (캐논)

```
1. vault 에 frontmatter+본문 .md 작성  ← Write (윈도우)
2. frontmatter strip → 임시 파일             ← WSL bash (한 줄 awk)
3. notion-publish.sh create <parent> <tmp>   ← WSL bash (ntn 마크다운 변환)
4. 응답 JSON 에서 page_id 추출
5. title PATCH                                ← PowerShell Invoke-RestMethod (§13.1)
6. vault frontmatter annotate (published_url, notion_page_id, status)  ← Edit (윈도우)
```

WSL 필요 단계는 2~3만. 나머지는 모두 윈도우 네이티브.
