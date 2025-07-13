import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { Button, ErrorFetching, TaskInput } from '@shared/ui';
import { useBackNavigate } from '@shared/lib';
import { useTaskDetail } from '@entities/Task';
import {
  TaskTextarea,
  TaskTitle,
  TaskDetailSkeleton,
  SubtaskItem,
  useTaskForm,
  TaskDetailProps,
} from '@pages/TaskDetail/ui';

const TaskDetail = (props: TaskDetailProps) => {
  const { t } = useTranslation();
  const { task, isError, isLoading, updateTask } = useTaskDetail({
    entity: 'task',
  });
  const handleGoBack = useBackNavigate();

  const { form, subtaskTitle, methods } = useTaskForm(
    task,
    updateTask,
    handleGoBack,
  );

  const {
    onUpdateTask,
    onCreateSubtask,
    onChangeTitle,
    onChangeSubtaskTitle,
    onChangeDueDate,
    onChangeDescription,
    handleKeyDown,
    updateSubtask,
  } = methods;

  const subtasksList = useMemo(() => {
    return (
      <ul className='scrollbar-tasks mls:col-1 mls:pr-0 flex list-none flex-col overflow-y-scroll pr-2 empty:hidden'>
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
    return <TaskDetailSkeleton />;
  }

  if (isError) {
    return <ErrorFetching />;
  }

  return (
    <section
      {...props}
      className='mls:grid mls:grid-cols-3 mls:grid-rows-min flex h-full flex-col gap-1 p-1'
    >
      <Button
        className='mls:col-1 mls:place-self-center self-start'
        onClick={handleGoBack}
        padding='md'
      >
        {t('back')}
      </Button>

      <TaskTitle value={form.title} onChange={onChangeTitle} />

      {subtasksList}

      <fieldset
        className={clsx('mls:col-span-2 mls:mt-0 mt-auto flex flex-col gap-2', {
          ['mls:col-span-full']: form.subtasks.length === 0,
        })}
      >
        <legend className='sr-only'>{t('tasks.detail')}</legend>

        <TaskInput
          value={subtaskTitle}
          label={t('tasks.addSubtask')}
          placeholder={t(
            `tasks.steps.${form.subtasks.length > 0 ? 'next' : 'first'}`,
          )}
          onChange={onChangeSubtaskTitle}
          onKeyDown={handleKeyDown}
          onClick={onCreateSubtask}
        />

        <TaskInput
          value={form.dueDate}
          label={t('tasks.date')}
          onChange={onChangeDueDate}
          type='date'
        />

        <TaskTextarea
          label={t('tasks.description')}
          value={form.description}
          onChange={onChangeDescription}
        />
      </fieldset>

      <Button
        type='submit'
        padding='md'
        className='mls:col-3 mls:row-1 mls:justify-self-center self-center'
        onClick={onUpdateTask}
      >
        {t('save')}
      </Button>
    </section>
  );
};

export default TaskDetail;
