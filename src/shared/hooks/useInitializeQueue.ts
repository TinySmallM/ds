import { queueEngine } from '@/features/manage-task-queue/model/queueEngine';
import { useEffect } from 'react';

export const useInitializeQueue = () => {
  useEffect(() => {
    console.log('Start InitializeQueue')
    queueEngine.start().catch((err) => console.error(err));

    return () => {
      queueEngine.stop();
    };
  }, []);
};
