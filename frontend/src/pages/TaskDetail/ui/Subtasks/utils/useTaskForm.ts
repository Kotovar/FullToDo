import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@sharedCommon/*';
import { ValueType } from '../types';
import { getFormattedDate } from './getFormattedDate';

export const useTaskForm = (initialTask?: Task | null) => {
  const [form, setForm] = useState<ValueType>({
    title: initialTask?.title || '',
    dueDate: initialTask?.dueDate ? getFormattedDate(initialTask.dueDate) : '',
    description: initialTask?.description || '',
    subtasks: initialTask?.subtasks || [],
  });

  const [subtaskTitle, setSubtaskTitle] = useState('');

  const handleAddSubtask = () => {
    if (!subtaskTitle.trim()) return;

    setForm(prev => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        { isCompleted: false, title: subtaskTitle, _id: uuidv4() },
      ],
    }));
    setSubtaskTitle('');
  };

  return {
    form,
    setForm,
    subtaskTitle,
    setSubtaskTitle,
    handleAddSubtask,
  };
};
