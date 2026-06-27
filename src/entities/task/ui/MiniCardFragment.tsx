import { Badge } from "@/shared/ui/badge";
import { StatusBadge } from "@/shared/ui/status-badge";
import { cn } from "@/shared/lib/utils";
import { GenerationTask } from '../model/types';
import { useProgressAnimation } from '@/shared/hooks/use-progress-animation';

interface CardFragmentProps {
  item: GenerationTask;
}

export const MiniCardFragment = ({ item }: CardFragmentProps) => {
  const { fillRef, textRef } = useProgressAnimation(item.progress);

  return (
    <Badge className="bg-(--bg-card) flex flex-col items-start p-4 w-full h-full relative overflow-hidden" variant="outline">
      <div className="flex flex-col md:flex-row gap-4 w-full items-start md:items-center relative z-10">
        
        <div className="flex gap-4 w-full md:grow">
          <div className="w-7 h-7 rounded-[12px] bg-[linear-gradient(135deg,#3b1a0a_0%,#1a1614_100%)] shrink-0"></div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-[12px] line-clamp-2 wrap-break-word text-left">
              {item.prompt}
            </h3>
          </div>
        </div>

        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-border/40 md:border-none">
          <div className="flex flex-row-reverse md:flex-row gap-3 items-center shrink-0">
            {item.status === 'running' && (
              <span ref={textRef} className="text-[#ff7a3d] text-[13px] min-w-8.75 text-right" />
            )}
            {item.status === 'queued' && <StatusBadge variant={item.status} className="whitespace-nowrap" />}
          </div>
        </div>

      </div>

      <div 
        className={cn(
          "mt-2 w-full md:w-[65%] h-1 rounded-full overflow-hidden md:mx-auto relative z-10 transition-colors duration-200",
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

export default MiniCardFragment;
