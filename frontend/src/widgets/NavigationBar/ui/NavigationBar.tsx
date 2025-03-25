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

  const basePath = useLocation().pathname;
  const navigate = useNavigate();

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && title) {
      mutationCreate.mutate(title);
    }
  };

  const handleSaveTitle = (
    id: string,
    newTitle: string,
    currentTitle: string,
  ) => {
    if (newTitle !== currentTitle) {
      mutationUpdate.mutate({
        notepadId: id,
        updatedNotepad: { title: newTitle },
      });
    }

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
                handleModalId={id => setCurrentModalId(id)}
                className={clsx(
                  'text-dark hover:bg-accent-light grid min-h-16 grid-cols-[1fr_2rem] content-center items-center justify-items-center rounded-lg p-2 break-words',
                  {
                    ['bg-grey-light']: path === basePath,
                  },
                )}
                handleLinkClick={turnOffVisibility}
                key={_id}
                path={path}
                cardTitle={title}
                handleClickDelete={() => mutationDelete.mutate(_id)}
                handleClickRename={() => setEditingNotepadId(_id)}
                onSaveTitle={newTitle => handleSaveTitle(_id, newTitle, title)}
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
          onChange={event => setTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          leftContent={
            <Button
              appearance='ghost'
              onClick={() => mutationCreate.mutate(title)}
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
