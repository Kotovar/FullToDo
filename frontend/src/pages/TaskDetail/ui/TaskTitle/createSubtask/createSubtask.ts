import { v4 as uuidv4 } from 'uuid';

export const createSubtask = (title: string) => {
  return {
    title,
    isCompleted: false,
    _id: uuidv4(),
  };
};
