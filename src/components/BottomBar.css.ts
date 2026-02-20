import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '480px',
  maxWidth: '100%',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '12px 0',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
});

export const button = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '8px 16px',
});

export const icon = style({
  width: '32px',
  height: '32px',
});

export const label = style({
  fontSize: '12px',
  color: '#999999',
  fontWeight: '500',
});

export const labelActive = style({
  fontSize: '12px',
  color: '#0088FF',
  fontWeight: '600',
});
