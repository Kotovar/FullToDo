import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getFormattedDate } from './getFormattedDate';
import type { Task } from '@sharedCommon/*';
import type { ValueType } from '../types';

const getForm = (initialTask?: Task | null) => {
  return {
    title: initialTask?.title || '',
    dueDate: initialTask?.dueDate ? getFormattedDate(initialTask.dueDate) : '',
    description: initialTask?.description || '',
    subtasks: initialTask?.subtasks || [],
  };
};

export const useTaskForm = (initialTask?: Task | null) => {
  const [form, setForm] = useState<ValueType>(() => getForm(initialTask));

  const [subtaskTitle, setSubtaskTitle] = useState('');

  useEffect(() => {
    if (initialTask) {
      setForm(getForm(initialTask ?? null));
    }
  }, [initialTask]);

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
