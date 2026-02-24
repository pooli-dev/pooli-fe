import type { ReactNode } from 'react';
import { useSettingStore } from '../store/settingStore';
import backgroundImg from '../assets/img/background.png';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const darkMode = useSettingStore(state => state.darkMode);
  const largeTextMode = useSettingStore(state => state.largeTextMode);

  return (
    <div className={`flex justify-center min-h-screen bg-[#f5f5f5] font-sans ${darkMode ? 'dark' : ''}`}>
      <div 
        className={`w-[480px] max-w-full min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-cover bg-center bg-no-repeat transition-all duration-300 ${darkMode ? 'invert' : ''} ${largeTextMode ? 'text-[1.25em]' : ''}`}
        style={{ 
          backgroundImage: `url(${backgroundImg})`
        }}
      >
        {children}
      </div>
    </div>
  );
}
