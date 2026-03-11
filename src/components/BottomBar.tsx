import { useLocation, useNavigate } from 'react-router-dom';
import { useSettingStore } from '../store/settingStore';
import homeOn from '../assets/icon/home-on.png';
import homeOff from '../assets/icon/home-off.png';
import supportOn from '../assets/icon/support-on.png';
import supportOff from '../assets/icon/support-off.png';
import policyOn from '../assets/icon/policy-on.png';
import policyOff from '../assets/icon/policy-off.png';

const navItems = [
  { path: '/support', icon: { on: supportOn, off: supportOff }, label: 'Support' },
  { path: '/main', icon: { on: homeOn, off: homeOff }, label: 'Home' },
  { path: '/policy', icon: { on: policyOn, off: policyOff }, label: 'Policy' },
];

/**
 * 하단 네비게이션 바 컴포넌트
 * Support, Home, Policy 페이지 간 이동을 제공합니다.
 * @returns 하단 네비게이션 바 JSX
 */
export default function BottomBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const darkMode = useSettingStore(state => state.darkMode);

  return (
    <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[480px] max-w-full flex justify-around items-center py-2 bg-white/60 backdrop-blur-[10px] pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-[100] ${darkMode ? 'invert' : ''}`}>
      {navItems.map(({ path, icon, label }) => {
        const isActive = path === '/main' 
          ? location.pathname === '/main' 
          : location.pathname.startsWith(path);
        return (
          <button 
            key={path}
            type="button"
            className="flex flex-col items-center justify-center gap-0.5 bg-transparent border-none cursor-pointer w-20 h-16" 
            onClick={() => navigate(path)}
          >
            <img src={isActive ? icon.on : icon.off} alt={label} className="w-7 h-7" />
            <span className={`${isActive ? 'text-[#0088FF] font-semibold' : 'text-[#999999] font-medium'} text-[0.6875rem]`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
