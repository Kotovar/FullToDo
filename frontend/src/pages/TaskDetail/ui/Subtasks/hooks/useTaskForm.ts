import { ChangeEvent, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import type { Task } from '@sharedCommon/*';
import type {
  SubtaskAction,
  UpdateTask,
  ValueType,
} from '@pages/TaskDetail/lib';
import {
  getDateUpdate,
  getForm,
  createSubtask,
  handleSubtaskAction,
} from './utils';

const hasUpdates = (obj: object) => Object.keys(obj).length > 0;

export const useTaskForm = (
  task: Task | null | undefined,
  updateTask: UpdateTask,
  onSuccess: () => void,
  taskKey: string,
) => {
  const { taskId = '' } = useParams();
  const [form, setForm] = useState<ValueType>(() => getForm(task));
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [currentTaskKey, setCurrentTaskKey] = useState(taskKey);

  if (currentTaskKey !== taskKey) {
    setCurrentTaskKey(taskKey);
    setForm(getForm(task));
  }

  const updateSubtask = useCallback(
    (action: SubtaskAction) => {
      setForm(prev => {
        const updatedSubtasks = handleSubtaskAction(prev.subtasks, action);
        updateTask({ subtasks: updatedSubtasks }, taskId, action.type);
        return { ...prev, subtasks: updatedSubtasks };
      });
    },
    [taskId, updateTask],
  );

  const onUpdateTask = useCallback(async () => {
    const { title, description, dueDate } = form;

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
  }, [form, task, taskId, updateTask, onSuccess]);

  const onCreateSubtask = useCallback(() => {
    const title = subtaskTitle.trim();
    if (!title) return;

    const newSubtask = createSubtask(title);

    setForm(prev => {
      const updatedSubtasks = [...prev.subtasks, newSubtask];
      updateTask({ subtasks: updatedSubtasks }, taskId, 'create');
      return { ...prev, subtasks: updatedSubtasks };
    });

    setSubtaskTitle('');
  }, [subtaskTitle, taskId, updateTask]);

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
    (e: ChangeEvent<HTMLInputElement>) => setSubtaskTitle(e.target.value),
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
