import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input } from '@shared/ui';
import { useSearch } from '@widgets/Header/lib';
import { useDarkMode } from '@shared/lib/hooks';

export const SearchSection = memo(() => {
  const { value, onChange, onClear } = useSearch();
  const { t } = useTranslation();
  const { fill } = useDarkMode();

  const shouldShowButton = useMemo(() => {
    return value.length > 0;
  }, [value]);

  const rightContent = useMemo(() => {
    if (shouldShowButton)
      return (
        <Button
          appearance='ghost'
          aria-label={t('search.clear')}
          onClick={onClear}
          type='button'
          className='hover:bg-grey p-1'
        >
          <Icon name='cross' fill={fill} />
        </Button>
      );

    return null;
  }, [fill, onClear, shouldShowButton, t]);

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
          rightContent={rightContent}
        />
      </div>
    </section>
  );
});
