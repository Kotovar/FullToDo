import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input } from '@shared/ui';
import { useSearch } from '@widgets/Header/lib';
import { useDarkMode } from '@shared/lib/hooks';

export const SearchSection = memo(() => {
  const { value, onChange, onClear } = useSearch();
  const { t } = useTranslation();
  const { fill } = useDarkMode();

  return (
    <section
      aria-label={t('search.common')}
      className='flex w-full justify-center'
    >
      <div className='bg-light flex h-10 w-full items-center gap-x-2 rounded-xl px-2 md:w-[60%]'>
        <Input
          placeholder={t('search.common')}
          type='text'
          value={value}
          onChange={e => onChange(e.target.value)}
          className='text-dark placeholder:text-grey w-full outline-0'
          name='search'
          leftContent={<Icon name='loupe' fill={fill} />}
          inputMode='search'
          rightContent={
            value ? (
              <Button
                appearance='ghost'
                padding='none'
                aria-label={t('search.clear')}
                onClick={onClear}
                type='button'
                className='hover:bg-grey p-1'
              >
                <Icon name='cross' fill={fill} />
              </Button>
            ) : null
          }
        />
      </div>
    </section>
  );
});
