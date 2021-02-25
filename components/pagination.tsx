import React, { useMemo } from 'react';
import Link from 'next/link';

import styles from '../styles/pagination.module.scss';

interface PaginationProps {
  page: number;
  path: string;
  totalCount: number;
  itemsPerPage?: number;
  pageLimit?: number;
}

export default function Pagination({
  page,
  path,
  totalCount,
  pageLimit = 5,
  itemsPerPage = 10,
}: PaginationProps) {
  const { totalPages, pageRange } = useMemo(() => {
    const offset = Math.floor(pageLimit / 2);
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const pageRange = [...Array(totalPages <= pageLimit ? totalPages : pageLimit)].map(
      (_, index) => {
        if (totalPages <= pageLimit || page <= offset) return index;
        if (page >= totalPages - offset) return offset * -2 + index + totalPages - 1;
        return page - offset + index;
      },
    );

    return { totalPages, pageRange };
  }, [page, pageLimit, totalCount, itemsPerPage]);

  return totalCount > itemsPerPage ? (
    <footer className={styles.paginationRoot}>
      <Link href={`/${path}`}>
        <a>
          <button disabled={page === 1}>|&lt;</button>
        </a>
      </Link>
      {pageRange.map((pageNumber) => {
        return (
          <Link
            href={pageNumber === 0 ? `/${path}` : `/${path}?page=${pageNumber + 1}`}
            key={pageNumber}
          >
            <a>
              <button className={page - 1 === pageNumber ? styles.active : ''}>
                {pageNumber + 1}
              </button>
            </a>
          </Link>
        );
      })}
      <Link href={`/${path}?page=${totalPages}`}>
        <a>
          <button disabled={page === totalPages}>&gt;|</button>
        </a>
      </Link>
    </footer>
  ) : null;
}
