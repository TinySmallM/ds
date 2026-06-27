export type TaskType = 'text' | 'image' | 'audio' | 'video';
export type TaskStatus = 'queued' | 'running' | 'done' | 'failed' | 'userFailed';

export type FilteredTasksType = GenerationTask['status'] | 'all';

export interface GenerationTask {
  id: string;
  type: TaskType;
  version: 'GPT-4o' | 'Flux' | 'Midjourney v6' | string
  prompt: string;
  status: TaskStatus;
  progress: number; // от 0 до 100
  createdAt: number; // timestamp для FIFO сортировки
  error?: string;
}
