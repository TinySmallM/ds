import { useTaskStore } from "@/entities/task/model/use-queue-store";
import { createArray } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { StatusPill } from "@/shared/ui/status-pill";
import { ComponentProps, useCallback, useMemo } from "react";

type PillStatus = ComponentProps<typeof StatusPill>['status'];

interface QueueItem {
  status: PillStatus;
  value: number;
}

const CardListQueueStatCount = () => {
  const cardListArray = createArray(4);
  const tasks = useTaskStore((state) => state.tasks);

  const count = useMemo(() => {
    const initial: Record<PillStatus, number> = { 
      queued: 0, 
      running: 0, 
      completed: 0, 
      failed: 0,
      userFailed: 0,
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
    <>
      {cardListArray.map((numberItem) => {
        const itemData = renderCountQueue(numberItem);

        return (
          <Badge key={numberItem} className="bg-(--bg-card) flex-col items-start p-4 w-[calc(50%-6px)] md:w-auto md:flex-1" variant="outline">
            <StatusPill status={itemData.status} count={itemData.value} />
            <div className="pt-2 text-[24px] md:text-[28px] font-bold">{itemData.value}</div>
          </Badge>
        );
      })}
    </>
  );
};

export default CardListQueueStatCount;
