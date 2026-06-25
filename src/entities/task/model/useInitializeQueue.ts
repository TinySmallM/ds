import { useEffect } from 'react';
import { queueEngine } from './queueEngine';

export const useInitializeQueue = () => {
  useEffect(() => {
    queueEngine.start();

    return () => {
      queueEngine.stop();
    };
  }, []);
};