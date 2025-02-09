export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Notepad {
  id: string;
  name: string;
  tasks: Task[];
}

export type NotepadWithoutTasks = Omit<Notepad, 'tasks'>

export interface Task {
  id: string;
  title: string;
  createdDate: Date;
  description?: string;
  dueDate?: Date;
  isCompleted: boolean;
  priority?: Priority;
  subtasks?: Subtask[];
  notebookId: string;
}

export interface Subtask {
  completed: boolean;
  title: string;
}

export interface Response<T> {
  status: 200 | 201 | 204 | 404 | 409 | 500;
  message?: string;
  data?: T;
}