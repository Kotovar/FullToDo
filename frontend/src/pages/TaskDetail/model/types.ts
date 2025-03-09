export interface Subtask {
  completed: boolean;
  title: string;
}

export interface Task {
  name: string;
  progress: string;
  id: number;
  notepadId: number;
  subtasksCompleted: boolean;
  subtasks: Subtask[];
}

export interface Notepad {
  notepadName: string;
  path: string;
  id: number;
}
