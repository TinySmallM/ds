import { create } from 'zustand';
import { GenerationTask, TaskType } from './types';

interface TaskState {
  tasks: GenerationTask[];

  addTask: (type: TaskType, prompt: string) => void;
  startTask: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  completeTask: (id: string) => void;
  failTask: (id: string, error: string) => void;
  cancelTask: (id: string) => void;
  clearCompletedTasks: () => void; // Метод очистки
}

const INITIAL_TASKS: GenerationTask[] = [
  { id: '1', type: 'text', prompt: 'Анализ financial отчета за Q2', status: 'done', progress: 0, createdAt: Date.now() - 50000 },
  { id: '2', type: 'image', prompt: 'Киберпанк неоновый кот, 4k', status: 'done', progress: 0, createdAt: Date.now() - 45000 },
  { id: '3', type: 'video', prompt: 'Пролет камеры над океаном на закате', status: 'failed', progress: 0, createdAt: Date.now() - 40000, error: 'Превышено время ожидания' },
  { id: '4', type: 'audio', prompt: 'Лоу-фай бит для учебы, 60 bpm', status: 'running', progress: 0, createdAt: Date.now() - 35000 },
  { id: '5', type: 'text', prompt: 'Скрипт для воронки продаж в Telegram', status: 'running', progress: 0, createdAt: Date.now() - 30000 },
  { id: '6', type: 'image', prompt: 'Минималистичный логотип кофейни', status: 'queued', progress: 0, createdAt: Date.now() - 25000 },
  { id: '7', type: 'video', prompt: 'Таймлапс роста фантастического цветка', status: 'queued', progress: 0, createdAt: Date.now() - 20000 },
  { id: '8', type: 'audio', prompt: 'Озвучка текста голосом робота', status: 'queued', progress: 0, createdAt: Date.now() - 15000 },
  { id: '9', type: 'text', prompt: 'Саммари статьи про квантовые компьютеры', status: 'queued', progress: 0, createdAt: Date.now() - 10000 },
  { id: '10', type: 'image', prompt: 'Постер к фильму в стиле нуар', status: 'queued', progress: 0, createdAt: Date.now() - 5000 },
];

export const useTaskStore = create<TaskState>((set) => ({
  tasks: INITIAL_TASKS,

  addTask: (type, prompt) => set((state) => ({
    tasks: [...state.tasks, {
      id: crypto.randomUUID(),
      type,
      prompt,
      status: 'queued',
      progress: 0,
      createdAt: Date.now(),
    }]
  })),

  startTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'running' } : t)
  })),

  updateProgress: (id, progress) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, progress } : t)
  })),

  completeTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'done', progress: 100 } : t)
  })),

  failTask: (id, error) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'failed', error } : t)
  })),

  cancelTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'failed', error: 'Отменено пользователем', progress: 0 } : t)
  })),

  clearCompletedTasks: () => set((state) => ({
    tasks: state.tasks.filter(t => t.status !== 'done')
  })),
}));