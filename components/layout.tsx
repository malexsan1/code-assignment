import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import layoutStyles from '../styles/layout.module.scss';

export default function Layout({ children }) {
  return (
    <div className={layoutStyles.layout}>
      <nav>
        <div className={layoutStyles.links}>
          <Image src="/images/logo.gif" width={40} height={40} alt="Logo" />

          <Link href="/users">
            <a>Users</a>
          </Link>
          <Link href="/posts">
            <a>Posts</a>
          </Link>
        </div>

        <span>Logout</span>
      </nav>

      <main>{children}</main>
    </div>
  );
}
