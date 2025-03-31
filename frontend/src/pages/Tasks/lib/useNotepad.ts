import { useLocation, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { notepadService } from '@entities/Notepad';

export const useNotepad = () => {
  const { notepadId } = useParams();
  const { data } = useQuery({
    queryKey: ['notepad'],
    queryFn: notepadService.getNotepads,
    select: data => data.data,
  });

  const location = useLocation().pathname;
  const title = data?.find(notepad => notepad._id === notepadId)?.title ?? '';

  return {
    title,
    notepadId,
    location,
  };
};
