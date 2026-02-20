import { useLocation, useNavigate } from 'react-router-dom';
import * as styles from './BottomBar.css';
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
    <nav className={styles.container}>
      <button className={styles.button} onClick={() => navigate('/support')}>
        <img src={isSupport ? supportOn : supportOff} alt="Support" className={styles.icon} />
        <span className={isSupport ? styles.labelActive : styles.label}>Support</span>
      </button>

      <button className={styles.button} onClick={() => navigate('/')}>
        <img src={isHome ? homeOn : homeOff} alt="Home" className={styles.icon} />
        <span className={isHome ? styles.labelActive : styles.label}>Home</span>
      </button>

      <button className={styles.button} onClick={() => navigate('/policy')}>
        <img src={isPolicy ? policyOn : policyOff} alt="Policy" className={styles.icon} />
        <span className={isPolicy ? styles.labelActive : styles.label}>Policy</span>
      </button>
    </nav>
  );
}
