import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { useAsyncRequest } from './useAsyncRequest';

interface LoginFormState {
  username: string;
  password: string;
}

export const useLogin = () => {
  const { push } = useRouter();
  const { status, setError, setLoading } = useAsyncRequest();
  const { register, handleSubmit } = useForm<LoginFormState>();

  const handleLogin = useCallback(
    handleSubmit((values) => {
      setLoading();
      fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values),
      })
        .then((r) => r.json())
        .then(({ token }) => {
          localStorage.setItem('token', token);
          push('/users');
        })
        .catch((err: Error) => {
          setError(err.message);
        });
    }),
    [handleSubmit],
  );

  return {
    register,
    handleLogin,
    loginStatus: status,
  };
};
