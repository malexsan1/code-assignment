import { useCallback, useState } from 'react';

interface AsyncRequest {
  status: 'success' | 'pending' | 'error';
  error?: string;
}

export const useAsyncRequest = () => {
  const [status, setStatus] = useState<AsyncRequest>({ status: 'success', error: '' });

  const setLoading = useCallback(
    () =>
      setStatus({
        status: 'pending',
        error: '',
      }),
    [setStatus],
  );

  const setError = useCallback(
    (errorMessage: string) =>
      setStatus({
        status: 'error',
        error: errorMessage,
      }),
    [setStatus],
  );

  return {
    status,
    setError,
    setLoading,
  };
};
