import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, ErrorFetching, TaskInput } from '@shared/ui';
import { useBackNavigate } from '@shared/lib';
import { useTaskDetail } from '@entities/Task';
import {
  getFormattedDate,
  handleSubtaskAction,
  useTaskForm,
  createSubtask,
  TaskTextarea,
  TaskTitle,
  SubtasksSkeleton,
  SubtaskItem,
} from '@pages/TaskDetail/ui';
import type { SubtaskAction, TaskDetailProps } from '@pages/TaskDetail/ui';
import type { Task } from '@sharedCommon/*';

export const TaskDetail = (props: TaskDetailProps) => {
  const { notepadId, taskId = '' } = useParams();
  const { t } = useTranslation();
  const { task, isError, isLoading, updateTask } = useTaskDetail({
    notepadId,
    taskId,
    entity: 'task',
  });

  const { form, subtaskTitle, setForm, setSubtaskTitle } = useTaskForm(task);
  const handleGoBack = useBackNavigate();

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

  const subtasksList = useMemo(() => {
    return (
      <ul className='scrollbar-tasks flex list-none flex-col overflow-y-scroll pr-2'>
        {form.subtasks.map(subtask => (
          <SubtaskItem
            key={subtask._id + subtask.title + subtask.isCompleted}
            subtask={subtask}
            updateSubtask={updateSubtask}
          />
        ))}
      </ul>
    );
  }, [form.subtasks, updateSubtask]);

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

    if (form.dueDate === '' && task?.dueDate) {
      updates.dueDate = null;
    } else if (form.dueDate) {
      const currentDueDate = task?.dueDate
        ? getFormattedDate(task.dueDate)
        : null;
      const newDueDate = form.dueDate;

      if (currentDueDate !== newDueDate) {
        updates.dueDate = new Date(form.dueDate);
      }
    }

    if (
      Object.keys(updates).length > 0 &&
      (await updateTask(updates, taskId, 'update'))
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

    updateTask({ subtasks: updatedSubtasks }, taskId, 'create');

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
    <section {...props} className='flex h-full flex-col gap-1 p-1'>
      <Button
        className='dark:border-dark self-start border-1'
        appearance='primary'
        onClick={handleGoBack}
        padding='s'
      >
        {t('back')}
      </Button>

      <TaskTitle
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      {subtasksList}

      <fieldset className='mt-auto flex flex-col gap-2'>
        <legend className='sr-only'>{t('tasks.detail')}</legend>

        <TaskInput
          value={subtaskTitle}
          label={t('tasks.addSubtask')}
          placeholder={
            form.subtasks.length > 0
              ? t('tasks.steps.next')
              : t('tasks.steps.first')
          }
          onChange={e => setSubtaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={handleCreateSubtask}
          className='bg-light rounded-sm'
        />

        <TaskInput
          value={form.dueDate}
          label={t('tasks.date')}
          onChange={e => setForm({ ...form, dueDate: e.target.value })}
          type='date'
          className='bg-light rounded-sm'
        />

        <TaskTextarea
          label={t('tasks.description')}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </fieldset>

      <Button
        appearance='primary'
        type='submit'
        padding='s'
        className='dark:border-dark self-center border-1'
        onClick={handleUpdateTask}
      >
        {t('save')}
      </Button>
    </section>
  );
};
