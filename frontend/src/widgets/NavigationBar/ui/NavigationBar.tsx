import { useState, type ComponentPropsWithoutRef } from 'react';
import { useLocation } from 'react-router';
import { clsx } from 'clsx';
import { LinkCard, Input, COLORS, Icon, Button } from '@shared/ui';
import { ROUTES } from '@sharedCommon/';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notepadService } from '@entities/Notepad';

interface Props extends ComponentPropsWithoutRef<'nav'> {
  turnOffVisibility?: () => void;
}

export const NavigationBar = (props: Props) => {
  const { turnOffVisibility, ...rest } = props;
  const [currentModalId, setCurrentModalId] = useState('');
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();
  const { data, isError } = useQuery({
    queryKey: ['notepads'],
    queryFn: notepadService.getNotepads,
    select: data => data.data,
  });
  const mutation = useMutation({
    mutationFn: (title: string) => notepadService.createNotepad(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notepads'] });
      setTitle('');
    },
  });

  const location = useLocation().pathname;
  const basePath = location.split(ROUTES.TASK)[0];

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
    mutation.mutate(title);
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
                  'text-dark hover:bg-accent-light grid min-h-16 grid-cols-[1fr_2rem] items-center justify-items-start rounded-lg p-2 break-words',
                  {
                    ['bg-grey-light']: path === basePath,
                  },
                )}
                handleLinkClick={turnOffVisibility}
                key={_id}
                path={path}
                cardTitle={<span className='text-3xl'>{title}</span>}
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
            <Button appearance='ghost' onClick={() => createNotepad(title)}>
              <Icon name='plus' stroke={COLORS.ACCENT} />
            </Button>
          }
        />
      </ul>
    </nav>
  );
};
