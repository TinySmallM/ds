import { FilteredTasksType, GenerationTask, TaskType } from '@/entities/task/model/types';
import { create } from 'zustand';


interface TaskState {
  tasks: GenerationTask[];
  filteredTasks: GenerationTask[];
  activeFilter: FilteredTasksType;

  updateProgress: (id: string, progress: number) => void;
  moveToExecution: (id: string) => Promise<void>;
  cancelTask: (id: string) => Promise<void>;
  moveToCompleted: (id: string) => Promise<void>;
  moveToFailed: (id: string, error: string) => Promise<void>;
  addTask: (type: TaskType, prompt: string, version: string) => Promise<void>;
  retryTask: (id: string) => Promise<void>;
  clearCompletedTasks: () => Promise<void>;
  getFilteredTasks: (status: FilteredTasksType) => Promise<void>; 
}

const INITIAL_TASKS: GenerationTask[] = [
  { id: '1', type: 'text', prompt: 'Анализ financial отчета за Q2', status: 'queued', version: 'Flux', progress: 0, createdAt: Date.now() - 50000 },
  { id: '2', type: 'image', prompt: 'Киберпанк неоновый кот, 4k', status: 'queued', version: 'Midjourney v6', progress: 0, createdAt: Date.now() - 45000 },
  { id: '3', type: 'video', prompt: 'Пролет камеры над океаном на закате', status: 'queued', version: 'Midjourney v6', progress: 0, createdAt: Date.now() - 40000, error: 'Превышено время ожидания' },
  { id: '4', type: 'audio', prompt: 'Лоу-фай бит для учебы, 60 bpm', status: 'queued', version: 'Midjourney v6', progress: 0, createdAt: Date.now() - 35000 },
  { id: '5', type: 'text', prompt: 'Скрипт для воронки продаж в Telegram', status: 'queued', version: 'GPT-4o', progress: 0, createdAt: Date.now() - 30000 },
  { id: '6', type: 'image', prompt: 'Минималистичный логотип кофейни', status: 'queued', version: 'GPT-4o', progress: 0, createdAt: Date.now() - 25000 },
  { id: '7', type: 'video', prompt: 'Таймлапс роста фантастического цветка', status: 'queued', version: 'Flux', progress: 0, createdAt: Date.now() - 20000 },
  { id: '8', type: 'audio', prompt: 'Озвучка текста голосом робота', status: 'queued', version: 'Flux', progress: 0, createdAt: Date.now() - 15000 },
  { id: '9', type: 'text', prompt: 'Саммари статьи про квантовые компьютеры', status: 'queued', version: 'Flux', progress: 0, createdAt: Date.now() - 10000 },
  { id: '10', type: 'image', prompt: 'Постер к фильм в стиле нуар', status: 'queued', version: 'GPT-4o', progress: 0, createdAt: Date.now() - 5000 },
];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const useTaskStore = create<TaskState>((set) => {
  
  const updateTasks = (modifyFn: (currentTasks: GenerationTask[]) => GenerationTask[]) => {
    set((state) => {
      const nextTasks = modifyFn(state.tasks);
      return {
        tasks: nextTasks,
        filteredTasks: state.activeFilter === 'all' 
          ? nextTasks 
          : nextTasks.filter(t => t.status === state.activeFilter)
      };
    });
  };

  return {
    tasks: INITIAL_TASKS,
    filteredTasks: INITIAL_TASKS, 
    activeFilter: 'all',

    updateProgress: (id, progress) => {
      updateTasks((list) => list.map(t => t.id === id ? { ...t, progress } : t));
    },

    moveToExecution: async (id) => {
      await delay(100);
      updateTasks((list) => list.map(t => t.id === id ? { ...t, status: 'running' } : t));
    },

    cancelTask: async (id) => {
      await delay(250);
      updateTasks((list) => list.map(t => t.id === id ? { ...t, status: 'userFailed', error: 'Отменено пользователем', progress: 0 } : t));
    },

    moveToCompleted: async (id) => {
      await delay(200);
      updateTasks((list) => list.map(t => t.id === id ? { ...t, status: 'done', progress: 100 } : t));
    },

    moveToFailed: async (id, error) => {
      await delay(200);
      updateTasks((list) => list.map(t => t.id === id ? { ...t, status: 'failed', error } : t));
    },

    addTask: async (type, prompt, version) => {
      await delay(300);
      updateTasks((list) => [
        ...list, 
        { 
          id: crypto.randomUUID(), 
          type, 
          prompt, 
          status: 'queued', 
          version,
          progress: 0, 
          createdAt: Date.now() 
        }
      ]);
    },

    retryTask: async (id) => {
      await delay(300);
      
      updateTasks((list) =>
        list.map((task) =>
          task.id === id
            ? { 
                ...task, 
                status: 'queued',    
                progress: 0,         
                error: undefined,    
                createdAt: Date.now()
              }
            : task
        )
      );
    },

    clearCompletedTasks: async () => {
      await delay(200);
      updateTasks((list) => list.filter(t => t.status !== 'done'));
    },

    getFilteredTasks: async (status) => {
      await delay(450); 
      set((state) => ({
        activeFilter: status,
        filteredTasks: status === 'all' ? state.tasks : state.tasks.filter(t => t.status === status)
      }));
    }
  };
});
