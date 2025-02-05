export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Notepad {
  id: string;
  name: string;
  createdDate: Date;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  createdDate: Date;
  description?: string;
  dueDate?: Date;
  isCompleted: boolean;
  priority?: Priority;
  subtasks?: Subtask[];
  notebookId?: string;
}

interface Subtask {
  completed: boolean;
  title: string;
}

export interface Response<T> {
  status: 200 | 201 | 404 | 409 | 500;
  message: string;
  data?: T;
}

export type NotepadNameAndId = Omit<Notepad, 'createdDate' | 'tasks'>;