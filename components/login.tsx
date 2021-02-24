import React from 'react';
import Image from 'next/image';

import loginStyles from '../styles/login.module.css';

interface FormInputProps extends Partial<HTMLInputElement> {
  id: string;
  label: string;
}

const FormInput: React.FC<FormInputProps> = ({ id, required, label }) => {
  return (
    <div className={loginStyles.formInput}>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
};

export default function Login() {
  return (
    <form className={loginStyles.form}>
      <Image src="/images/logo.gif" width={50} height={50} alt="Logo" />

      <FormInput id="username" label="Username" />
      <FormInput id="password" label="Password" type="password" />

      <button type="submit">Log in</button>
    </form>
  );
}
