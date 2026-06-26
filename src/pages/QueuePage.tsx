import { useInitializeQueue } from "@/entities/task/model/useInitializeQueue";
import CardListQueueStatCount from "@/entities/task/ui/CardListQueueStatCount";
import ClearButton from "@/features/manage-task-queue/ui/ClearButton";
import FilteredButton from "@/features/manage-task-queue/ui/FilteredButton";
import TaskList from "@/features/manage-task-queue/ui/TaskList";
import { motion } from 'framer-motion';

const QueuePage = () => {
	useInitializeQueue();

  return (
    <div className="max-w-280 mx-auto px-4 py-10">
      <div className="flex items-center">
        <div className="flex flex-col gap-1.5 grow">
          <h1 className="text-[26px] md:text-[30px] font-bold">Очередь генераций</h1>
          <p className="text-[14px] md:text-[15px] text-muted-foreground">Все ваши задачи в реальном времени</p>
        </div>
        <ClearButton />
      </div>
      <div className="flex w-full flex-wrap md:flex-nowrap items-stretch gap-3 mt-6">
        <CardListQueueStatCount />
      </div>
      <div className="mt-8 flex gap-2 overflow-x-auto md:overflow-x-visible md:flex-wrap touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2 -mb-2">
        <FilteredButton />
      </div>
      <motion.div 
        className="mt-6 flex flex-col gap-2.5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <TaskList />
      </motion.div>
    </div>
  );
};

export default QueuePage;