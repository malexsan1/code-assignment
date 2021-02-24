import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

import { useLogin } from '../hooks';
import loginStyles from '../styles/login.module.css';

interface FormInputProps extends Partial<HTMLInputElement> {
  id: string;
  label: string;
  ref?: React.Ref<any>;
}

const FormInput: React.FC<FormInputProps> = React.forwardRef(({ id, label, type }, ref) => {
  return (
    <div className={loginStyles.formInput}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} ref={ref} type={type} />
    </div>
  );
});

export default function Login() {
  const { handleLogin, register, loginStatus } = useLogin();

  return (
    <>
      <Head>
        <title>Log in</title>
      </Head>

      <form className={loginStyles.form} onSubmit={handleLogin}>
        <Image src="/images/logo.gif" width={50} height={50} alt="Logo" />

        <FormInput id="username" label="Username" ref={register} />
        <FormInput id="password" label="Password" type="password" ref={register} />

        <button type="submit" disabled={loginStatus.status === 'pending'}>
          {loginStatus.status === 'pending' ? 'Loading...' : 'Log in'}
        </button>
        {loginStatus.status === 'error' && <span>{loginStatus.error}</span>}
      </form>
    </>
  );
}
