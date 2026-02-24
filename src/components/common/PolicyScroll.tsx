import { useRef, useState, useEffect } from 'react';

/**
 * PolicyScroll 공용 컴포넌트
 * 
 * 사용 방법:
 * <PolicyScroll 
 *   policies={[
 *     { id: 1, type: '한도', bgColor: '#FFE5E5', title: '공유 데이터 한도 1GB로 제한' },
 *     { id: 2, type: '시간', bgColor: '#E5E5FF', title: '10:00 ~ 12:00 데이터 사용 제한' },
 *     { id: 3, type: '앱', bgColor: '#E5F5E5', title: 'SNS 앱 사용 제한' }
 *   ]}
 *   title="현재 적용중인 정책"
 * />
 */

interface Policy {
  id: number;
  type: string;
  bgColor: string;
  title: string;
}

interface PolicyScrollProps {
  policies: Policy[];
  title?: string;
}

export default function PolicyScroll({ policies, title = '현재 적용중인 정책' }: PolicyScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  /**
   * 정책 타입별 아이콘을 반환
   * @param type - 정책 타입 (한도, 시간, 앱)
   * @returns 정책 타입에 맞는 아이콘 JSX
   */
  const getPolicyIcon = (type: string) => {
    switch (type) {
      case '한도':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M17 12H7M19 7l-14 10M19 17L5 7" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case '시간':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#678BF7" strokeWidth="2"/>
            <path d="M12 7v5l3 3" stroke="#678BF7" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case '앱':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="7" height="7" rx="2" stroke="#4CAF50" strokeWidth="2"/>
            <rect x="13" y="4" width="7" height="7" rx="2" stroke="#4CAF50" strokeWidth="2"/>
            <rect x="4" y="13" width="7" height="7" rx="2" stroke="#4CAF50" strokeWidth="2"/>
            <rect x="13" y="13" width="7" height="7" rx="2" stroke="#4CAF50" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  /**
   * 마우스 드래그 시작 핸들러
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  /**
   * 마우스 드래그 이동 핸들러
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#333333]" style={{ fontSize: '1.125em' }}>{title}</h2>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ userSelect: 'none' }}
      >
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="min-w-[280px] bg-white rounded-2xl p-5 flex-shrink-0"
            style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: policy.bgColor }}
            >
              {getPolicyIcon(policy.type)}
            </div>
            <div className="text-[#999999] mb-1" style={{ fontSize: '0.75em' }}>[{policy.type}]</div>
            <div className="text-[#333333] font-medium">{policy.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
