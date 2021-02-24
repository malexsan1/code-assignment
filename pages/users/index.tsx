import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';
import usersStyles from '../../styles/users.module.css';

interface User {
  id: string;
  name: string;
  phone: string;
  username: string;
  email: string;
}

export async function getServerSideProps() {
  const request = await fetch('https://jsonplaceholder.typicode.com/users?_start=0&_limit=5');
  const users: User[] = await request.json();

  return {
    props: {
      users,
    },
  };
}

interface UsersProps {
  users: User[];
}

export default function Users({ users = [] }: UsersProps) {
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
    </>
  );
}

interface UserCardProps {
  user: User;
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
