import { useLocation, useParams } from 'react-router';
import { TasksHeader } from './TasksHeader';
import { TasksBody } from './TasksBody';
import { useQuery } from '@tanstack/react-query';
import { notepadService } from '@entities/Notepad';

export const Tasks = () => {
  const { notepadId } = useParams();

  const { data } = useQuery({
    queryKey: ['notepad'],
    queryFn: notepadService.getNotepads,
    select: data => data.data,
  });

  const location = useLocation().pathname;
  const title = data?.find(notepad => notepad._id === notepadId)?.title ?? '';

  return (
    <>
      <TasksHeader title={title} />
      <TasksBody notepadId={notepadId} notepadPathName={location} />
    </>
  );
};
