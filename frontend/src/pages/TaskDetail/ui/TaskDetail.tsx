import { useEffect, useState, type ComponentPropsWithoutRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { Button, COLORS, Icon, Input, Textarea } from '@shared/ui';
import { Subtasks } from './Subtasks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { taskService } from '@features/Tasks';
import { Subtask, Task } from 'shared/schemas';

type TaskDetailProps = ComponentPropsWithoutRef<'div'>;

const getFormattedDate = (date: Date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const TaskDetail = (props: TaskDetailProps) => {
  const { ...rest } = props;
  const { notepadId = '', taskId = '' } = useParams();
  const navigate = useNavigate();
  const { data, isError, refetch } = useQuery({
    queryKey: ['task', notepadId, taskId],
    queryFn: () => taskService.getSingleTask(notepadId, taskId),
    select: data => data.data,
  });

  const mutation = useMutation({
    mutationFn: (updatedTask: Partial<Task>) =>
      taskService.updateTask(notepadId, taskId, updatedTask),
    onSuccess: () => refetch(),
  });

  interface ValueType {
    title: string;
    dueDate: string;
    description: string;
    subtasks: Subtask[];
  }

  const [value, setValue] = useState<ValueType>({
    title: '',
    dueDate: '',
    description: '',
    subtasks: [],
  });

  const [subtaskTitle, setSubtaskTitle] = useState('');

  useEffect(() => {
    if (data) {
      setValue({
        title: data.title,
        dueDate: data.dueDate ? getFormattedDate(data.dueDate) : '',
        description: data.description ?? '',
        subtasks: data.subtasks ?? [],
      });
    }
  }, [data]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isError) {
    return <div>Error fetching data</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleValueDate: React.ChangeEventHandler<HTMLInputElement> = e => {
    setValue({ ...value, dueDate: e.target.value });
  };

  const handleDescription: React.ChangeEventHandler<
    HTMLTextAreaElement
  > = e => {
    setValue({ ...value, description: e.target.value });
  };

  const updateTask = (updatedTask: Partial<Task>) => {
    mutation.mutate(updatedTask);
  };

  const handleClickUpdate = () => {
    updateTask({
      dueDate: value?.dueDate ? new Date(value?.dueDate) : undefined,
      description: value.description,
      ...(data?.title !== value.title && { title: value.title }),
    });
    handleGoBack();
  };

  const handleClickAddSubtask = () => {
    if (subtaskTitle) {
      const updatedTask = {
        ...value,
        subtasks: [
          ...value.subtasks,
          { isCompleted: false, title: subtaskTitle, _id: uuidv4() },
        ],
      };

      setValue(updatedTask);
      updateTask({ subtasks: updatedTask.subtasks });
      setSubtaskTitle('');
    }
  };

  const handleClickUpdateSubtask = (
    id: string,
    title: string,
    isCompleted: boolean,
  ) => {
    const currentSubtaskIndex = value.subtasks.findIndex(
      subtask => subtask._id === id,
    );

    if (currentSubtaskIndex !== -1) {
      const updatedSubtasks = value.subtasks.toSpliced(currentSubtaskIndex, 1, {
        isCompleted: isCompleted,
        title: title,
        _id: id,
      });

      const updatedTask = {
        ...value,
        subtasks: updatedSubtasks,
      };

      setValue(updatedTask);
      updateTask({ subtasks: updatedTask.subtasks });
    }
  };

  const handleClickDeleteSubtask = (id: string) => {
    const currentSubtaskIndex = value.subtasks.findIndex(
      subtask => subtask._id === id,
    );

    if (currentSubtaskIndex !== -1) {
      const updatedSubtasks = value.subtasks.toSpliced(currentSubtaskIndex, 1);

      const updatedTask = {
        ...value,
        subtasks: updatedSubtasks,
      };

      setValue(updatedTask);
      updateTask({ subtasks: updatedTask.subtasks });
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && subtaskTitle) {
      handleClickAddSubtask();
    }
  };

  const handleSubtaskTitle: React.ChangeEventHandler<HTMLInputElement> = e => {
    setSubtaskTitle(e.target.value);
  };

  const handleTaskTitle: React.ChangeEventHandler<HTMLInputElement> = e => {
    setValue({ ...value, title: e.target.value });
  };

  return (
    <div {...rest} className='flex flex-col gap-1 p-1'>
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
        value={value.title}
        onChange={handleTaskTitle}
        className='p-2 outline-0'
      />
      {data && (
        <Subtasks
          subtasks={data.subtasks ?? []}
          updateSubtask={handleClickUpdateSubtask}
          deleteSubtask={handleClickDeleteSubtask}
        />
      )}
      <Input
        placeholder={value.subtasks.length ? 'Следующий шаг' : 'Первый шаг'}
        type='text'
        containerClassName='flex items-center gap-2 p-1'
        className='w-full outline-0'
        value={subtaskTitle}
        onChange={handleSubtaskTitle}
        onKeyDown={handleKeyDown}
        leftContent={
          <Button
            appearance='ghost'
            onClick={handleClickAddSubtask}
            padding='s'
          >
            <Icon name='plus' stroke={COLORS.ACCENT} />
          </Button>
        }
      />
      <Input
        placeholder='Укажите дату'
        type='date'
        containerClassName='flex items-center gap-2 p-1 '
        className='w-fit outline-0'
        value={value.dueDate}
        onChange={handleValueDate}
        leftContent={
          <Button appearance='ghost' padding='s'>
            <Icon name='calendar' stroke={COLORS.ACCENT} />
          </Button>
        }
      />
      <Textarea
        className='outline-bg-second w-full rounded-sm bg-white p-2'
        placeholder='Описание'
        value={value.description}
        onChange={handleDescription}
      ></Textarea>
      <Button
        appearance='primary'
        padding='s'
        className='self-center'
        onClick={handleClickUpdate}
      >
        Сохранить
      </Button>
    </div>
  );
};
