import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { getFormattedDate, handleSubtaskAction, createSubtask } from '..';
import type { SubtaskAction, UpdateTask, ValueType } from '../types';
import type { Task } from '@sharedCommon/*';

const getForm = (initialTask?: Task | null) => {
  return {
    title: initialTask?.title || '',
    dueDate: initialTask?.dueDate ? getFormattedDate(initialTask.dueDate) : '',
    description: initialTask?.description || '',
    subtasks: initialTask?.subtasks || [],
  };
};

const hasUpdates = (obj: object) => Object.keys(obj).length > 0;

export const useTaskForm = (
  task: Task | null | undefined,
  updateTask: UpdateTask,
  onSuccess: () => void,
) => {
  const { taskId = '' } = useParams();
  const [form, setForm] = useState<ValueType>(() => getForm(task));
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const formRef = useRef(form);
  const subtaskTitleRef = useRef('');
  formRef.current = form;

  useEffect(() => {
    if (task) {
      setForm(getForm(task));
    }
  }, [task]);

  const updateSubtask = useCallback(
    (action: SubtaskAction) => {
      setForm(prev => {
        const updatedSubtasks = handleSubtaskAction(prev.subtasks, action);
        updateTask({ subtasks: updatedSubtasks }, taskId, action.type);

        return { ...prev, subtasks: updatedSubtasks };
      });
    },
    [setForm, taskId, updateTask],
  );

  const getDateUpdate = useCallback(
    (taskDate: Date | null | undefined, newDate: string) => {
      if (newDate === '' && taskDate) return null;
      if (!newDate) return undefined;

      const current = taskDate ? getFormattedDate(taskDate) : null;
      return current !== newDate ? new Date(newDate) : undefined;
    },
    [],
  );

  const onUpdateTask = useCallback(async () => {
    const { title, description, dueDate } = formRef.current;
    const updates: Partial<Task> = {};

    if (task?.title !== title) updates.title = title;
    if (task?.description !== description) updates.description = description;

    const dateUpdate = getDateUpdate(task?.dueDate, dueDate);
    if (dateUpdate !== undefined) updates.dueDate = dateUpdate;

    if (!hasUpdates(updates)) return false;

    try {
      const isSuccess = await updateTask(updates, taskId, 'update');
      if (isSuccess) onSuccess();
      return isSuccess;
    } catch {
      return false;
    }
  }, [
    taskId,
    task?.description,
    task?.dueDate,
    task?.title,
    getDateUpdate,
    onSuccess,
    updateTask,
  ]);

  const onCreateSubtask = useCallback(() => {
    const title = subtaskTitleRef.current.trim();
    if (!title) return;

    const newSubtask = createSubtask(title);

    setForm(prev => {
      const updatedSubtasks = [...prev.subtasks, newSubtask];
      updateTask({ subtasks: updatedSubtasks }, taskId, 'create');
      return { ...prev, subtasks: updatedSubtasks };
    });

    setSubtaskTitle('');
    subtaskTitleRef.current = '';
  }, [taskId, updateTask]);

  const handleKeyDown = useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >(
    e => {
      if (e.key === 'Enter') onCreateSubtask();
    },
    [onCreateSubtask],
  );

  const onChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, title: e.target.value })),
    [],
  );

  const onChangeSubtaskTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSubtaskTitle(value);
      subtaskTitleRef.current = value;
    },
    [],
  );

  const onChangeDueDate = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, dueDate: e.target.value })),
    [],
  );

  const onChangeDescription = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, description: e.target.value })),
    [],
  );

  return {
    form,
    subtaskTitle,
    methods: {
      onUpdateTask,
      onCreateSubtask,
      onChangeTitle,
      onChangeSubtaskTitle,
      onChangeDueDate,
      onChangeDescription,
      handleKeyDown,
      updateSubtask,
    },
  };
};
