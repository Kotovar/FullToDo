import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS, Icon } from '@shared/ui';
import { useDarkMode } from '@shared/lib/hooks';

export const AdditionalActions = memo(() => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggle } = useDarkMode();

  const changeLanguage = async () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    await i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language;
  const isRussian = currentLang === 'ru';

  return (
    <nav className='flex gap-x-2' aria-label={t('additionalActions')}>
      <button
        type='button'
        className='hover:border-light flex w-24 cursor-pointer items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
        aria-label={t('change.language')}
        onClick={changeLanguage}
      >
        <Icon name={isRussian ? 'flagRu' : 'flagEn'} />
        <span className='text-white capitalize'>{t('language')}</span>
      </button>
      <button
        type='button'
        className='hover:border-light flex cursor-pointer items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
        aria-label={t('change.topic')}
        onClick={toggle}
      >
        <Icon
          name={isDarkMode ? 'themeLight' : 'themeDark'}
          fill={COLORS.WHITE}
        />
      </button>
    </nav>
  );
});
