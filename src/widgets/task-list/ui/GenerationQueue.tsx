import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from "@/features/manage-task-queue/model/use-queue-store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button"; 
import { isEmptyArray } from "@/shared/lib/utils";
import { TaskStatus } from '@/entities/task/model/types';
import CardFragment from '@/entities/task/ui/CardFragment';
import RetryTaskButton from '@/features/manage-task-queue/ui/RetryTaskButton';
import CancelTaskButton from '@/features/manage-task-queue/ui/CancelTaskButton';
import { ArrowDownToLine } from 'lucide-react';


export const GenerationQueue = () => {
  const filteredTasks = useTaskStore((state) => state.filteredTasks);

  const isTasksEmpty = isEmptyArray(filteredTasks);

  const renderStatusActions = (id: string, status: TaskStatus) => {

    switch (status) {
      case 'queued':
      case 'running':
        return (
          <CancelTaskButton id={id} />
        );

      case 'failed':
      case 'userFailed':
        return (
         <RetryTaskButton id={id} />
        );

      //Заглушка - нет фичей.
      case 'done':
        return (
          <Button className="text-[#ff7a3d] rounded-sm px-3 cursor-pointer h-9 w-9 p-0 flex items-center justify-center" variant='outline'>
            <ArrowDownToLine />
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="popLayout">
      {isTasksEmpty ? (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "linear" }}
          className="w-full"
        >
          <Badge className="bg-(--bg-card) p-4 w-full justify-center text-muted-foreground" variant="outline">
            Очередь пуста
          </Badge>
        </motion.div>
      ) : (
        filteredTasks.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
            className="md:w-auto md:flex-1"
          >
            <CardFragment item={item} renderStatusActions={renderStatusActions} />
          </motion.div>
        ))
      )}
    </AnimatePresence>
  );
};
