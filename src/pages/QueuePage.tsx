import { useTaskStore } from "@/entities/task/model/use-queue-store";
import { useInitializeQueue } from "@/entities/task/model/useInitializeQueue";
import { createArray } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { StatusPill } from "@/shared/ui/status-pill";
import { ComponentProps, useCallback, useMemo } from "react";

type PillStatus = ComponentProps<typeof StatusPill>['status'];

interface QueueItem {
  status: PillStatus;
  value: number;
}

const QueuePage = () => {
	useInitializeQueue();

  const cardListArray = createArray(4);
  const tasks = useTaskStore((state) => state.tasks);
	const clearCompletedTasks = useTaskStore((state) => state.clearCompletedTasks);

  const count = useMemo(() => {
    const initial: Record<PillStatus, number> = { 
      queued: 0, 
      running: 0, 
      completed: 0, 
      failed: 0 
    };
    
    return tasks.reduce((acc, task) => {
      const status: PillStatus = task.status === 'done' ? 'completed' : task.status;

      if (status in acc) {
        acc[status]++;
      }
      return acc;
    }, initial);
  }, [tasks]);

  const renderCountQueue = useCallback((numberItem: number): QueueItem => {
    const statusMap: Record<number, QueueItem> = {
      1: { status: 'queued', value: count.queued },
      2: { status: 'running', value: count.running },
      3: { status: 'completed', value: count.completed },
      4: { status: 'failed', value: count.failed },
    };

    return statusMap[numberItem] ?? { status: 'queued', value: 0 };
  }, [count]);

  return (
    <div className="max-w-280 mx-auto px-4 py-10">
      <div className="flex items-center">
        <div className="flex flex-col gap-1.5 grow">
          <h1 className="text-[26px] md:text-[30px] font-bold">Очередь генераций</h1>
          <p className="text-[14px] md:text-[15px] text-muted-foreground">Все ваши задачи в реальном времени</p>
        </div>
        <Button variant="ghost" className="hidden min-[501px]:inline-flex" onClick={clearCompletedTasks}>
          Очистить готовые
        </Button>
      </div>

      <div className="flex w-full flex-wrap md:flex-nowrap items-stretch gap-3 mt-6">
        {cardListArray.map((numberItem) => {
          const itemData = renderCountQueue(numberItem);

          return (
            <Badge key={numberItem} className="bg-(--bg-card) flex-col items-start p-4 w-[calc(50%-6px)] md:w-auto md:flex-1" variant="outline">
              <StatusPill status={itemData.status} count={itemData.value} />
              <div className="pt-2 text-[24px] md:text-[28px] font-bold">{itemData.value}</div>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default QueuePage;