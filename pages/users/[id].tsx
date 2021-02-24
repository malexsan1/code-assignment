import React from 'react';
import Head from 'next/head';

import { useUserForm } from '../../hooks';
import Layout from '../../components/layout';
import FormInput from '../../components/form-input';

import styles from '../../styles/user.module.scss';

interface User {
  id: string;
  name: string;
  phone: string;
  username: string;
  email: string;
  website: string;
}

export async function getServerSideProps({ params }) {
  const request = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
  const user = await request.json();

  return {
    props: {
      user,
    },
  };
}

interface UserProps {
  user: User;
}

export default function User({ user }: UserProps) {
  const { register, handleEdit } = useUserForm(user);

  return (
    <>
      <Head>
        <title>{user.name}</title>
      </Head>
      <Layout>
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
      </Layout>
    </>
  );
}
