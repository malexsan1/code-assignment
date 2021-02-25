import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { IUser } from '@core/entities';

import Layout from '@components/layout';
import Pagination from '@components/pagination';
import usersStyles from '../../styles/users.module.scss';

export async function getServerSideProps({ query: { page = 1 } }) {
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
    },
  };
}

interface UsersProps {
  users: IUser[];
  totalCount: number;
}

export default function Users({ users = [], totalCount }: UsersProps) {
  const { query } = useRouter();

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <Layout>
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
      </Layout>
      <Pagination path="users" totalCount={totalCount} page={query.page ? Number(query.page) : 1} />
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
