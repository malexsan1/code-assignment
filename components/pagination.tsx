import React from 'react';
import Link from 'next/link';

import styles from '../styles/pagination.module.css';

interface PaginationProps {
  page: number;
  path: string;
  totalCount: number;
  itemsPerPage?: number;
}

export default function Pagination({ page, path, itemsPerPage = 10, totalCount }: PaginationProps) {
  return totalCount > itemsPerPage ? (
    <footer className={styles.paginationRoot}>
      {Array.from({ length: totalCount / itemsPerPage }).map((_, index) => {
        return (
          <Link href={index === 0 ? `/${path}` : `/${path}?page=${index + 1}`} key={index}>
            <a>
              <button className={page - 1 === index ? styles.active : ''}>{index + 1}</button>
            </a>
          </Link>
        );
      })}
    </footer>
  ) : null;
}
