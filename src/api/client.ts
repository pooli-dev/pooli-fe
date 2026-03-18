import axios from 'axios';

// 백엔드 API URL
// 개발 환경에서는 Vite 프록시를 통해 CORS 우회
// 프로덕션에서는 현재 도메인의 /api 사용 (office.pooliapp.com -> office.pooliapp.com/api)
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return '/api';
  }
  // 프로덕션: 현재 도메인 사용
  return `${window.location.origin}/api`;
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60초로 증가 (정책 활성화 등 시간이 걸리는 작업 대응)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 전송 활성화 (CSRF 토큰용)
});

// CSRF 토큰을 메모리에 저장 (cross-origin이라 쿠키 직접 읽기 불가)
let csrfToken: string | null = null;

// CSRF 토큰 설정
export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

// CSRF 토큰 가져오기
export const getCsrfToken = (): string | null => {
  return csrfToken;
};

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // POST, PUT, DELETE 요청에 CSRF 토큰 추가 (있는 경우에만)
    if (config.method && ['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())) {
      const csrf = getCsrfToken();
      if (csrf) {
        config.headers['X-XSRF-TOKEN'] = csrf;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 응답 헤더에서 CSRF 토큰 추출 (로그인 시)
    const xsrfToken = response.headers['x-xsrf-token'] || response.headers['X-XSRF-TOKEN'];
    if (xsrfToken) {
      setCsrfToken(xsrfToken);
    }
    
    return response;
  },
  (error) => {
    // 401 에러 처리 (인증 실패) - 로그인 페이지에서는 리다이렉트 안함
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminAuthenticated');
      csrfToken = null; // CSRF 토큰도 초기화
      const isAdmin = window.location.pathname.startsWith('/admin');
      window.location.href = isAdmin ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
// 에러 응답 타입
export interface ApiErrorResponse {
  errorCode?: string | number;
  code?: string;
  message?: string;
  status?: number;
  timestamp?: string;
  traceId?: string;
}

// 에러 메시지 추출 유틸
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) {
      const code = data.errorCode || data.code;
      return code ? `[${code}] ${data.message}` : data.message;
    }
  }
  if (error instanceof Error) return error.message;
  return '알 수 없는 오류가 발생했습니다.';
};

// 에러 코드 추출 유틸
export const getErrorCode = (error: unknown): string | null => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const code = data?.errorCode || data?.code;
    if (code) return String(code);
  }
  return null;
};