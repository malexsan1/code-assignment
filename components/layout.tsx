import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useAuth } from '@hooks/useAuth';
import styles from '../styles/layout.module.scss';

export default function Layout({ children }) {
  const { pathname } = useRouter();
  const { handleLogout } = useAuth();

  return (
    <div className={styles.layout}>
      <nav>
        <div className={styles.links}>
          <Image src="/images/logo.gif" width={40} height={40} alt="Logo" />

          <Link href="/users">
            <a className={pathname.includes('/users') ? styles.activeLink : ''}>Users</a>
          </Link>
          <Link href="/posts">
            <a className={pathname.includes('/posts') ? styles.activeLink : ''}>Posts</a>
          </Link>
        </div>

        <button className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main>{children}</main>
    </div>
  );
}
