import { useTaskStore } from "@/entities/task/model/use-queue-store";
import { Button } from "@/shared/ui/button";

const ClearButton = () => {
  const clearCompletedTasks = useTaskStore((state) => state.clearCompletedTasks);
  
  return (
    <Button variant="ghost" className="hidden min-[501px]:inline-flex" onClick={clearCompletedTasks}>
      Очистить готовые
    </Button>
  )
}

export default ClearButton;