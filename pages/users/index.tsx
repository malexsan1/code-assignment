import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { IUser } from '@core/entities';
import { getCookies, verifyToken } from '@lib/utils';

import Layout from '@components/layout';
import AuthGuard from '@components/auth-guard';
import Pagination from '@components/pagination';
import Unauthorized from '@components/unauthorized';
import usersStyles from '../../styles/users.module.scss';

export async function getServerSideProps({ query: { page = 1 }, req }) {
  const { token = '' } = getCookies(req);
  const session = verifyToken(token);

  if (!session) {
    return {
      props: {
        users: [],
        totalCount: 0,
        isAuthenticated: false,
      },
    };
  }

  let totalCount: number = 0;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=10`,
  );
  const users: IUser[] = await response.json();

  response.headers.forEach((value, name) => {
    if (name === 'x-total-count') {
      totalCount = Number(value);
    }
  });

  return {
    props: {
      users,
      totalCount,
      isAuthenticated: true,
    },
  };
}

interface UsersProps {
  users: IUser[];
  totalCount: number;
  isAuthenticated: boolean;
}

export default function Users({ isAuthenticated, users = [], totalCount }: UsersProps) {
  const { query } = useRouter();

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <AuthGuard
        isAuthenticated={isAuthenticated}
        pagination={
          <Pagination
            path="users"
            totalCount={totalCount}
            page={query.page ? Number(query.page) : 1}
          />
        }
      >
        <h2>Users</h2>
        {users.length === 0 ? (
          'No users found.'
        ) : (
          <section className={usersStyles.container}>
            {users.map((user) => (
              <Link key={user.id} href={`/users/${encodeURIComponent(user.id)}`}>
                <a>
                  <UserCard user={user} />
                </a>
              </Link>
            ))}
          </section>
        )}
      </AuthGuard>
    </>
  );
}

interface UserCardProps {
  user: IUser;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className={usersStyles.user}>
      <div>
        <span>{user.name}</span>
        <span className={usersStyles.userId}>#{user.id}</span>
      </div>

      <div>
        <span>{user.email}</span>
        <span>{user.phone}</span>
      </div>
    </div>
  );
};
