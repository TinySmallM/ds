import { useTaskStore } from "@/features/manage-task-queue/model/use-queue-store";
import { useAsyncAction } from "@/shared/hooks/use-async-action";
import { Button } from "@/shared/ui/button";
import { RefreshCw } from "lucide-react";

const RetryTaskButton = ({id}: {id: string}) => {
  const retryTask = useTaskStore((state) => state.retryTask);
  
  const [handleRetryTask, isLoading] = useAsyncAction(retryTask);
  
  return (
    <Button 
      variant='outline'
      className="text-[#ff7a3d] rounded-sm px-3 cursor-pointer h-9 w-9 p-0 flex items-center justify-center" 
      onClick={() => handleRetryTask(id)}
      disabled={isLoading}
      aria-disabled={isLoading}
      aria-busy={isLoading}
    >
      <RefreshCw />
    </Button>
  );
};

export default RetryTaskButton;