import type { ReactNode } from 'react';
import backgroundImg from '../assets/img/background.png';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex justify-center min-h-screen bg-[#f5f5f5] font-sans">
      <div 
        className="w-[480px] max-w-full min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        {children}
      </div>
    </div>
  );
}
