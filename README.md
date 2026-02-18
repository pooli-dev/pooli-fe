# 🐙 POOLI Frontend

React + TypeScript 기반의 POOLI 프론트엔드 팀 프로젝트입니다.
코드 품질 관리와 자동 리뷰·CI가 포함된 기본 개발 환경을 제공합니다.

---

# 🛠️ Tech Stack

**Core**

* React
* TypeScript

**Styling**

* Tailwind CSS
* shadcn/ui

**State**

* Zustand

**Code Quality**

* ESLint + Prettier
* Husky (Git Hook)

**CI / Review**

* GitHub Actions
* CodeRabbit

---

# 🚨 Push 전 체크리스트

PR 올리기 전 반드시 실행:

```bash
git checkout develop
git pull origin develop
npm run lint
npm run build
```

✔ lint 통과
✔ build 성공

그 후 feature 브랜치에서 push & PR 생성.

---

# 🧹 ESLint + Prettier

코드 스타일과 오류를 자동으로 검사합니다.

### ✔ lint 검사

```bash
npm run lint
```

* unused 변수
* React Hook 규칙 위반
* Tailwind class 순서 문제

등을 검사합니다.

---

### ✔ 자동 수정

```bash
npm run lint --fix
```

또는

```bash
npx prettier --write .
```

코드 포맷을 자동 정리합니다.

---

# 🪝 Husky Git Hook

commit 전에 자동으로 lint를 실행하여
에러 코드가 저장소에 들어오는 것을 방지합니다.

### ✔ 동작 흐름

1. 개발자가 commit 실행
2. Husky가 pre-commit hook 실행
3. lint 실패 시 commit 중단

Hook 위치:

```
.husky/pre-commit
```

예시:

```bash
npm run lint
```

👉 lint 실패하면 commit 자체가 막힙니다.

---

# 🤖 CodeRabbit 리뷰

PR 생성 시 자동 코드 리뷰가 실행됩니다.

플랫폼 👉 GitHub
리뷰 봇 👉 CodeRabbit

### ✔ 리뷰 내용 예시

* 성능 개선 제안
* 코드 스타일 문제
* 잠재적 버그
* 리팩토링 제안

리뷰 반영 후 다시 push하면 자동으로 재검사됩니다.

---

# 🔄 브랜치 전략

* `main` → 배포용
* `develop` → 통합 개발
* `feature/*` → 기능 개발

예시:

```
feature/login-ui
feature/data-chart
```

PR은 항상 `develop` 대상으로 생성합니다.