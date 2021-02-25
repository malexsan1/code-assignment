import React from 'react';
import Link from 'next/link';

import styles from '../styles/unauthorized.module.scss';

export default function Unauthorized() {
  return (
    <section className={styles.unauthorized}>
      <h4>You are not authorized to view this page. Please log in.</h4>
      <Link href="/">
        <a>
          <button>Go to Login</button>
        </a>
      </Link>
    </section>
  );
}
