# Admin 백오피스 페이지

## 개요
관리자가 유저 정책, 문의사항, 알림을 관리할 수 있는 백오피스 시스템입니다.

## 주요 기능

### 1. 정책 관리 (`/admin`)
- 정책 목록 조회 및 관리
- 정책 추가/수정/삭제
- 정책 상태 토글 (활성화/비활성화)
- 페이지네이션

### 2. 유저 검색 및 역할 관리 (`/admin/users`)
- 전화번호 뒷자리 + 이름 조합 검색
- 유저 상세 정보 조회
- 가족 그룹 정보 확인
- 공유 데이터 풀 현황
- 역할 변경 (자녀/부모/관리자)
- 데이터 제한 설정
- 정책 적용

### 3. 문의 사항 관리 (`/admin/inquiries`)
- 문의 목록 조회
- 상태별 필터링 (전체/대기중/답변완료)
- 제목 검색
- 정렬 (최신순/오래된순)
- 답변 작성 (텍스트 + 이미지 첨부)
- 임시저장 기능

### 4. 알림 전송 (`/admin/notifications`)
- 카테고리별 알림 (데이터/정책/권한)
- 수신자 검색 및 선택
- 제목 및 내용 작성
- 전송 확인 모달

## 컴포넌트 구조

```
src/page/Admin/
├── AdminLayout.tsx              # 레이아웃 (사이드바 + 메인)
├── PolicyManagement.tsx         # 정책 관리
├── UserManagement.tsx           # 유저 관리
├── InquiryManagement.tsx        # 문의 관리
├── NotificationManagement.tsx   # 알림 전송
└── components/
    ├── AdminHeader.tsx          # 공통 헤더
    ├── SearchBar.tsx            # 검색 바
    └── RecipientSelector.tsx    # 수신자 선택
```

## 라우팅

```typescript
/admin                    → 정책 관리
/admin/users             → 유저 검색 및 역할 관리
/admin/inquiries         → 문의 사항 관리
/admin/notifications     → 알림 전송
```

## 사용된 공용 컴포넌트
- `Toggle`: 정책 상태 토글
- `Button`: 버튼 (필요시 추가)

## 특징
- 아이콘 기반 UI (이모지 대신 SVG 아이콘 사용)
- 반응형 디자인
- 컴포넌트 분리로 재사용성 향상
- 로그아웃 기능
- 관리자 정보 표시 (사이드바 하단)

## 개선 사항
1. ✅ 로고 크기 증가 (h-8 → h-12)
2. ✅ 검색창 제거 (정책 관리 페이지)
3. ✅ 관리자 정보 사이드바 하단 이동
4. ✅ 로그아웃 버튼 추가
5. ✅ 문의 검색 기능 (제목)
6. ✅ 문의 정렬 (최신순/오래된순)
7. ✅ 답변 작성 시 이미지 첨부
8. ✅ 답변 작성 칸 크기 증가 (h-32 → h-48)
9. ✅ 알림 아이콘 제거 (헤더)
10. ✅ 컴포넌트 분리 (AdminHeader, SearchBar, RecipientSelector)

## 더미 데이터
`src/data/adminDummyData.ts` 파일에 테스트용 더미 데이터가 포함되어 있습니다.
