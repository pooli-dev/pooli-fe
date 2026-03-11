// 공통 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
