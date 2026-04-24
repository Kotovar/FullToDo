import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Input } from '@shared/ui';
import { useSearch } from '@widgets/Header/lib';
import { useDarkMode } from '@shared/lib/hooks';

export const SearchSection = memo(() => {
  const { value, isSearching, onChange, onClear } = useSearch();
  const { t } = useTranslation();
  const { fill } = useDarkMode();

  const shouldShowButton = value.length > 0;
  const rightContent =
    shouldShowButton || isSearching ? (
      <div className='flex items-center gap-1'>
        {isSearching ? (
          <>
            <span className='text-grey hidden animate-pulse text-xs whitespace-nowrap md:inline'>
              {t('search.pending')}
            </span>
            <span
              aria-hidden='true'
              className='flex items-center gap-0.5 md:hidden'
            >
              <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:0ms]' />
              <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:120ms]' />
              <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:240ms]' />
            </span>
          </>
        ) : null}
        {shouldShowButton ? (
          <Button
            appearance='ghost'
            aria-label={t('search.clear')}
            onClick={onClear}
            type='button'
            className='hover:bg-grey'
            padding='sm'
          >
            <Icon name='cross' fill={fill} />
          </Button>
        ) : null}
      </div>
    ) : null;

  return (
    <section
      aria-label={t('search.common')}
      className='flex w-full items-center justify-center'
    >
      <div className='bg-light flex h-10 w-full items-center gap-x-2 rounded-xl px-2 md:w-[60%]'>
        <Input
          placeholder={t('search.common')}
          type='text'
          value={value}
          onChange={e => onChange(e.target.value)}
          className='text-dark placeholder:text-grey w-full min-w-0 outline-0'
          name='search'
          leftContent={<Icon name='loupe' fill={fill} />}
          inputMode='search'
          rightContent={rightContent}
        />
      </div>
    </section>
  );
});
