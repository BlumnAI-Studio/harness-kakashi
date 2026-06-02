---
name: image-gen
description: |
  이미지를 생성하거나 편집하는 유틸리티 스킬.
  Gemini(클라우드), OpenAI gpt-image-2(클라우드), ComfyUI Z-Image-Turbo(로컬) 프로바이더를 지원한다.
  생성된 이미지는 image/{프로바이더}/{날짜}-{주제}.png 패턴으로 저장된다.

  다음 상황에서 반드시 이 스킬을 사용할 것:
  - "이미지 생성해줘", "그림 만들어줘", "일러스트 생성", "이미지 그려줘"
  - "제미나이로 이미지 만들어", "제미나이 이용해 이미지 생성"
  - "gpt-image로 그려줘", "gpt-image-2로 이미지 생성", "OpenAI로 이미지 만들어", "ChatGPT 이미지로 생성"
  - "제트이미지를 이용해 이미지생성", "z-image로 그려줘", "ComfyUI로 이미지", "로컬로 이미지 생성"
  - "OOO 내용으로 이미지 생성해줘" 패턴 모두
  - "이미지 편집해줘", "이 이미지를 수정해줘"
  - 콘텐츠 작성 중 삽화/다이어그램/썸네일이 필요할 때
  - 웹노리 위키나 Confluence에 올릴 이미지가 필요할 때
  스킬 생성/수정 시에는 반드시 skill-creator 스킬을 활용할 것.
allowed-tools: Read, Bash, Glob
---

# Image Gen Skill — 이미지 생성/편집 유틸리티

텍스트 프롬프트로 이미지를 생성하거나, 기존 이미지를 편집한다.
프로바이더 추상화 구조로, **Gemini**(클라우드), **OpenAI gpt-image-2**(클라우드), **ComfyUI Z-Image-Turbo**(로컬)를 지원한다.

---

## 1. 기본 설정

| 항목 | 값 |
|------|-----|
| 시크릿 파일 | Gemini: `.secret/gemini.json` · OpenAI: `.secret/openai.json` · ComfyUI: 불필요 |
| 기본 프로바이더 | `gemini` |
| 이미지 저장 루트 | 기본: 저장소 루트 기준 `image/` |
| 저장 패턴 | `image/{provider}/{YYYY-MM-DD}-{topic}.png` |
| 스크립트 | `scripts/image-gen.py` (Python) |

> 경로 override 환경변수: `GEMINI_SECRET_PATH`, `OPENAI_SECRET_PATH`, `IMAGE_GEN_ROOT`.
> 키 관리 형식 전체는 `.secret/README.md` 참조.

### 프로바이더 비교

| 항목 | Gemini | OpenAI gpt-image-2 | ComfyUI Z-Image-Turbo |
|------|--------|--------------------|----------------------|
| 호출명 | `--provider gemini` | `--provider gpt-image-2` (또는 `openai`, `gpt-image`, `gpt-image2`) | `--provider comfyui` 또는 `z-image` |
| 위치 | 클라우드 (Google API) | 클라우드 (OpenAI API) | 로컬 (`192.168.0.64:8188`) |
| API 키 | 필요 (`.secret/gemini.json` → `api_key`) | 필요 (`.secret/openai.json` → `api_key`, `base_url`) | **불필요** (로컬) |
| 모델 | gemini-3.1-flash-image-preview | `gpt-image-2` (override: openai.json `image_model`) | Z-Image-Turbo BF16 (4 step) |
| 이미지 편집 | O (generate + edit) | O (generate + edit, `/images/edits`) | X (text-to-image only) |
| 비율 지원 | 자유 | 1024x1024 / 1024x1536 / 1536x1024 / auto | 1:1, 16:9, 9:16, 4:3, 3:4 |
| 기본 해상도 | 2K | **1536x1024 (wide, 16:9)** | aspect_ratio 기반 |
| 속도 | 네트워크 의존 | 네트워크 의존 | 로컬 GPU, 약 5~15초 |
| 주의 | 일일 쿼터 있음 | 결제·쿼터 OpenAI 정책 | ComfyUI 서버 실행 필요 |

---

## 2. CLI 사용법

> ⚠️ **Windows 환경 주의 — 반드시 `py` 사용**
> Windows에서 PATH의 `python` 명령은 보통 **Microsoft Store 스텁**(`%LOCALAPPDATA%\Microsoft\WindowsApps\python.exe`)을 가리킨다. 이 스텁은 실행 시 단순히 "Python"만 출력하고 종료(exit code 49)하므로 image-gen 스크립트가 **조용히 실패**한다. 특히 백그라운드 실행 시 에러가 잘 안 보여 디버깅이 어렵다.
>
> **반드시 Python Launcher `py`를 사용한다**:
>
> ```bash
> py .claude/skills/image-gen/scripts/image-gen.py generate ...
> ```
>
> `py` 위치 확인: `which py` → 보통 `/c/Users/<user>/AppData/Local/Programs/Python/Launcher/py`. macOS/Linux에서는 `python3` 또는 정상 PATH의 `python` 사용 가능. 본 문서의 모든 예제는 호환을 위해 `python` 으로 표기되어 있으나, **Windows에서는 `py` 로 치환해서 실행한다**.

### 이미지 생성 (Gemini)

```bash
# Windows: python → py 로 치환
python .claude/skills/image-gen/scripts/image-gen.py generate \
  --prompt "A friendly robot reading a book in a cozy library" \
  --topic robot-reading \
  --provider gemini \
  --aspect-ratio 16:9
```

### 이미지 생성 (OpenAI gpt-image-2)

```bash
python .claude/skills/image-gen/scripts/image-gen.py generate \
  --prompt "A friendly robot reading a book in a cozy library" \
  --topic robot-reading \
  --provider gpt-image-2
```

- **기본 해상도는 `1536x1024` (와이드 / 16:9 매핑).** `--aspect-ratio 1:1` 지정 시 `1024x1024`, `9:16` 지정 시 `1024x1536` 으로 자동 매핑.
- `--size`에 직접 `WxH`를 넘기면 그 값을 그대로 사용 (`--size 1024x1024`, `--size 1024x1536` 등).
- 모델 이름은 `.secret/openai.json` 의 `image_model` 키로 override 가능. 미설정 시 `gpt-image-2`.

### 이미지 생성 (ComfyUI Z-Image-Turbo, 로컬)

```bash
python .claude/skills/image-gen/scripts/image-gen.py generate \
  --prompt "A futuristic cityscape at sunset, cyberpunk style" \
  --topic cyber-city \
  --provider comfyui \
  --aspect-ratio 16:9
```

`--provider` 별칭: `comfyui`, `z-image`, `z-image-turbo` 모두 동일하게 동작.

### 이미지 편집 (Gemini only)

```bash
python .claude/skills/image-gen/scripts/image-gen.py edit \
  --prompt "배경을 석양이 지는 해변으로 바꿔줘" \
  --input-image image/samsung.jpg \
  --topic samsung-sunset \
  --provider gemini
```

> **주의**: ComfyUI Z-Image-Turbo는 text-to-image 전용이므로 edit 미지원. 편집은 gemini 사용.

### 출력 형식

성공 시:
```json
{"status": "ok", "path": "image/gemini/2026-03-26-robot-reading.png", "provider": "gemini"}
```

실패 시:
```json
{"status": "error", "message": "에러 메시지"}
```

---

## 3. 워크플로우

```
Step 1. 프롬프트 준비
  → 사용자 요청에서 이미지 설명 추출
  → 영문 프롬프트가 품질이 더 좋음 (한글도 지원)

Step 2. 이미지 생성
  → image-gen.py generate 실행
  → JSON 출력에서 path 확인

Step 3. 결과 확인
  → 생성된 이미지 파일을 Read 도구로 시각적 확인
  → 만족스럽지 않으면 프롬프트 수정 후 재생성

Step 4. (선택) 다른 스킬과 조합
  → 웹노리 위키 첨부: webnori-wiki의 wiki-api.mjs attach 사용
  → Confluence 첨부: confluence-writing 스킬 참조
```

---

## 4. 다른 스킬과의 조합

### 웹노리 위키에 이미지 첨부 게시 (Type F + image-gen)

```bash
# 1. 이미지 생성
python .../image-gen.py generate --prompt "..." --topic my-image

# 2. 위키 페이지에 첨부
node .../wiki-api.mjs attach --pageId {ID} --file image/gemini/2026-03-26-my-image.png

# 3. 본문에 이미지 태그 삽입 후 업데이트
node .../wiki-api.mjs update --pageId {ID} --title "제목" \
  --body '...<ac:image ac:width="600"><ri:attachment ri:filename="2026-03-26-my-image.png" /></ac:image>...'
```

### 콘텐츠 작성 시 삽화 생성 (Type A/B/C + image-gen)

writing 단계에서 삽화가 필요하면 image-gen을 호출하고, 생성된 이미지 경로를 본문에 참조한다.

---

## 5. 프로바이더 구조

```
scripts/
├── image-gen.py              ← 메인 CLI
└── providers/
    ├── __init__.py           ← 프로바이더 레지스트리
    ├── gemini_provider.py    ← Gemini 구현 (클라우드, API 키 필요)
    ├── openai_provider.py    ← OpenAI gpt-image-2 (클라우드, API 키 필요)
    └── comfyui_provider.py   ← ComfyUI Z-Image-Turbo (로컬, 키 불필요)
```

### ComfyUI 서버 요구사항

- 엔드포인트: `http://192.168.0.64:8188`
- 서버 시작: `cd C:\Users\psmon\ComfyUI && .\venv\Scripts\Activate.ps1 && python main.py --listen 0.0.0.0 --port 8188`
- 서버 미실행 시 에러 메시지에 시작 방법 안내 포함

향후 프로바이더 추가 시:
1. `providers/{name}_provider.py` 생성 (동일 인터페이스: generate, edit)
2. `providers/__init__.py`에 등록
3. `--provider {name}`으로 호출

---

## 6. 안티패턴

| 안티패턴 | 이유 | 올바른 방법 |
|----------|------|-------------|
| API key를 스킬이나 스크립트에 하드코딩 | 보안 위험 | `.secret/gemini.json` → `api_key` 자동 로딩 (ComfyUI는 키 불필요) |
| 키를 여러 파일에 중복 보관 | 동기화 누락 | 서비스당 `.secret/{service}.json` 하나만 사용 |
| JSON 출력을 파싱하지 않고 경로 추측 | 에러 시 잘못된 경로 사용 | status 필드 확인 후 path 사용 |
| 한글 파일명 사용 | OS 호환성 문제 | 영문 topic 키워드 사용 |
| 이미지 확인 없이 바로 게시 | 품질 미검증 | Read 도구로 시각적 확인 후 게시 |
| ComfyUI에 edit 명령 호출 | NotImplementedError 발생 | 편집은 gemini 또는 gpt-image-2 provider 사용 |
| OpenAI에 `2K` 같은 Gemini용 size 값 전달 | OpenAI는 WxH 또는 `auto` 만 허용 | `--aspect-ratio 1:1` 또는 `--size 1024x1024` 처럼 명시. WxH 매칭 실패 시 1024x1024 로 fallback |
| OpenAI API 키를 다른 곳에 저장 | 프로바이더가 못 찾음 | `.secret/openai.json` 의 `api_key` / `base_url`. 모델은 `image_model` 키로 override |
| ComfyUI 서버 미확인 상태로 생성 시도 | 타임아웃/연결 오류 | 서버 상태 먼저 확인 또는 에러 메시지의 시작 안내 참조 |
| Windows에서 `python` 명령 사용 | MS Store 스텁이 조용히 실패 (exit 49, "Python"만 출력). 백그라운드 실행 시 11건 모두 무음 실패한 사례 있음. | **반드시 `py` 사용** — `py .claude/skills/image-gen/scripts/image-gen.py generate ...` |
