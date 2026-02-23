import { useLocation, useNavigate } from 'react-router-dom';
import homeOn from '../assets/icon/home-on.png';
import homeOff from '../assets/icon/home-off.png';
import supportOn from '../assets/icon/support-on.png';
import supportOff from '../assets/icon/support-off.png';
import policyOn from '../assets/icon/policy-on.png';
import policyOff from '../assets/icon/policy-off.png';

export default function BottomBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isSupport = location.pathname === '/support';
  const isPolicy = location.pathname === '/policy';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[480px] max-w-full flex justify-around items-center py-2 bg-white/60 backdrop-blur-[10px] pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <button className="flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer py-1.5 px-3" onClick={() => navigate('/support')}>
        <img src={isSupport ? supportOn : supportOff} alt="Support" className="w-7 h-7" />
        <span className={`text-[11px] font-medium ${isSupport ? 'text-[#0088FF] font-semibold' : 'text-[#999999]'}`}>Support</span>
      </button>

      <button className="flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer py-1.5 px-3" onClick={() => navigate('/')}>
        <img src={isHome ? homeOn : homeOff} alt="Home" className="w-7 h-7" />
        <span className={`text-[11px] font-medium ${isHome ? 'text-[#0088FF] font-semibold' : 'text-[#999999]'}`}>Home</span>
      </button>

      <button className="flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer py-1.5 px-3" onClick={() => navigate('/policy')}>
        <img src={isPolicy ? policyOn : policyOff} alt="Policy" className="w-7 h-7" />
        <span className={`text-[11px] font-medium ${isPolicy ? 'text-[#0088FF] font-semibold' : 'text-[#999999]'}`}>Policy</span>
      </button>
    </nav>
  );
}
