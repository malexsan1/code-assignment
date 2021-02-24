import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';

interface LoginFormState {
  username: string;
  password: string;
}

interface LoginRequest {
  status: 'success' | 'pending' | 'error';
  error?: string;
}

const initialLoginStatus: LoginRequest = { status: 'success', error: '' };

export const useLogin = () => {
  const [loginStatus, setLoginStatus] = useState<LoginRequest>(initialLoginStatus);
  const { register, handleSubmit } = useForm<LoginFormState>();
  const { push } = useRouter();

  const handleLogin = useCallback(
    handleSubmit((values) => {
      setLoginStatus({
        status: 'pending',
        error: '',
      });
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
          setLoginStatus({
            error: err.message,
            status: 'error',
          });
        });
    }),
    [handleSubmit],
  );

  return {
    register,
    handleLogin,
    loginStatus,
  };
};
