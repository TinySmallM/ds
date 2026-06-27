import { motion, AnimatePresence } from 'framer-motion';
import MiniCardFragment from "@/entities/task/ui/MiniCardFragment";
import { useTaskStore } from "@/features/manage-task-queue/model/use-queue-store";
import { useLocation, useNavigate } from '@/shared/routing';
import { Button } from '@/shared/ui/button';

export function QueuePanel() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tasks = useTaskStore((state) => state.tasks);

  if (pathname.startsWith('/tqueue')) {
    return null;
  }

  const runningTasks = tasks.filter((task) => task.status === 'running');
  const nextInQueue = runningTasks.length === 2 
    ? tasks.find((task) => task.status === 'queued') 
    : null;

  const visibleTasks = nextInQueue ? [...runningTasks, nextInQueue] : runningTasks;

  if (visibleTasks.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-(--bg-popup)  w-80 flex flex-col gap-2 py-4 px-4 rounded-[18px]">
      <AnimatePresence mode="sync">
        {visibleTasks.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              opacity: { duration: 0.15, ease: "linear" },
              layout: { type: "spring", stiffness: 300, damping: 30 } 
            }}
            className="w-full"
          >
            <MiniCardFragment item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
      <div className='text-center'>
        <Button className='cursor-pointer' onClick={() => navigate("/tqueue")} variant='link'>Открыть очередь</Button>
      </div>
    </div>
  );
}
