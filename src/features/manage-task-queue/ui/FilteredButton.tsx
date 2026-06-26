import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useTaskStore } from "@/entities/task/model/use-queue-store";
import { useAsyncAction } from "@/shared/hooks/use-async-action";
import { FilteredTasksType } from "@/entities/task/model/types";

const FILTER_ITEMS: { status: FilteredTasksType; label: string }[] = [
  { status: "all", label: "Все" },
  { status: "queued", label: "В Очереди" },
  { status: "running", label: "Идет" },
  { status: "done", label: "Готово" },
  { status: "failed", label: "Ошибка" },
];

const FilteredButton = () => {
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
  const [handleFilter, isLoading] = useAsyncAction(getFilteredTasks);
  
  const [activeFilter, setActiveFilter] = useState<FilteredTasksType>("all");

  const updateFilter = async (status: FilteredTasksType) => {
    setActiveFilter(status);
    await handleFilter(status);
  };

  return (
    <>
      {FILTER_ITEMS.map(({status, label }) => {
        const isActive = activeFilter === status;

        return (
          <Button
            key={status}
            onClick={() => updateFilter(status)}
            variant="ghost"
            disabled={isLoading}
            aria-disabled={isLoading}
            aria-busy={isLoading}
            className={cn(
              "cursor-pointer transition-all border shrink-0",
              isActive
                ? "bg-linear-to-br from-primary to-[#ff7a3d] text-white border-transparent hover:opacity-90"
                : "bg-transparent border-(--seo-pill-border) text-(--seo-pill-text)"
            )}
          >
            {label}
          </Button>
        );
      })}
    </>
  );
};

export default FilteredButton;