import { useNavigate } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { notepadService } from '@entities/Notepad';
import { type Notepad, ROUTES } from '@sharedCommon/';

export const useNotepad = () => {
  const navigate = useNavigate();
  const { data, refetch, isError } = useQuery({
    queryKey: ['notepads'],
    queryFn: notepadService.getNotepads,
    select: data => data.data,
  });

  const mutationCreate = useMutation({
    mutationFn: (title: string) => notepadService.createNotepad(title),
    onSuccess: () => {
      refetch();
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({
      notepadId,
      updatedNotepad,
    }: {
      notepadId: string;
      updatedNotepad: Partial<Notepad>;
    }) => notepadService.updateNotepad(notepadId, updatedNotepad),
    onSuccess: () => {
      refetch();
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (notepadId: string) => notepadService.deleteNotepad(notepadId),
    onSuccess: () => {
      refetch();
      navigate(ROUTES.TODAY_TASKS);
    },
  });

  const updateNotepadTitle = (id: string, newTitle: string) => {
    mutationUpdate.mutate({
      notepadId: id,
      updatedNotepad: { title: newTitle },
    });
  };

  const deleteNotepad = (id: string) => {
    mutationDelete.mutate(id);
  };

  const createNotepad = (title: string) => {
    mutationCreate.mutate(title);
  };

  return {
    notepads: data,
    isError,
    methods: {
      updateNotepadTitle,
      deleteNotepad,
      createNotepad,
    },
  };
};
