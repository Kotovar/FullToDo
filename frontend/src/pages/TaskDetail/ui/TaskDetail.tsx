import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@shared/ui';
import type {
  SubtaskAction,
  TaskDetailProps,
} from '@pages/TaskDetail/ui/Subtasks';
import {
  handleSubtaskAction,
  useTask,
  useTaskForm,
} from '@pages/TaskDetail/ui/Subtasks';
import { Subtasks, TaskTextarea, TaskTitle } from '@pages/TaskDetail/ui';
import { useTasks } from '@entities/Task';
import { TaskInput } from './TaskInput';

export const TaskDetail = (props: TaskDetailProps) => {
  const { notepadId = '', taskId = '' } = useParams();
  const navigate = useNavigate();

  const { task, isError, updateTask } = useTask(notepadId, taskId);
  const { methods } = useTasks(notepadId);
  const { form, setForm, subtaskTitle, setSubtaskTitle, handleAddSubtask } =
    useTaskForm(task);
  const [errorMessage, setErrorMessage] = useState('');

  const updateSubtask = useCallback(
    (action: SubtaskAction) => {
      const updatedSubtasks = handleSubtaskAction(form.subtasks, action);
      setForm(prev => ({ ...prev, subtasks: updatedSubtasks }));
      updateTask({ subtasks: updatedSubtasks });
    },
    [form.subtasks, setForm, updateTask],
  );

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleUpdateTask = async () => {
    try {
      await updateTask({
        dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
        description: form.description,
        subtasks: form.subtasks,
      });

      if (task?.title !== form.title) {
        await methods.updateTask({ title: form.title }, taskId);
      }

      handleGoBack();
      setErrorMessage('');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Ошибка при сохранении: ${error.message}`);
      } else {
        setErrorMessage('Неизвестная ошибка при сохранении');
      }
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && subtaskTitle) {
      event.preventDefault();
      handleAddSubtask();
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
          onClick={handleAddSubtask}
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
      {errorMessage && <div role='alert'>{errorMessage}</div>}
    </section>
  );
};
