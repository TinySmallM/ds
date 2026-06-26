import { useEffect } from 'react';
import { queueEngine } from './queueEngine';

export const useInitializeQueue = () => {
  useEffect(() => {
    queueEngine.start().catch((err) => console.error(err));

    return () => {
      queueEngine.stop();
    };
  }, []);
};
