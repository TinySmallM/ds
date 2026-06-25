export type TaskType = 'text' | 'image' | 'audio' | 'video';
export type TaskStatus = 'queued' | 'running' | 'done' | 'failed';

export interface GenerationTask {
  id: string;
  type: TaskType;
  prompt: string;
  status: TaskStatus;
  progress: number; // от 0 до 100
  createdAt: number; // timestamp для FIFO сортировки
  error?: string;
}