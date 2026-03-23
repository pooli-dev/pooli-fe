# 🐙 POOLI - 가족 데이터 사용량 관리 및 정책 제어 서비스

<p align="center">
  <img src="src/assets/img/intro.svg" alt="POOLI Character" width="800" />
</p>

### 🏆 LG 유플러스 유레카 SW 아카데미 3기 최종 융합프로젝트 🏅

> [POOLI 바로가기](https://www.pooliapp.com) | [POOLI Admin 바로가기](https://office.pooliapp.com) | [📒 Notion](https://www.notion.so/yerin1412/1-2c3389b3e03981e2a56bdaa42ff24264) | [🎨 Figma](https://www.figma.com/design/f3JZPIcAe7kLYvRe8DZVG5/%EC%B5%9C%EC%A2%85%EC%9C%B5%ED%95%A9%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=826-8237&t=ZDAB0VHd8TpTtPXp-0)


<br>

## 🗺 프로젝트 소개

**POOLI**는 LG유플러스 가족 결합 상품 사용자를 위한 **데이터 사용량 관리 및 정책 제어 서비스**입니다.

가족 구성원별 데이터 사용량을 실시간으로 모니터링하고, 앱별 사용량 제한·속도 제한·차단 정책을 설정할 수 있습니다. 공유 데이터풀 관리, 알림 발송, 문의 관리 등 관리자 기능도 함께 제공하여 가족 단위의 체계적인 데이터 관리를 지원합니다.

### 주요 기능

- 📊 가족 구성원별 데이터 사용량 실시간 조회 및 사용량 추이 시각화
- 📱 앱별 사용량 제한 / 속도 제한 / 차단 정책 관리
- 🔄 가족 공유 데이터풀 관리 및 데이터 양도
- 🔔 알림 발송 및 문의 관리 (관리자)
- 👨‍👩‍👧‍👦 가족 구성원 권한 및 역할 관리


<br>

## 🚩 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | POOLI |
| 팀명 | 1조 무너팸 |
| 주제 | LG U+ 가족 데이터 사용량 관리 및 정책 제어 서비스 |
| 개발 기간 | 2025.02.24 - 2025.03.24 |


<br>

## 👩🏻‍🤝‍🧑🏻 MEMBERS

### Backend Common Roles
- 🟢 모니터링 관련 API 구현
- 🟢 DB, 기초 인프라 설계
- 🟢 프로젝트 구조설계

### Frontend Common Roles
- 🟢 피그마 와이어프레임 및 UI 설계
- 🟢 공통 UI 컴포넌트 라이브러리 및 디자인 시스템 구축
<br />

| | 이승현 | 김미수 | 김민수 | 김준하 |
|:---:|:---:|:---:|:---:|:---:|
| 역할 | `BE LEADER` | `BE` | `BE` | `BE` |
| 담당 | 모니터링 세팅 및 이상치 탐지 구현 | 데이터 사용 처리 로직 구현, Redis/Lua 기능 고도화 | 모니터링 세팅 및 이상치 탐지 구현 | 데이터 사용 처리 로직 구현, 인프라 구축, CI/CD 배포 자동화, 테스트 데이터 생성 |

| | 박재현 | 현홍석 | 이해니 | 김예린 |
|:---:|:---:|:---:|:---:|:---:|
| 역할 | `BE` | `BE` | `FE LEADER` | `FE` |
| 담당 | Streams(MQ) + 소비 인프라 고도화 | 모니터링 세팅 및 이상치 탐지 구현, AIOps 도입 | 메인, 알림, 정책, 구성원별 정책, 사용로그 UI 구현 및 API 연동, TanStack Query 도입 | 공유풀, 상세페이지, 설정, 문의, 어드민 UI 구현 및 API 연동, 깃허브 세팅 및 도메인 분기처리 |


<br>

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


<br>

## 📸 서비스 화면

### 사용자 페이지

<table>
  <tr>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/97c392f6-064e-429b-aa99-a248cec829d7" /></td>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/4577839e-d473-4227-b25b-52c989cdc5c7" /></td>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/f7aa538d-bfdf-4510-acd8-b2c7569d9d2c" /></td>
  </tr>
  <tr>
    <td align="center"><b>로그인</b><br>사용자 인증을 통해 서비스에 접속합니다.</td>
    <td align="center"><b>메인 홈</b><br>가족 구성원 목록과 전체 데이터 현황을 한눈에 확인할 수 있습니다.</td>
    <td align="center"><b>데이터 사용량 상세</b><br>기본/공유 데이터 사용량 조회, 최근 3개월 사용량 추이 차트, 앱별 사용량 시각화를 제공합니다.</td>
  </tr>
  <tr>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/7edee901-ba97-4822-a1dd-83cf9a242f7c" /></td>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/0b65b134-492e-4984-a988-a38954b7e3d6" /></td>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/37cd8eef-f41c-48e6-b670-21001cb0ee9c" /></td>
  </tr>
  <tr>
    <td align="center"><b>정책 페이지</b><br>자신의 정보 확인과 회선 변경 및 임계치 설정이 가능합니다.</td>
    <td align="center"><b>공유풀 담기</b><br>가족 공유 데이터풀 현황 조회 및 구성원 간 데이터 양도 기능을 제공합니다.</td>
    <td align="center"><b>사용 로그 보기</b><br>구성원이 공유풀 사용량을 차감/보태기한 내역 로그를 확인할 수 있습니다.</td>
  </tr>
  <tr>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/86809fdc-235a-4967-b03f-f8010b2ad6cf" /></td>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/7ddf5722-acb5-4754-9993-314cff87a0c5" /></td>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/0f11d032-c678-4d93-9caa-76880ae93d46" /></td>
  </tr>
  <tr>
    <td align="center"><b>알림</b><br>정책 변경, 데이터 사용량 경고 등 알림 내역을 확인합니다.</td>
    <td align="center"><b>설정</b><br>알림 설정, 계정 정보 등 개인 설정을 관리합니다.</td>
    <td align="center"><b>고객 문의</b><br>1:1 문의 작성 및 문의 내역 조회를 할 수 있습니다.</td>
  </tr>
</table>

<br />

### 👑 대표자 전용 기능

<table>
  <tr>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/c410712e-c6f3-473d-8fb5-709e104eac93" /></td>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/f5e3e621-815c-4a2d-9f4b-fa3930e8f0ff" /></td>
    <td align="center"><img width="200" src="https://github.com/user-attachments/assets/2ed39d1f-184b-4f5c-a98f-58e6204e850a" /></td>
  </tr>
  <tr>
    <td align="center"><b>권한 적용</b><br>구성원별 상세페이지 열람 및 앱 사용량 비공개 허용 권한을 관리합니다.</td>
    <td align="center"><b>대표자 권한 양도</b><br>다른 구성원에게 대표자 권한을 양도할 수 있습니다.</td>
    <td align="center"><b>정책 적용</b><br>구성원별 데이터 한도, 속도 제한, 차단 정책을 설정합니다.</td>
  </tr>
</table>

<br />

### 📱 반응형 UI

> 모바일 · 태블릿 · 데스크톱 환경에 최적화된 반응형 레이아웃을 제공합니다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/6a4f4788-bf62-459b-891a-28fdbad364fb" alt="반응형 UI" width="800" />
</p>

<br/>

### 관리자 페이지

| 화면 | 기능 |
|:---:|:---|
| <img src="https://github.com/user-attachments/assets/affab383-8173-4a0b-b46d-8700f52c22d0" width="1000" /> | **정책 관리** <br> 카테고리별 정책 생성·수정·삭제 및 앱별 사용량/속도 제한, 차단 정책을 설정합니다. |
| <img src="https://github.com/user-attachments/assets/a032fbda-bf48-479b-ba0f-dea9fcc1d3c9" width="1000" /> | **사용자 관리** <br> 가족 구성원 목록 조회, 권한 관리, 대표자 양도 기능을 제공합니다. |
| <img src="https://github.com/user-attachments/assets/1b113f08-fe54-4990-8081-af8a70908b31" width="1000" /> | **사용자별 정책 관리** <br> 개별 구성원에게 앱 정책, 사용량 제한, 즉시 차단 등을 적용합니다. |
| <img src="https://github.com/user-attachments/assets/8427064b-9f4a-4395-b60e-5511510955c6" width="1000" /> | **문의 관리** <br> 사용자 문의 목록 조회 및 답변 처리를 합니다. |
| <img src="https://github.com/user-attachments/assets/13c2e414-00d8-4c81-b578-56cabe09da59" width="1000" /> | **알림 발송** <br> 특정 구성원 또는 전체 대상으로 알림을 발송합니다. |


<br>

## 🔄 Frontend Architecture & Data Flow

POOLI는 실시간 데이터 처리와 정책 기반 제어를 중심으로  
**상태 관리 + API 통신 + UI 렌더링**을 분리한 구조로 설계되었습니다.

### 데이터 흐름

1. 사용자 행동 또는 데이터 사용 이벤트 발생  
2. 서버에서 데이터 차감 및 정책 적용 처리  
3. 클라이언트는 TanStack Query를 통해 데이터를 조회  
4. 상태 변경 시 Query Invalidation을 통해 필요한 데이터만 재요청  
5. 변경된 상태를 UI에 반영하여 실시간에 가까운 사용자 경험 제공  

### 핵심 구조

- **TanStack Query**를 활용한 서버 상태 관리 및 캐싱
- **Zustand**를 통한 전역 상태 관리 (UI 상태, 사용자 정보 등)
- API 요청과 UI 로직을 분리하여 유지보수성 확보
- 페이지별 필요한 데이터만 선택적으로 갱신하는 구조


<br>

## 💡 Frontend Design Decisions

### 1. 실시간 데이터 처리 구조

- 초기에는 10초 polling 기반으로 데이터 동기화를 구현
- 불필요한 API 요청을 줄이기 위해 Query 캐싱과 조건부 refetch 전략 적용
- 이후 SSE 기반 구조로 확장 가능하도록 설계

### 2. 정책 변경 즉시 반영

- 정책 변경 시 `invalidateQueries`를 통해 관련 데이터 즉시 갱신
- UI와 서버 상태 간 불일치를 최소화하도록 설계

### 3. 공통 컴포넌트 기반 UI 설계

- 버튼, 토글, 카드, 모달 등을 공통 컴포넌트로 분리
- 페이지 간 일관된 UX 유지 및 개발 효율성 향상

### 4. 페이지 단위 구조 (Feature-based)

- 각 페이지별로 컴포넌트를 분리하여 기능 단위로 관리
- 유지보수성과 확장성을 고려한 구조 설계

### 5. 상태 관리 전략

- 서버 상태 → TanStack Query  
- 클라이언트 상태 → Zustand  


<br>

## 🔄 핵심 기능 플로우

<p align="center">
  <img width="1044" height="501" src="https://github.com/user-attachments/assets/ef9a0c26-8f63-4831-8077-a08058aa447a" />
</p>



<br>

## 📐 인프라 아키텍처

<p align="center">
  <img width="612" height="428" src="https://github.com/user-attachments/assets/ed84976f-7ded-42c4-b0e5-7e6f5bace3f8" />
</p>



<br>

## 📊 ERD

<p align="center">
  <img width="614" height="425" src="https://github.com/user-attachments/assets/b2da9094-22ef-4e12-9f20-3cdee359ee58" />
</p>



<br>

## 📂 Frontend Folder Structure

POOLI는 기능 확장성과 유지보수성을 고려해  
**레이어 기반 구조 + 페이지 단위 구조**로 설계되었습니다.

- API / 상태 / UI 레이어를 분리하여 책임을 명확히 구분
- 페이지 단위로 컴포넌트를 분리해 기능 확장에 유리한 구조
- 공통 컴포넌트와 페이지 전용 컴포넌트를 분리하여 재사용성 강화

```bash
src
├─ api                # API 요청 로직 (서비스 계층)
│  └─ services
│
├─ assets             # 정적 리소스 (이미지, 아이콘, 폰트)
│  ├─ fonts
│  ├─ icons
│  └─ images
│
├─ components         # 공통 UI 컴포넌트
│  ├─ common          # 버튼, 토글, 모달 등 재사용 컴포넌트
│  └─ onboarding      # 온보딩 관련 컴포넌트
│
├─ constants          # 상수 관리
├─ data               # 목 데이터 / 초기 데이터
├─ hooks              # 공통 커스텀 훅
├─ layout             # 레이아웃 (Header, BottomBar 등)
├─ lib                # 외부 라이브러리 설정
├─ routes             # 라우팅 정의
├─ store              # 전역 상태 관리 (Zustand)
├─ types              # 타입 정의
├─ utils              # 공통 유틸 함수
│
├─ pages              # 페이지 단위 구조 (Feature 기반)
│  ├─ Admin
│  │  ├─ components
│  │  ├─ hooks
│  │  └─ utils
│  │
│  ├─ Main
│  │  └─ components
│  │
│  ├─ Detail
│  │  └─ components
│  │
│  ├─ Policy
│  │  └─ components
│  │
│  ├─ PolicyDetail
│  │  ├─ components
│  │  └─ hooks
│  │
│  ├─ SharedData
│  │  └─ components
│  │
│  ├─ Log
│  ├─ Login
│  │
│  ├─ Setting
│  │  └─ components
│  │
│  └─ Support
│     └─ components
```


<br>

## 🗂 Repositories

| Repository | Link |
|:---:|:---:|
| Frontend | [pooli-fe](https://github.com/pooli-dev/pooli-fe) |
| Backend | [pooli-be](https://github.com/pooli-dev/pooli-be) |


<br>

## 🚀 Getting Started

> Node.js 18 이상을 권장합니다.

### 1. Clone Repository

```bash
git clone https://github.com/your-org/pooli-fe.git
cd pooli-fe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

```bash
.env 파일을 생성하고 아래와 같이 설정합니다.

VITE_API_BASE_URL=https://example.com

⚠️ 실제 API 주소에 맞게 수정해주세요.
```

### 4. Run Development Server
```bash
npm run dev

👉 브라우저에서 아래 주소로 접속합니다:

http://localhost:5173
```

### 5. Build

```bash
npm run build
```

### 6. Preview

```bash
npm run preview
```
