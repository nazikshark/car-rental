'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Rental<span>Car</span>
      </Link>
      <nav className={styles.nav}>
        <Link href="/" className={pathname === '/' ? styles.active : ''}>
          Home
        </Link>
        <Link href="/catalog" className={pathname.startsWith('/catalog') ? styles.active : ''}>
          Catalog
        </Link>
      </nav>
    </header>
  );
}