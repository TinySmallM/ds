import { useTaskStore } from "@/features/manage-task-queue/model/use-queue-store";
import { useAsyncAction } from "@/shared/hooks/use-async-action";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";

const CancelTaskButton = ({id}: {id: string}) => {
  const cancelTask = useTaskStore((state) => state.cancelTask);
  
  const [handleCancelTask, isLoading] = useAsyncAction(cancelTask);
  
  return (
    <Button 
      variant='outline'
      className="text-muted-foreground rounded-sm px-3 cursor-pointer h-9 w-9 p-0 flex items-center justify-center" 
      onClick={() => handleCancelTask(id)}
      disabled={isLoading}
      aria-disabled={isLoading}
      aria-busy={isLoading}
    >
       <X className="w-4 h-4" />
    </Button>
  );
};

export default CancelTaskButton;
