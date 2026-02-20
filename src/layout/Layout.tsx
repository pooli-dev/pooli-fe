import type { ReactNode } from 'react';
import * as styles from './Layout.css';
import backgroundImg from '../assets/img/background.png';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content} style={{ backgroundImage: `url(${backgroundImg})` }}>
        {children}
      </div>
    </div>
  );
}
