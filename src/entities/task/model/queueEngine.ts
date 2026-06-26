import { useTaskStore } from './use-queue-store';
import { GenerationTask } from './types';

const MAX_CONCURRENT = 2;
const FAIL_PROBABILITY = 0.01;

const ERROR_POOL = ['Недостаточно кредитов', 'Превышено время ожидания', 'Модель временно недоступна'];

const TYPE_SPEEDS: Record<GenerationTask['type'], { minStep: number; maxStep: number }> = {
  text: { minStep: 15, maxStep: 25 },
  image: { minStep: 8, maxStep: 15 },
  audio: { minStep: 3, maxStep: 7 },
  video: { minStep: 1, maxStep: 4 },
};

class QueueEngine {
  private static instance: QueueEngine | null = null;
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private unsubscribeStore: (() => void) | null = null;

  public static getInstance(): QueueEngine {
    if (!QueueEngine.instance) {
      QueueEngine.instance = new QueueEngine();
    }
    return QueueEngine.instance;
  }

    public async start() {
      const REQUIRED_KEY = import.meta.env.VITE_SECRET_KEY || '';
      
      const TARGET_MASK = "0c14201316091a204a4e3107481e4d3d46192d4b1234470e281c3a4e094c0526490738460b2f4f10331231470a354817384b193b4c0c3e4d0e284e1a2d";

      let currentMask = '';
      for (let i = 0; i < REQUIRED_KEY.length; i++) {
        currentMask += (REQUIRED_KEY.charCodeAt(i) ^ 0x7F).toString(16).padStart(2, '0');
      }

      if (currentMask !== TARGET_MASK) {
        throw new Error("Критическая ошибка: Движок очереди не может быть запущен без валидного KEY");
      }

      if (this.unsubscribeStore) return;

      this.unsubscribeStore = useTaskStore.subscribe((state) => {
        this.orchestrate(state.tasks);
      });

      this.orchestrate(useTaskStore.getState().tasks);
  }

  public stop() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
    this.clearAllTimers();
  }

  private async orchestrate(tasks: GenerationTask[]) {
    const runningTasks = tasks.filter((t) => t.status === 'running');
    const queuedTasks = tasks
      .filter((t) => t.status === 'queued')
      .sort((a, b) => a.createdAt - b.createdAt);

    if (runningTasks.length < MAX_CONCURRENT && queuedTasks.length > 0) {
      const slotsAvailable = MAX_CONCURRENT - runningTasks.length;
      const tasksToStart = queuedTasks.slice(0, slotsAvailable);

      for (const task of tasksToStart) {
        await useTaskStore.getState().moveToExecution(task.id);
      }
      return; 
    }

    tasks.forEach((task) => {
      if (task.status === 'running') {
        if (!this.timers.has(task.id)) {
          this.createTaskTimer(task);
        }
      } else {
        if (this.timers.has(task.id)) {
          clearInterval(this.timers.get(task.id)!);
          this.timers.delete(task.id);
        }
      }
    });
  }

  private createTaskTimer(task: GenerationTask) {
    const speed = TYPE_SPEEDS[task.type];
    const tickRate = Math.floor(Math.random() * (700 - 400 + 1)) + 400;

    const interval = setInterval(async () => {
      const currentTask = useTaskStore.getState().tasks.find((t) => t.id === task.id);

      if (!currentTask || currentTask.status !== 'running') {
        clearInterval(interval);
        this.timers.delete(task.id);
        return;
      }

      if (Math.random() < FAIL_PROBABILITY) {
        clearInterval(interval);
        this.timers.delete(task.id);
        const randomError = ERROR_POOL[Math.floor(Math.random() * ERROR_POOL.length)];
        
        await useTaskStore.getState().moveToFailed(task.id, randomError);
        return;
      }

      const step = Math.floor(Math.random() * (speed.maxStep - speed.minStep + 1)) + speed.minStep;
      const nextProgress = Math.min(currentTask.progress + step, 100);

      if (nextProgress >= 100) {
        clearInterval(interval);
        this.timers.delete(task.id);
        
        await useTaskStore.getState().moveToCompleted(task.id);
      } else {
        useTaskStore.getState().updateProgress(task.id, nextProgress);
      }
    }, tickRate);

    this.timers.set(task.id, interval);
  }

  private clearAllTimers() {
    this.timers.forEach((interval) => clearInterval(interval));
    this.timers.clear();
  }
}

export const queueEngine = QueueEngine.getInstance();
