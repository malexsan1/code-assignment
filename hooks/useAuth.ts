import { useCallback } from 'react';
import { object, string } from 'yup';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { AuthPayload } from '@core/entities';
import { useAsyncRequest } from './useAsyncRequest';

const requiredMessage = 'This field is required.';
const schema = object().shape({
  username: string().required(requiredMessage),
  password: string().required(requiredMessage),
});

export const useAuth = () => {
  const { push } = useRouter();
  const { status, setError, setLoading } = useAsyncRequest();
  const { register, handleSubmit, errors } = useForm<AuthPayload>({
    resolver: yupResolver(schema),
  });

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
    errors,
    register,
    handleLogin,
    handleLogout,
    loginStatus: status,
  };
};
