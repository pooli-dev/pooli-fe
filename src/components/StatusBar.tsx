import { useEffect, useState } from 'react';

export default function StatusBar() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[480px] max-w-full h-8 pt-[env(safe-area-inset-top)] flex justify-between items-center px-6 text-black text-sm font-semibold z-[200]">
      <div className="flex items-center gap-1">
        <span>{currentTime}</span>
      </div>
      
      <div className="flex items-center gap-2.5">
        {/* 와이파이 아이콘 - iOS 스타일 */}
        <svg width="18" height="14" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M8 12C8.82843 12 9.5 11.3284 9.5 10.5C9.5 9.67157 8.82843 9 8 9C7.17157 9 6.5 9.67157 6.5 10.5C6.5 11.3284 7.17157 12 8 12Z" fill="black"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M11.5 7.5C11.5 7.5 10.5 6 8 6C5.5 6 4.5 7.5 4.5 7.5C4.22386 7.77614 3.77614 7.77614 3.5 7.5C3.22386 7.22386 3.22386 6.77614 3.5 6.5C3.5 6.5 5 4.5 8 4.5C11 4.5 12.5 6.5 12.5 6.5C12.7761 6.77614 12.7761 7.22386 12.5 7.5C12.2239 7.77614 11.7761 7.77614 11.5 7.5Z" fill="black"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M14.5 4.5C14.5 4.5 12.5 2 8 2C3.5 2 1.5 4.5 1.5 4.5C1.22386 4.77614 0.776142 4.77614 0.5 4.5C0.223858 4.22386 0.223858 3.77614 0.5 3.5C0.5 3.5 3 0.5 8 0.5C13 0.5 15.5 3.5 15.5 3.5C15.7761 3.77614 15.7761 4.22386 15.5 4.5C15.2239 4.77614 14.7761 4.77614 14.5 4.5Z" fill="black"/>
        </svg>
        
        {/* 배터리 아이콘 - iOS 스타일 */}
        <div className="flex items-center gap-0.5">
          <div className="relative w-[26px] h-[13px] border-[1.8px] border-black rounded-[3.5px] flex items-center px-[2px]">
            <div className="w-full h-[7px] bg-black rounded-[2px]"></div>
          </div>
          <div className="w-[2.5px] h-[7px] bg-black rounded-r-[1.5px]"></div>
        </div>
      </div>
    </div>
  );
}
