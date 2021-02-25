import React from 'react';
import Head from 'next/head';

import { IUser } from '@core/entities';

import Layout from '@components/layout';
import { useUserForm } from '@hooks/index';
import FormInput from '@components/form-input';
import Unauthorized from '@components/unauthorized';
import { getCookies, verifyToken } from '@lib/utils';

import styles from '../../styles/user.module.scss';

export async function getServerSideProps({ req, params }) {
  const { token = '' } = getCookies(req);
  const session = verifyToken(token);

  if (!session) {
    return {
      props: {
        user: null,
        authenticated: false,
      },
    };
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
  const user = await response.json();

  return {
    props: {
      user,
      authenticated: false,
    },
  };
}

interface UserProps {
  user: IUser;
  authenticated: boolean;
}

export default function User({ authenticated, user }: UserProps) {
  const { register, handleEdit } = useUserForm(user);

  return (
    <>
      <Head>
        <title>Edit User</title>
      </Head>
      <Layout>
        {authenticated ? (
          <>
            <h2>{user.name}</h2>
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
          </>
        ) : (
          <Unauthorized />
        )}
      </Layout>
    </>
  );
}
