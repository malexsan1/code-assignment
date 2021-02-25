import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { IUser } from '@core/entities';
import { getSession } from '@lib/utils';
import { getPaginatedData } from '@lib/getPaginatedData';

import AuthGuard from '@components/auth-guard';
import Pagination from '@components/pagination';
import usersStyles from '../../styles/users.module.scss';

const USERS_PER_PAGE = 3;

export async function getServerSideProps({ query: { page = 1 }, req }) {
  const session = getSession(req);

  if (!session) {
    return {
      props: {
        users: [],
        totalCount: 0,
        isAuthenticated: false,
      },
    };
  }

  const { data: users, totalCount } = await getPaginatedData<IUser>({
    page,
    entity: 'users',
    limit: USERS_PER_PAGE,
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
            itemsPerPage={USERS_PER_PAGE}
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
