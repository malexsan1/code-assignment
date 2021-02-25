import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { AuthPayload } from '@core/entities';
import { useAsyncRequest } from './useAsyncRequest';

export const useAuth = () => {
  const { push } = useRouter();
  const { status, setError, setLoading } = useAsyncRequest();
  const { register, handleSubmit } = useForm<AuthPayload>();

  const handleLogin = useCallback(
    handleSubmit((values) => {
      setLoading();
      fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values),
      })
        .then((r) => r.json())
        .then(({ token }) => {
          Cookies.set('token', token);
          push('/users');
        })
        .catch((err: Error) => {
          setError(err.message);
        });
    }),
    [handleSubmit],
  );

  const handleLogout = useCallback(() => {
    Cookies.remove('token');
    push('/');
  }, [push]);

  return {
    register,
    handleLogin,
    handleLogout,
    loginStatus: status,
  };
};
