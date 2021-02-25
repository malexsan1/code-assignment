import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { IUser } from '@core/entities';

export const useUserForm = (user: IUser) => {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<IUser>({
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
