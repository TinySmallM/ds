import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from "@/entities/task/model/use-queue-store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button"; 
import { StatusBadge } from "@/shared/ui/status-badge";
import { cn, isEmptyArray } from "@/shared/lib/utils";
import { X, RefreshCw, ArrowDownToLine, Ellipsis } from 'lucide-react';
import { useAsyncAction } from '@/shared/hooks/use-async-action';
import { GenerationTask, TaskStatus } from '@/entities/task/model/types';

const TaskRow = ({ 
  item, 
  renderStatusActions 
}: { 
  item: GenerationTask; 
  renderStatusActions: (id: string, status: TaskStatus) => React.ReactNode 
}) => {
  const fillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (fillRef.current) {
        fillRef.current.style.width = `${item.progress}%`;
      }
      if (textRef.current && item.status === 'running') {
        textRef.current.textContent = `${item.progress}%`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [item.progress, item.status]); 

  return (
    <Badge className="bg-(--bg-card) flex flex-col items-start p-4 w-full h-full relative overflow-hidden" variant="outline">
      <div className="flex flex-col md:flex-row gap-4 w-full items-start md:items-center relative z-10">
        
        <div className="flex gap-4 w-full md:grow">
          <div className="w-14 h-14 rounded-[12px] bg-[linear-gradient(135deg,#3b1a0a_0%,#1a1614_100%)] shrink-0"></div>
          <div className="flex flex-col gap-2">
            <h3 className="text-[15px]">{item.prompt}</h3>
            <Badge className="border-transparent self-start gap-1.5" variant="secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-(--bg-pill-status-progress) shrink-0" />
              <span>{item.version}</span>
            </Badge>
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-border/40 md:border-none">
          <div className="flex flex-row-reverse md:flex-row gap-3 items-center shrink-0">
            {item.status === 'running' && (
              <span ref={textRef} className="text-[#ff7a3d] text-[13px] min-w-8.75 text-right" />
            )}
            <StatusBadge variant={item.status} className="whitespace-nowrap" />
          </div>

          <div className='flex gap-1.5'>
            {renderStatusActions(item.id, item.status)}
            <Button className="rounded-sm px-3 cursor-pointer h-9 w-9 p-0 flex items-center justify-center text-muted-foreground" variant='outline'>
              <Ellipsis className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

      <div 
        className={cn(
          "mt-2 w-full md:w-[85%] h-1 rounded-full overflow-hidden md:mx-auto relative z-10 transition-colors duration-200",
          item.status === 'running' ? "bg-(--bg-pill-status-progress-defaut)" : "bg-transparent"
        )}
      >
        <div 
          ref={fillRef}
          className={cn(
            "h-full transition-all duration-200 ease-out",
            item.status === 'running' ? "bg-(--bg-pill-status-progress)" : "bg-transparent"
          )}
          style={{ width: item.status === 'running' ? undefined : '0%' }}
        />
      </div>
    </Badge>
  );
};

const TaskList = () => {
  const filteredTasks = useTaskStore((state) => state.filteredTasks);
  const retryTask = useTaskStore((state) => state.retryTask);
  const cancelTask = useTaskStore((state) => state.cancelTask);

  const [handleRetryTask, isLoadingRetry] = useAsyncAction(retryTask);
  const [handleCancelTask, isLoadingCancel] = useAsyncAction(cancelTask);

  const isTasksEmpty = isEmptyArray(filteredTasks);

  const renderStatusActions = (id: string, status: TaskStatus) => {
    const btnClass = "rounded-[8px] px-3 cursor-pointer h-9 w-9 p-0 flex items-center justify-center";

    switch (status) {
      case 'queued':
      case 'running':
        return (
          <Button 
            className={cn(btnClass, "text-muted-foreground")} 
            variant='outline'
            onClick={() => handleCancelTask(id)}
            disabled={isLoadingCancel}
          >
            <X className="w-4 h-4" />
          </Button>
        );

      case 'failed':
      case 'userFailed':
        return (
          <Button 
            onClick={() => handleRetryTask(id)}
            disabled={isLoadingRetry}
            className={cn(btnClass, "text-[#ff7a3d]")} 
            variant='outline'
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        );

      case 'done':
        return (
          <Button className={cn(btnClass, "text-[#ff7a3d]")} variant='outline'>
            <ArrowDownToLine className="w-4 h-4" />
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
            <TaskRow item={item} renderStatusActions={renderStatusActions} />
          </motion.div>
        ))
      )}
    </AnimatePresence>
  );
};

export default TaskList;
