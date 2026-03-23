# 🐙 POOLI - 가족 데이터 사용량 관리 및 정책 제어 서비스

<p align="center">
  <img src="src/assets/img/muneo1.png" alt="POOLI Character" width="200" />
</p>

### 🏆 LG 유플러스 유레카 SW 아카데미 3기 최종 융합프로젝트 🏅

> [POOLI 바로가기](https://www.pooliapp.com) | [POOLI Admin 바로가기](https://office.pooliapp.com) | [📒 Notion](https://www.notion.so/yerin1412/1-2c3389b3e03981e2a56bdaa42ff24264)

---

## 🗺 프로젝트 소개

**POOLI**는 LG유플러스 가족 결합 상품 사용자를 위한 **데이터 사용량 관리 및 정책 제어 서비스**입니다.

가족 구성원별 데이터 사용량을 실시간으로 모니터링하고, 앱별 사용량 제한·속도 제한·차단 정책을 설정할 수 있습니다. 공유 데이터풀 관리, 알림 발송, 문의 관리 등 관리자 기능도 함께 제공하여 가족 단위의 체계적인 데이터 관리를 지원합니다.

### 주요 기능

- 📊 가족 구성원별 데이터 사용량 실시간 조회 및 사용량 추이 시각화
- 📱 앱별 사용량 제한 / 속도 제한 / 차단 정책 관리
- 🔄 가족 공유 데이터풀 관리 및 데이터 양도
- 🔔 알림 발송 및 문의 관리 (관리자)
- 👨‍👩‍👧‍👦 가족 구성원 권한 및 역할 관리

---

## 🚩 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | POOLI |
| 팀명 | 1조 무너팸 |
| 주제 | LG U+ 가족 데이터 사용량 관리 및 정책 제어 서비스 |
| 개발 기간 | 2025.02.24 - 2025.03.24 |

---

## 👩🏻‍🤝‍🧑🏻 MEMBERS

### Backend Common Roles
- 🟢 모니터링 관련 API 구현
- 🟢 DB, 기초 인프라 설계
- 🟢 프로젝트 구조설계

### Frontend Common Roles
- 🟢 피그마 와이어프레임 및 UI 설계
- 🟢 공통 UI 컴포넌트 라이브러리 및 디자인 시스템 구축

| | 이승현 | 김미수 | 김민수 |
|:---:|:---:|:---:|:---:|
| 역할 | `BE LEADER` | `BE` | `BE` |
| 담당 | 모니터링 세팅 및 이상치 탐지 구현 | 데이터 사용 처리 로직 구현, Redis/Lua 기능 고도화 | 모니터링 세팅 및 이상치 탐지 구현 |

| | 김준하 | 박재현 | 현홍석 |
|:---:|:---:|:---:|:---:|
| 역할 | `BE` | `BE` | `BE` |
| 담당 | 데이터 사용 처리 로직 구현, 인프라 구축, CI/CD 배포 자동화, 테스트 데이터 생성 | Streams(MQ) + 소비 인프라 고도화 | 모니터링 세팅 및 이상치 탐지 구현, AIOps 도입 |

| | 이해니 | 김예린 |
|:---:|:---:|:---:|
| 역할 | `FE LEADER` | `FE` |
| 담당 | 메인, 알림, 정책, 구성원별 정책, 사용로그, UI 구현 및 API 연동, TanStack Query 도입 | 공유풀, 상세페이지, 설정, 문의, 어드민 UI 구현 및 API 연동, 깃허브 세팅 및 도메인 분기처리 |

---

## 🛠 Tech Stack

### Frontend

<p align="center">

| Frontend Language | Code Quality | 상태 관리 |
|:---:|:---:|:---:|
| <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /> | <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" /> <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" /> | <img src="https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=zustand&logoColor=white" /> <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" /> |

| Styling | Build |
|:---:|:---:|
| <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" /> <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" /> | <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" /> |

</p>

### Backend

<p align="center">

| Language | Framework | Database |
|:---:|:---:|:---:|
| <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" /> | <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" /> | <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" /> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" /> |

| Infra | CI/CD | Monitoring |
|:---:|:---:|:---:|
| <img src="https://img.shields.io/badge/Amazon_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white" /> <img src="https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white" /> | <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" /> <img src="https://img.shields.io/badge/CodeDeploy-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white" /> | <img src="https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white" /> <img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" /> <img src="https://img.shields.io/badge/Loki-F46800?style=for-the-badge&logo=grafana&logoColor=white" /> |

</p>

### Collaboration Tools

<p align="center">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white" />
<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
<img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white" />
<img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white" />
<img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" />
</p>

---

## 📸 서비스 화면

### 사용자 페이지

| 화면 | 기능 |
|:---:|:---|
| <img src="docs/screenshots/login.png" width="250" /> | **로그인** <br> 사용자 인증을 통해 서비스에 접속합니다. |
| <img src="docs/screenshots/main.png" width="250" /> | **메인 홈** <br> 가족 구성원 목록과 전체 데이터 현황을 한눈에 확인할 수 있습니다. |
| <img src="docs/screenshots/detail.png" width="250" /> | **데이터 사용량 상세** <br> 기본/공유 데이터 사용량 조회, 최근 3개월 사용량 추이 차트, 앱별 사용량 시각화를 제공합니다. |
| <img src="docs/screenshots/policy-detail.png" width="250" /> | **정책 상세** <br> 현재 적용 중인 앱별 사용량 제한, 속도 제한, 차단 정책을 확인할 수 있습니다. |
| <img src="docs/screenshots/shared-data.png" width="250" /> | **공유 데이터** <br> 가족 공유 데이터풀 현황 조회 및 구성원 간 데이터 양도 기능을 제공합니다. |
| <img src="docs/screenshots/alarm.png" width="250" /> | **알림** <br> 정책 변경, 데이터 사용량 경고 등 알림 내역을 확인합니다. |
| <img src="docs/screenshots/support.png" width="250" /> | **고객 문의** <br> 1:1 문의 작성 및 문의 내역 조회를 할 수 있습니다. |
| <img src="docs/screenshots/setting.png" width="250" /> | **설정** <br> 알림 설정, 계정 정보 등 개인 설정을 관리합니다. |

### 관리자 페이지

| 화면 | 기능 |
|:---:|:---|
| <img src="docs/screenshots/admin-policy.png" width="250" /> | **정책 관리** <br> 카테고리별 정책 생성·수정·삭제 및 앱별 사용량/속도 제한, 차단 정책을 설정합니다. |
| <img src="docs/screenshots/admin-users.png" width="250" /> | **사용자 관리** <br> 가족 구성원 목록 조회, 권한 관리, 대표자 양도 기능을 제공합니다. |
| <img src="docs/screenshots/admin-user-policy.png" width="250" /> | **사용자별 정책 관리** <br> 개별 구성원에게 앱 정책, 사용량 제한, 즉시 차단 등을 적용합니다. |
| <img src="docs/screenshots/admin-inquiry.png" width="250" /> | **문의 관리** <br> 사용자 문의 목록 조회 및 답변 처리를 합니다. |
| <img src="docs/screenshots/admin-notification.png" width="250" /> | **알림 발송** <br> 특정 구성원 또는 전체 대상으로 알림을 발송합니다. |

---

## 🔄 핵심 기능 플로우

<p align="center">
  <img src="docs/flow/core-flow.png" alt="핵심 기능 플로우" width="800" />
</p>

<!-- 플로우 이미지를 docs/flow/ 폴더에 추가해주세요 -->

> 📒 [핵심 기능 플로우 상세 보기 (Notion)](https://notion-link.example.com)

---

## 📐 인프라 아키텍처

<p align="center">
  <img src="docs/architecture/infra-architecture.png" alt="인프라 아키텍처" width="800" />
</p>

---

## 📊 ERD

<p align="center">
  <img src="docs/architecture/erd.png" alt="ERD" width="800" />
</p>

---

## 🗂 Repositories

| Repository | Link |
|:---:|:---:|
| Frontend | [pooli-fe](https://github.com/your-org/pooli-fe) |
| Backend | [pooli-be](https://github.com/your-org/pooli-be) |
