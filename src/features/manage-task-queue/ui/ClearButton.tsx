import { useTaskStore } from "@/features/manage-task-queue/model/use-queue-store";
import { useAsyncAction } from "@/shared/hooks/use-async-action";
import { Button } from "@/shared/ui/button";

const ClearButton = () => {
  const clearCompletedTasks = useTaskStore((state) => state.clearCompletedTasks);
  
  const [handleClear, isLoading] = useAsyncAction(clearCompletedTasks);
  
  return (
    <Button 
      variant="ghost" 
      className="hidden min-[501px]:inline-flex cursor-pointer" 
      onClick={handleClear}
      disabled={isLoading}
      aria-disabled={isLoading}
      aria-busy={isLoading}
    >
      Очистить готовые
    </Button>
  );
};

export default ClearButton;