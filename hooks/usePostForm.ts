import { route } from 'next/dist/next-server/server/router';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

interface IPost {
  id: string;
  title: string;
  body: string;
  userId: string;
}

export const usePostForm = (post: IPost, onEdit: (post: IPost) => void) => {
  const { register, handleSubmit } = useForm<IPost>({
    defaultValues: post,
  });

  const handleEdit = useCallback(
    handleSubmit((values) => {
      fetch('/api/post', { method: 'POST', body: JSON.stringify(values) })
        .then((r) => r.json())
        .then((r) => {
          onEdit(r.post);
        });
    }),
    [handleSubmit],
  );

  return {
    register,
    handleEdit,
  };
};
