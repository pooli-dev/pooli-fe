// 날짜 포맷팅
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString('ko-KR');
}

// 다음 달까지 남은 일수 계산
export function calculateDaysUntilNextMonth(): number {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const diffTime = nextMonth.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 데이터 크기 포맷팅
export function formatDataSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${bytes} B`;
}

// 에러 코드 추출
export function extractErrorCode(error: Error & { response?: { data?: { code?: string; errorCode?: string } }; code?: string }): string {
  return (
    error?.response?.data?.code ||
    error?.response?.data?.errorCode ||
    error?.code ||
    ''
  );
}

// 에러 메시지 추출
export function extractErrorMessage(error: Error & { response?: { data?: { message?: string } }; message?: string }): string {
  return (
    error?.response?.data?.message ||
    error?.message ||
    '알 수 없는 오류'
  );
}

// HTTP 상태 코드 추출
export function extractHttpStatus(error: Error & { response?: { status?: number } }): number | null {
  return error?.response?.status || null;
}
