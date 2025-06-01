import { memo } from 'react';
import { Button, COLORS, Icon, Input } from '@shared/ui';
import { useSearch } from '../useSearch';

export const SearchSection = memo(() => {
  const { value, onChange, onClear } = useSearch();

  return (
    <section aria-label='Поиск' className='flex w-full justify-center'>
      <div className='flex h-10 w-full items-center gap-x-1 rounded-xl bg-white px-2 md:w-[60%]'>
        <Input
          placeholder='Поиск'
          type='text'
          value={value}
          onChange={e => onChange(e.target.value)}
          leftContent={
            <Button appearance='ghost' padding='none' aria-label='Поиск'>
              <Icon name='loupe' fill={COLORS.ACCENT} />
            </Button>
          }
          rightContent={
            value ? (
              <Button
                appearance='ghost'
                padding='none'
                aria-label='Очистить поиск'
                onClick={onClear}
                type='button'
              >
                <Icon name='cross' fill={COLORS.ACCENT} />
              </Button>
            ) : null
          }
          className='w-full outline-0'
        />
      </div>
    </section>
  );
});
