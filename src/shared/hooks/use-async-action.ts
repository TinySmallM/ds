import { useState, useCallback, useRef, useEffect } from 'react';

export function useAsyncAction<Args extends unknown[], ReturnValue>(
  asyncCallback: (...args: Args) => Promise<ReturnValue>
) {
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<ReturnValue | undefined> => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const result = await asyncCallback(...args);
        return result;
      } catch (error) {
        console.error('Async action failed:', error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [asyncCallback, isLoading]
  );

  return [execute, isLoading] as const;
}