import { useState } from 'react';
import type { AlarmCategory } from '../types/alarm';
import { useAlarmStore } from '../store/alarmStore';

/**
 * 카테고리별 아이콘 컴포넌트
 * @param category - 알림 카테고리 (data, policy, permission, etc)
 * @param isRead - 읽음 여부
 * @returns 카테고리에 맞는 아이콘 JSX
 */
const CategoryIcon = ({ category, isRead }: { category: Exclude<AlarmCategory, 'all'>; isRead: boolean }) => {
  const iconColor = isRead ? '#CCCCCC' : '#FF6B6B';
  const bgColor = isRead ? '#F5F5F5' : '#FFE8E8';

  switch (category) {
    case 'data':
      return (
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: bgColor }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={iconColor} strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'policy':
      return (
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: isRead ? '#F5F5F5' : '#E8F4FF' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={isRead ? '#CCCCCC' : '#4A90E2'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" stroke={isRead ? '#CCCCCC' : '#4A90E2'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case 'permission':
      return (
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: isRead ? '#F5F5F5' : '#FFF4E8' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke={isRead ? '#CCCCCC' : '#FFA726'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case 'etc':
      return (
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: isRead ? '#F5F5F5' : '#F0F0F0' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={isRead ? '#CCCCCC' : '#757575'} strokeWidth="2" />
            <path d="M12 16v-4M12 8h.01" stroke={isRead ? '#CCCCCC' : '#757575'} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
  }
};

/**
 * 알림 페이지 컴포넌트
 * 카테고리별 알림 필터링 및 읽음 처리 기능을 제공합니다.
 * @returns 알림 페이지 JSX
 */
export default function Alarm() {
  const [selectedCategory, setSelectedCategory] = useState<AlarmCategory>('all');
  const { alarms, markAsRead, markAllAsRead } = useAlarmStore();

  const categories: { key: AlarmCategory; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'data', label: '데이터' },
    { key: 'policy', label: '정책' },
    { key: 'permission', label: '권한' },
    { key: 'etc', label: '기타' },
  ];

  const filteredAlarms = selectedCategory === 'all' 
    ? alarms 
    : alarms.filter(alarm => alarm.category === selectedCategory);

  return (
    <div className="pt-[106px] pb-[100px] px-5">
      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-5 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
              selectedCategory === key
                ? 'bg-[#678BF7] text-white font-semibold'
                : 'bg-[#F0F0F0] text-[#999999] font-medium'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 전체 읽음 버튼 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={markAllAsRead}
          className="text-[#678BF7] font-medium"
          style={{ fontSize: '0.875em' }}
        >
          전체 읽음
        </button>
      </div>

      {/* 알림 리스트 */}
      <div className="space-y-3">
        {filteredAlarms.map(alarm => (
          <div
            key={alarm.id}
            role="button"
            tabIndex={0}
            onClick={() => markAsRead(alarm.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                markAsRead(alarm.id);
              }
            }}
            className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all ${
              alarm.isRead ? 'bg-[#FAFAFA]' : 'bg-white shadow-sm'
            }`}
          >
            <CategoryIcon category={alarm.category} isRead={alarm.isRead} />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {!alarm.isRead && (
                  <span className="font-bold text-[#FF6B6B]" style={{ fontSize: '0.75em' }}>NEW</span>
                )}
                {alarm.isRead && (
                  <span className="font-medium text-[#CCCCCC]" style={{ fontSize: '0.75em' }}>READ</span>
                )}
                <span className={alarm.isRead ? 'text-[#CCCCCC]' : 'text-[#999999]'} style={{ fontSize: '0.75em' }}>
                  {alarm.date}
                </span>
              </div>
              <p className={`leading-relaxed ${
                alarm.isRead ? 'text-[#AAAAAA]' : 'text-[#333333]'
              }`} style={{ fontSize: '0.875em' }}>
                {alarm.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredAlarms.length === 0 && (
        <div className="text-center py-20 text-[#999999]">
          알림이 없습니다.
        </div>
      )}
    </div>
  );
}
