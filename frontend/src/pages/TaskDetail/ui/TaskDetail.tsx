import { useNavigate, useParams } from 'react-router';
import { Button, COLORS, Icon, Input, Textarea } from '@shared/ui';
import { Subtasks } from './Subtasks';
import type { SubtaskAction, TaskDetailProps } from './Subtasks/types';
import { handleSubtaskAction, useTask, useTaskForm } from './Subtasks/utils';

export const TaskDetail = (props: TaskDetailProps) => {
  const { notepadId = '', taskId = '' } = useParams();
  const navigate = useNavigate();

  const { task, isError, updateTask } = useTask(notepadId, taskId);
  const { form, setForm, subtaskTitle, setSubtaskTitle, handleAddSubtask } =
    useTaskForm(task);

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleUpdateTask = () => {
    updateTask({
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
      description: form.description,
      ...(task?.title !== form.title && { title: form.title }),
      subtasks: form.subtasks,
    });

    handleGoBack();
  };

  const handleSubtask = (action: SubtaskAction) => {
    const updatedSubtasks = handleSubtaskAction(form.subtasks, action);

    setForm(prev => ({ ...prev, subtasks: updatedSubtasks }));
    updateTask({ subtasks: updatedSubtasks });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && subtaskTitle) {
      event.preventDefault();
      handleAddSubtask();
    }
  };

  return (
    <div {...props} className='flex flex-col gap-1 p-1'>
      <Button
        className='self-start'
        appearance='primary'
        onClick={handleGoBack}
        padding='s'
      >
        Назад
      </Button>
      <Input
        type='text'
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        className='p-2 outline-0'
      />
      {task && (
        <Subtasks subtasks={form.subtasks} updateSubtask={handleSubtask} />
      )}
      <Input
        placeholder={form.subtasks.length > 0 ? 'Следующий шаг' : 'Первый шаг'}
        type='text'
        containerClassName='flex items-center gap-2 p-1'
        className='w-full outline-0'
        value={subtaskTitle}
        onChange={e => setSubtaskTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        leftContent={
          <Button appearance='ghost' onClick={handleAddSubtask} padding='s'>
            <Icon name='plus' stroke={COLORS.ACCENT} />
          </Button>
        }
      />
      <Input
        placeholder='Укажите дату'
        type='date'
        containerClassName='flex items-center gap-2 p-1 '
        className='w-fit outline-0'
        value={form.dueDate}
        onChange={e => setForm({ ...form, dueDate: e.target.value })}
        leftContent={
          <Button appearance='ghost' padding='s'>
            <Icon name='calendar' stroke={COLORS.ACCENT} />
          </Button>
        }
      />
      <Textarea
        className='outline-bg-second w-full rounded-sm bg-white p-2'
        placeholder='Описание'
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      ></Textarea>
      <Button
        appearance='primary'
        padding='s'
        className='self-center'
        onClick={handleUpdateTask}
      >
        Сохранить
      </Button>
    </div>
  );
};
