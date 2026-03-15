import apiClient from '../client';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    userId: string;
    name: string;
    role: string;
  };
}

interface LoginResult {
  success: boolean;
  status: number;
  data: LoginResponse | null;
  message: string;
}

export const authService = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<LoginResult> => {
    try {
      const response = await apiClient.post('/auth/user/login', credentials);
      
      // 로그인 성공 후 CSRF 토큰을 얻기 위해 간단한 GET 요청 (백엔드가 응답 헤더에 토큰 포함)
      // 또는 쿠키에서 직접 읽기 시도
      try {
        // 쿠키에서 XSRF-TOKEN 읽기 시도 (same-site인 경우)
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const trimmed = cookie.trim();
          if (trimmed.startsWith('XSRF-TOKEN=')) {
            const token = decodeURIComponent(trimmed.substring('XSRF-TOKEN='.length));
            // client.ts의 setCsrfToken 함수 사용
            const { setCsrfToken } = await import('../client');
            setCsrfToken(token);
            break;
          }
        }
      } catch (csrfError) {
        console.warn('CSRF 토큰 읽기 실패 (cross-origin일 수 있음):', csrfError);
      }
      
      // 백엔드가 빈 응답을 보낼 경우 status만 반환
      return {
        success: response.status === 200,
        status: response.status,
        data: response.data || null,
        message: response.status === 200 ? '로그인 성공' : '로그인 실패'
      };
    } catch (error) {
      console.error("로그인 에러:", error);
      throw error;
    }
  },

  // 관리자 로그인
  adminLogin: async (credentials: LoginRequest): Promise<LoginResult> => {
    try {
      const response = await apiClient.post('/auth/admin/login', credentials);

      try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const trimmed = cookie.trim();
          if (trimmed.startsWith('XSRF-TOKEN=')) {
            const token = decodeURIComponent(trimmed.substring('XSRF-TOKEN='.length));
            const { setCsrfToken } = await import('../client');
            setCsrfToken(token);
            break;
          }
        }
      } catch (csrfError) {
        console.warn('CSRF 토큰 읽기 실패:', csrfError);
      }

      return {
        success: response.status === 200,
        status: response.status,
        data: response.data || null,
        message: response.status === 200 ? '로그인 성공' : '로그인 실패'
      };
    } catch (error) {
      console.error("관리자 로그인 에러:", error);
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
