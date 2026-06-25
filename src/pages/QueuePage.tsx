import { useInitializeQueue } from "@/entities/task/model/useInitializeQueue";
import CardListQueueStatCount from "@/entities/task/ui/CardListQueueStatCount";
import ClearButton from "@/features/manage-task-queue/ui/ClearButton";


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
      <CardListQueueStatCount />
    </div>
  );
};

export default QueuePage;