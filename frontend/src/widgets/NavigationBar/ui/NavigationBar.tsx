import { useState, type ComponentPropsWithoutRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { clsx } from 'clsx';
import { LinkCard, Input, COLORS, Icon, Button } from '@shared/ui';
import { Notepad, ROUTES } from '@sharedCommon/';
import { useMutation, useQuery } from '@tanstack/react-query';
import { notepadService } from '@entities/Notepad';

interface Props extends ComponentPropsWithoutRef<'nav'> {
  turnOffVisibility?: () => void;
}

export const NavigationBar = (props: Props) => {
  const { turnOffVisibility, ...rest } = props;
  const [currentModalId, setCurrentModalId] = useState('');
  const [title, setTitle] = useState('');
  const [closeDialog, setCloseDialog] = useState(false);
  const [editingNotepadId, setEditingNotepadId] = useState<string | null>(null);

  const { data, isError, refetch } = useQuery({
    queryKey: ['notepads'],
    queryFn: notepadService.getNotepads,
    select: data => data.data,
  });

  const mutationCreate = useMutation({
    mutationFn: (title: string) => notepadService.createNotepad(title),
    onSuccess: () => {
      refetch();
      setTitle('');
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
      navigate('/notepad/today');
    },
  });

  const location = useLocation().pathname;
  const basePath = location.split(ROUTES.TASK)[0];
  const navigate = useNavigate();

  const handleModalId = (id: string) => {
    setCurrentModalId(id);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setTitle(event.target.value);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && title) {
      createNotepad(title);
    }
  };

  const createNotepad = (title: string) => {
    mutationCreate.mutate(title);
  };

  const deleteNotepad = (id: string) => {
    mutationDelete.mutate(id);
  };

  const updateNotepad = (
    notepadId: string,
    updatedNotepad: Partial<Notepad>,
  ) => {
    mutationUpdate.mutate({ notepadId, updatedNotepad });
  };

  const renameNotepad = (id: string) => {
    setEditingNotepadId(id);
    setCloseDialog(true);
  };

  const handleSaveTitle = (id: string, newTitle: string) => {
    updateNotepad(id, { title: newTitle });
    setEditingNotepadId(null);
  };

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <nav {...rest}>
      <ul className='w-full'>
        {data &&
          data.map(({ title, _id }) => {
            const path = ROUTES.getNotepadPath(_id);

            return (
              <LinkCard
                currentModalId={currentModalId}
                handleModalId={handleModalId}
                className={clsx(
                  'text-dark hover:bg-accent-light grid min-h-16 grid-cols-[1fr_2rem] items-center justify-items-center rounded-lg p-2 break-words',
                  {
                    ['bg-grey-light']: path === basePath,
                  },
                )}
                handleLinkClick={turnOffVisibility}
                key={_id}
                path={path}
                cardTitle={title}
                handleClickDelete={() => deleteNotepad(_id)}
                handleClickRename={() => renameNotepad(_id)}
                onSaveTitle={newTitle => handleSaveTitle(_id, newTitle)}
                closeDialog={closeDialog}
                isEditing={editingNotepadId === _id}
              />
            );
          })}
        <Input
          containerClassName='grid grid-cols-[2rem_1fr] overflow-hidden gap-2'
          className='min-w-0 outline-0'
          placeholder='Добавить список'
          type='text'
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          leftContent={
            <Button
              appearance='ghost'
              onClick={() => createNotepad(title)}
              padding='none'
            >
              <Icon name='plus' stroke={COLORS.ACCENT} />
            </Button>
          }
        />
      </ul>
    </nav>
  );
};
