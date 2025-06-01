import type { MutationMethods, QueryError } from '@shared/api';
import type { Task } from '@sharedCommon/*';

interface TaskBase {
  /**
   * ID блокнота, к которому относятся задачи.
   * Если не указан, используются задачи из общего блокнота
   */
  notepadId?: string;

  /**
   * Колбек, вызываемый при успешном выполнении операции.
   * @param method - тип выполненной операции (создание, обновление, удаление)
   */
  onSuccess?: (method: MutationMethods) => void;

  /**
   * Колбек, вызываемый при ошибке.
   * @param error - объект ошибки с типом и сообщением
   */
  onError?: (error: QueryError) => void;
}

export interface UseTaskDetailProps extends TaskBase {
  /**
   * ID задачи, детали которой нужно получить.
   * Обязательное поле
   */
  taskId: string;
}

export interface UseCreateTaskProps extends TaskBase {}

export interface UseTasksProps extends Omit<TaskBase, 'notepadId'> {
  /**
   * ID блокнота, задачи которого нужно загрузить.
   * Если пустой или равен all, используются задачи из общего блокнота
   */
  notepadId: string;

  /**
   * Параметры фильтрации, сортировки и поиска
   */
  params: URLSearchParams;
}

export interface MutationUpdateProps {
  /**
   * Объект с обновляемыми полями задачи
   */
  updatedTask: Partial<Omit<Task, '_id' | 'createdDate' | 'progress'>>;

  /**
   * ID обновляемой задачи
   */
  id: string;
}
