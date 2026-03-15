import axios from 'axios';

// 백엔드 API URL
// 개발 환경에서는 Vite 프록시를 통해 CORS 우회
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://www.pooliapp.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

// 에러 응답 타입
export interface ApiErrorResponse {
  status: number;
  code?: string;
  message: string;
}

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
    const status = error.response?.status;
    const data = error.response?.data;

    // 백엔드 에러 응답 전체를 DEV에서 확인할 수 있도록 출력
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status,
        data,
        headers: error.response?.headers,
      });
    }

    // 백엔드 에러 응답에서 코드와 메시지 추출
    // 백엔드가 { code: 5001, message: "..." } 또는 { errorCode: 5001, error: "..." } 등 다양한 형태 대응
    const apiError: ApiErrorResponse = {
      status: status || 0,
      code: data?.code ?? data?.errorCode ?? data?.statusCode ?? undefined,
      message: data?.message || data?.error || data?.detail || getDefaultErrorMessage(status),
    };

    if (import.meta.env.DEV) {
      const codeStr = apiError.code != null ? ` (${apiError.code})` : '';
      console.error(`[API Error] ${status}${codeStr}: ${apiError.message}`);
    }

    // 401 에러 처리 (인증 실패) - 로그인 페이지에서는 리다이렉트 안함
    if (status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('accessToken');
      csrfToken = null;
      window.location.href = '/login';
    }

    // error 객체에 apiError 정보 추가
    error.apiError = apiError;
    return Promise.reject(error);
  }
);

function getDefaultErrorMessage(status?: number): string {
  switch (status) {
    case 400: return '잘못된 요청입니다.';
    case 401: return '인증이 필요합니다.';
    case 403: return '접근 권한이 없습니다.';
    case 404: return '요청한 리소스를 찾을 수 없습니다.';
    case 409: return '요청이 충돌했습니다.';
    case 500: return '서버 오류가 발생했습니다.';
    default: return '알 수 없는 오류가 발생했습니다.';
  }
}

// 에러에서 메시지 추출하는 유틸 함수
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'apiError' in error) {
    const apiError = (error as { apiError: ApiErrorResponse }).apiError;
    const codeStr = apiError.code != null ? `[${apiError.code}] ` : '';
    return `${codeStr}${apiError.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
};

// 에러에서 코드만 추출하는 유틸 함수
export const getErrorCode = (error: unknown): string | undefined => {
  if (error && typeof error === 'object' && 'apiError' in error) {
    return (error as { apiError: ApiErrorResponse }).apiError.code;
  }
  return undefined;
};

export default apiClient;
