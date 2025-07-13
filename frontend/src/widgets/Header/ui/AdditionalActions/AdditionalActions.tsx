import { memo, useMemo } from 'react';
import { Button, COLORS, Icon } from '@shared/ui';
import { useDarkMode } from '@shared/lib/hooks';
import { useLanguage } from '.';

export const AdditionalActions = memo(() => {
  const { isDarkMode, toggle } = useDarkMode();
  const { t, iconNameLanguage, changeLanguage } = useLanguage();

  const iconNameTheme = useMemo(() => {
    return isDarkMode ? 'themeLight' : 'themeDark';
  }, [isDarkMode]);

  return (
    <nav className='flex gap-x-2' aria-label={t('additionalActions')}>
      <Button
        onClick={changeLanguage}
        aria-label={t('change.language')}
        className='hover:border-light flex w-24 gap-x-2 rounded-xl border-1 border-transparent'
        appearance='ghost'
        padding='sm'
      >
        <Icon name={iconNameLanguage} />
        <span className='text-white capitalize'>{t('language')}</span>
      </Button>
      <Button
        onClick={toggle}
        aria-label={t('change.topic')}
        className='hover:border-light flex gap-x-2 rounded-xl border-1 border-transparent'
        appearance='ghost'
        padding='sm'
      >
        <Icon name={iconNameTheme} fill={COLORS.WHITE} />
      </Button>
    </nav>
  );
});
