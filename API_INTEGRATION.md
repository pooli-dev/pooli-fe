# API 통합 가이드

이 문서는 백엔드 API와의 통합 방법을 설명합니다.

## 환경 설정

`.env` 파일에 다음 환경 변수를 설정하세요:

```
VITE_API_BASE_URL=https://www.pooliapp.com/api
```

## API 클라이언트

`src/api/client.ts`에 axios 기반 API 클라이언트가 구성되어 있습니다.

### 주요 기능

- **Base URL**: `https://www.pooliapp.com/api`
- **인증**: Bearer 토큰 방식 (localStorage에 저장)
- **쿠키**: `withCredentials: true` 설정으로 세션 쿠키 자동 전송
- **CSRF 보호**: POST/PUT/DELETE 요청 시 `X-XSRF-TOKEN` 헤더 자동 추가
- **에러 처리**: 401 에러 시 자동 로그인 페이지 리다이렉트

## 인증 (Authentication)

### 로그인

```typescript
import { authService } from '@/api';

const result = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});
```

**엔드포인트**: `POST /auth/user/login`

**요청 본문**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답**: 
- 성공 시 200 상태 코드
- 세션 쿠키 (JSESSIONID, XSRF-TOKEN) 자동 설정

### 로그아웃

```typescript
await authService.logout();
```

**엔드포인트**: `POST /auth/logout`

## 서비스 레이어

각 도메인별로 서비스 파일이 구성되어 있습니다:

- `authService.ts`: 인증 관련 (로그인, 로그아웃)
- `questionService.ts`: 문의사항 관련 (생성, 조회, 삭제)

## CSRF 토큰 처리

백엔드는 세션 기반 인증을 사용하며, CSRF 보호를 위해 다음과 같이 동작합니다:

1. 로그인 시 백엔드가 `XSRF-TOKEN` 쿠키 설정
2. 프론트엔드는 POST/PUT/DELETE 요청 시 쿠키의 `XSRF-TOKEN` 값을 읽어서 `X-XSRF-TOKEN` 헤더에 포함
3. 백엔드는 쿠키와 헤더의 토큰 값을 비교하여 검증

### ⚠️ Cross-Origin 이슈

현재 프론트엔드는 `localhost:5173`에서 실행되고 백엔드는 `www.pooliapp.com`에 있어 cross-origin 상황입니다.

**문제점**:
- JavaScript에서 cross-origin 쿠키를 읽을 수 없음 (보안 제한)
- 따라서 `XSRF-TOKEN` 쿠키 값을 읽어서 헤더에 추가할 수 없음

**해결 방법** (백엔드 팀 조치 필요):

#### 1. CORS 설정 (필수)

백엔드에서 다음 CORS 헤더를 응답에 포함해야 합니다:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, X-XSRF-TOKEN, Authorization
Access-Control-Expose-Headers: X-XSRF-TOKEN
```

**중요**: 
- `Access-Control-Allow-Credentials: true`가 있어야 쿠키가 전송됩니다
- `Access-Control-Allow-Headers`에 `X-XSRF-TOKEN`이 포함되어야 합니다
- OPTIONS preflight 요청도 처리해야 합니다

#### 2. CSRF 토큰 전달 방법 (둘 중 하나 선택)

**옵션 A (권장)**: 로그인 응답 본문에 CSRF 토큰 포함
```json
{
  "accessToken": "...",
  "csrfToken": "14aae436-79b4-4097-a0aa-9765644fb879"
}
```

**옵션 B**: 로그인 응답 헤더에 CSRF 토큰 포함
```
X-XSRF-TOKEN: 14aae436-79b4-4097-a0aa-9765644fb879
```

프론트엔드는 이 토큰을 메모리에 저장하고, 이후 POST/PUT/DELETE 요청 시 `X-XSRF-TOKEN` 헤더에 포함시킵니다.

## 에러 처리

API 클라이언트는 다음과 같이 에러를 처리합니다:

- **401 Unauthorized**: 자동으로 로그인 페이지로 리다이렉트
- **403 Forbidden**: CSRF 토큰 검증 실패 (로그인 필요)
- **기타 에러**: 콘솔에 상세 정보 출력 및 에러 throw

## 사용 예시

### 문의사항 생성

```typescript
import { questionService } from '@/api';

const result = await questionService.createQuestion({
  questionCategoryId: 1,
  title: '문의 제목',
  content: '문의 내용',
  attachments: [
    {
      s3Key: 'questions/1/image.png',
      fileSize: 204800
    }
  ]
});
```

### 문의사항 목록 조회

```typescript
const questions = await questionService.getQuestions(0, 10);
```

## 현재 상태

### ✅ 완료된 기능
- API 클라이언트 설정
- 로그인/로그아웃 구현
- 문의사항 API 연동 (GET 요청)
- CSRF 토큰 헤더 추가 로직

### ⚠️ 대기 중 (백엔드 조치 필요)
- **CORS 설정**: POST 요청이 CORS 정책으로 차단됨
- **CSRF 토큰 전달**: 로그인 응답에 CSRF 토큰 포함 필요

### 🔧 백엔드 팀 TODO
1. CORS 설정 추가 (위의 "CORS 설정" 섹션 참고)
2. 로그인 응답에 CSRF 토큰 포함 (옵션 A 또는 B)
3. OPTIONS preflight 요청 처리
4. **S3 버킷 CORS 설정** (이미지 업로드용)

## 이미지 업로드 (S3 Presigned URL)

문의사항 이미지 업로드는 다음 플로우로 동작합니다:

1. **Presigned URL 발급**: `POST /api/uploads/presigned-urls`
2. **S3 직접 업로드**: 발급받은 URL로 브라우저에서 S3에 직접 PUT 요청
3. **문의 생성**: s3Key를 포함하여 `POST /api/questions`

### S3 CORS 설정 (필수)

브라우저에서 S3로 직접 파일을 업로드하려면 S3 버킷에 CORS 설정이 필요합니다.

**AWS S3 버킷 CORS 설정**:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://www.pooliapp.com"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-server-side-encryption",
      "x-amz-request-id"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

**중요 사항**:
- `AllowedOrigins`에 프론트엔드 도메인이 포함되어야 합니다
- `AllowedMethods`에 `PUT`이 반드시 포함되어야 합니다 (파일 업로드용)
- `AllowedHeaders`는 `["*"]`로 설정하여 모든 헤더를 허용합니다

### 현재 상태

**문제**: S3 버킷에 CORS 설정이 없어 브라우저에서 다음 에러 발생
```
Access to fetch at 'https://pooli-s3-bucket.s3.ap-northeast-2.amazonaws.com/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**임시 대응**: 이미지 업로드 실패 시 사용자에게 확인을 받고 이미지 없이 문의 접수 가능

**해결 방법**: 백엔드 팀이 S3 버킷에 위의 CORS 설정 추가 필요

## 주의사항

1. 모든 API 요청은 `withCredentials: true` 설정으로 쿠키를 포함합니다
2. 로그인 후 세션 쿠키가 자동으로 관리됩니다
3. CSRF 토큰은 로그인 응답에서 받아 메모리에 저장하고, 이후 요청 시 `X-XSRF-TOKEN` 헤더에 포함됩니다
4. 401 에러 발생 시 자동으로 로그아웃 처리됩니다
5. Cross-origin 환경에서는 JavaScript로 쿠키를 직접 읽을 수 없습니다
