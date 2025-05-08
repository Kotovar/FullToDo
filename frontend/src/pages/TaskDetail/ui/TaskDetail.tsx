import { useCallback } from 'react';
import { useParams } from 'react-router';
import type { Task } from '@sharedCommon/*';
import {
  type SubtaskAction,
  type TaskDetailProps,
  getFormattedDate,
  handleSubtaskAction,
  useTaskForm,
} from '@pages/TaskDetail/ui/Subtasks';
import {
  createSubtask,
  Subtasks,
  TaskTextarea,
  TaskTitle,
  SubtasksSkeleton,
} from '@pages/TaskDetail/ui';
import { useTasks } from '@entities/Task';
import { Button, ErrorFetching, TaskInput } from '@shared/ui';
import { useNotifications, useBackNavigate } from '@shared/lib';
import { getSuccessMessage } from '@shared/api';

export const TaskDetail = (props: TaskDetailProps) => {
  const { notepadId = '', taskId = '' } = useParams();
  const handleGoBack = useBackNavigate();
  const { showSuccess, showError } = useNotifications();
  const { task, isError, isLoading, methods } = useTasks({
    notepadId,
    taskId,
    onSuccess: method => showSuccess(getSuccessMessage('task', method)),
    onError: error => showError(error.message),
  });
  const { form, subtaskTitle, setForm, setSubtaskTitle } = useTaskForm(task);

  const updateSubtask = useCallback(
    (action: SubtaskAction) => {
      const updatedSubtasks = handleSubtaskAction(form.subtasks, action);
      setForm(prev => ({ ...prev, subtasks: updatedSubtasks }));
      methods.updateTask({ subtasks: updatedSubtasks }, taskId, action.type);
    },
    [form.subtasks, methods, setForm, taskId],
  );

  if (isLoading) {
    return <SubtasksSkeleton />;
  }

  if (isError) {
    return <ErrorFetching />;
  }

  const handleUpdateTask = async () => {
    const updates: Partial<Task> = {};

    if (task?.title !== form.title) {
      updates.title = form.title;
    }

    if (task?.description !== form.description) {
      updates.description = form.description;
    }

    const currentDueDate = task?.dueDate
      ? getFormattedDate(task.dueDate)
      : null;
    const newDueDate = form.dueDate ? form.dueDate : null;

    if (currentDueDate !== newDueDate) {
      updates.dueDate = form.dueDate ? new Date(form.dueDate) : undefined;
    }

    if (
      Object.keys(updates).length > 0 &&
      (await methods.updateTask(updates, taskId, 'update'))
    ) {
      handleGoBack();
    }
  };

  const handleCreateSubtask = () => {
    if (!subtaskTitle.trim()) {
      return;
    }

    const newSubtask = createSubtask(subtaskTitle);
    const updatedSubtasks = [...form.subtasks, newSubtask];

    methods.updateTask({ subtasks: updatedSubtasks }, taskId, 'create');

    setForm(prev => ({
      ...prev,
      subtasks: updatedSubtasks,
    }));
    setSubtaskTitle('');
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && subtaskTitle) {
      event.preventDefault();
      handleCreateSubtask();
    }
  };

  return (
    <section {...props} className='flex flex-col gap-1 p-1'>
      <Button
        className='self-start'
        appearance='primary'
        onClick={handleGoBack}
        padding='s'
      >
        Назад
      </Button>

      <TaskTitle
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      {task && (
        <Subtasks subtasks={form.subtasks} updateSubtask={updateSubtask} />
      )}

      <fieldset className='flex flex-col gap-2'>
        <legend className='sr-only'>Детали задачи</legend>

        <TaskInput
          value={subtaskTitle}
          label='Добавить подзадачу'
          placeholder={
            form.subtasks.length > 0 ? 'Следующий шаг' : 'Первый шаг'
          }
          onChange={e => setSubtaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={handleCreateSubtask}
        />

        <TaskInput
          value={form.dueDate}
          label='Дата выполнения'
          onChange={e => setForm({ ...form, dueDate: e.target.value })}
          type='date'
        />

        <TaskTextarea
          label='Описание'
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </fieldset>

      <Button
        appearance='primary'
        type='submit'
        padding='s'
        className='self-center'
        onClick={handleUpdateTask}
      >
        Сохранить
      </Button>
    </section>
  );
};
