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

type Entity = keyof typeof SUCCESSFUL_MESSAGES;
type Method = keyof typeof SUCCESSFUL_MESSAGES.tasks;

export const useSuccessMessage = () => {
  return useCallback(
    (entity: Entity, method: Method) => SUCCESSFUL_MESSAGES[entity][method],
    [],
  );
};
