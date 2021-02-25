import React from 'react';
import Head from 'next/head';

import { IUser } from '@core/entities';

import { getSession } from '@lib/utils';
import { useUserForm } from '@hooks/index';
import AuthGuard from '@components/auth-guard';
import FormInput from '@components/form-input';

import styles from '../../styles/user.module.scss';

export async function getServerSideProps({ req, params }) {
  const session = getSession(req);

  if (!session) {
    return {
      props: {
        user: null,
        isAuthenticated: false,
      },
    };
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
  const user = await response.json();

  return {
    props: {
      user,
      isAuthenticated: true,
    },
  };
}

interface UserProps {
  user: IUser;
  isAuthenticated: boolean;
}

export default function User({ isAuthenticated, user }: UserProps) {
  const { register, handleEdit } = useUserForm(user);

  return (
    <>
      <Head>
        <title>Edit User</title>
      </Head>

      <AuthGuard isAuthenticated={isAuthenticated}>
        <h2>{user ? user.name : ''}</h2>
        <form className={styles.form} onSubmit={handleEdit}>
          <section>
            <FormInput id="name" label="Name" ref={register} />
            <FormInput id="email" label="Email" ref={register} />
            <FormInput id="username" label="Username" ref={register} />
            <FormInput id="phone" label="Phone" ref={register} />
            <FormInput id="website" label="Website" ref={register} />
          </section>
          <button type="submit">Edit</button>
        </form>
      </AuthGuard>
    </>
  );
}
