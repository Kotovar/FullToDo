import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, COLORS, Icon, Input } from '@shared/ui';
import { useSearch } from '../useSearch';

export const SearchSection = memo(() => {
  const { value, onChange, onClear } = useSearch();
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('search.common')}
      className='flex w-full justify-center'
    >
      <div className='flex h-10 w-full items-center gap-x-1 rounded-xl bg-white px-2 md:w-[60%]'>
        <Input
          placeholder={t('search.common')}
          type='text'
          value={value}
          onChange={e => onChange(e.target.value)}
          className='w-full outline-0'
          name='search'
          leftContent={
            <Button
              appearance='ghost'
              padding='none'
              aria-label={t('search.common')}
            >
              <Icon name='loupe' fill={COLORS.ACCENT} />
            </Button>
          }
          rightContent={
            value ? (
              <Button
                appearance='ghost'
                padding='none'
                aria-label={t('search.clear')}
                onClick={onClear}
                type='button'
              >
                <Icon name='cross' fill={COLORS.ACCENT} />
              </Button>
            ) : null
          }
        />
      </div>
    </section>
  );
});
