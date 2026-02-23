import type { ReactNode } from 'react';

/**
 * 공통 버튼 컴포넌트
 * 
 * @example
 * // 기본 사용
 * <Button onClick={() => console.log('clicked')}>
 *   클릭하기
 * </Button>
 * 
 * @example
 * // 아이콘과 함께 사용
 * <Button onClick={handleSubmit}>
 *   <img src={iconSrc} alt="" className="w-5 h-5" />
 *   문의 접수하기
 * </Button>
 * 
 * @example
 * // 비활성화 상태
 * <Button disabled onClick={handleClick}>
 *   비활성화 버튼
 * </Button>
 * 
 * @example
 * // 전체 너비
 * <Button fullWidth onClick={handleClick}>
 *   전체 너비 버튼
 * </Button>
 */

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = ''
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2
        px-6 py-4 rounded-full
        bg-[#678BF7] text-white text-base font-semibold
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5678E5] active:scale-95 cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
