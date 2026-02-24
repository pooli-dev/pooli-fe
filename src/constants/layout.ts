/**
 * 레이아웃 관련 상수
 */

export const LAYOUT_PADDING = {
  TOP: '106px',
  BOTTOM: '100px',
  HORIZONTAL: '20px',
} as const;

export const PAGE_PADDING = `${LAYOUT_PADDING.TOP} ${LAYOUT_PADDING.HORIZONTAL} ${LAYOUT_PADDING.BOTTOM}`;
