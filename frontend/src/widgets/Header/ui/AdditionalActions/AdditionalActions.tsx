import { memo, useMemo } from 'react';
import { COLORS, Icon } from '@shared/ui';
import { useDarkMode } from '@shared/lib/hooks';
import { useLanguage } from './utils';

export const AdditionalActions = memo(() => {
  const { isDarkMode, toggle } = useDarkMode();
  const { t, iconNameLanguage, changeLanguage } = useLanguage();

  const iconNameTheme = useMemo(() => {
    return isDarkMode ? 'themeLight' : 'themeDark';
  }, [isDarkMode]);

  return (
    <nav className='flex gap-x-2' aria-label={t('additionalActions')}>
      <button
        type='button'
        className='hover:border-light flex w-24 cursor-pointer items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
        aria-label={t('change.language')}
        onClick={changeLanguage}
      >
        <Icon name={iconNameLanguage} />
        <span className='text-white capitalize'>{t('language')}</span>
      </button>
      <button
        type='button'
        className='hover:border-light flex cursor-pointer items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
        aria-label={t('change.topic')}
        onClick={toggle}
      >
        <Icon name={iconNameTheme} fill={COLORS.WHITE} />
      </button>
    </nav>
  );
});
