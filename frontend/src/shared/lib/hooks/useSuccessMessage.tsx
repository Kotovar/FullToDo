import { useCallback } from 'react';

export const SUCCESSFUL_MESSAGES = {
  tasks: {
    create: 'notifications.tasks.create',
    update: 'notifications.tasks.update',
    delete: 'notifications.tasks.delete',
  },
  task: {
    create: 'notifications.task.create',
    update: 'notifications.task.update',
    delete: 'notifications.task.delete',
  },
  notepad: {
    create: 'notifications.notepad.create',
    update: 'notifications.notepad.update',
    delete: 'notifications.notepad.delete',
  },
} as const;

export const useSuccessMessage = () => {
  return useCallback(
    (
      entity: keyof typeof SUCCESSFUL_MESSAGES,
      method: keyof (typeof SUCCESSFUL_MESSAGES)[keyof typeof SUCCESSFUL_MESSAGES],
    ) => SUCCESSFUL_MESSAGES[entity][method],
    [],
  );
};
