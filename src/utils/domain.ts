/**
 * 도메인 관련 유틸리티 함수
 */

const ADMIN_DOMAIN = import.meta.env.VITE_ADMIN_DOMAIN || 'office.pooliapp.com';
const USER_DOMAIN = import.meta.env.VITE_USER_DOMAIN || 'www.pooliapp.com';

export const isAdminDomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  // localhost에서는 /admin 경로로 구분
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return window.location.pathname.startsWith('/admin');
  }
  // 프로덕션에서는 도메인으로 구분 (정확히 일치하거나 office 포함)
  return hostname === ADMIN_DOMAIN || hostname.includes('office');
};

export const isUserDomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  // localhost에서는 /admin이 아닌 경로는 user
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return !window.location.pathname.startsWith('/admin');
  }
  // 프로덕션에서는 도메인으로 구분
  return hostname === USER_DOMAIN;
};

export const getAppType = (): 'admin' | 'user' => {
  return isAdminDomain() ? 'admin' : 'user';
};

export const redirectToCorrectDomain = (path: string) => {
  if (typeof window === 'undefined') return;
  
  const isAdmin = path.startsWith('/admin');
  const currentDomain = window.location.hostname;
  
  // localhost가 아닌 프로덕션 환경에서만 리다이렉트
  if (currentDomain !== 'localhost' && currentDomain !== '127.0.0.1') {
    if (isAdmin && currentDomain === USER_DOMAIN) {
      window.location.href = `https://${ADMIN_DOMAIN}${path}`;
    } else if (!isAdmin && currentDomain === ADMIN_DOMAIN) {
      window.location.href = `https://${USER_DOMAIN}${path}`;
    }
  }
};
