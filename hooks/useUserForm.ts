import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  phone: string;
  username: string;
  email: string;
  website: string;
}

export const useUserForm = (user: User) => {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<User>({
    defaultValues: user,
  });

  const handleEdit = useCallback(
    handleSubmit((values) => {
      fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(values),
      })
        .then((r) => r.json())
        .then((r) => {
          console.log('dupa edit', r);
          push('/users');
        });
    }),
    [handleSubmit, push],
  );

  return {
    register,
    handleEdit,
  };
};
