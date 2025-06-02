import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS, Icon } from '@shared/ui';

export const AdditionalActions = memo(() => {
  const { t, i18n } = useTranslation();

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
        className='hover:border-accent-light flex w-24 items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
        aria-label={t('change.language')}
        onClick={changeLanguage}
      >
        <Icon name={isRussian ? 'flagRu' : 'flagEn'} />
        <span className='text-white capitalize'>{t('language')}</span>
      </button>
      <button
        type='button'
        className='hover:border-accent-light flex items-center gap-x-2 rounded-xl border-1 border-transparent p-1'
        aria-label={t('change.topic')}
      >
        <Icon name='themeLight' fill={COLORS.WHITE} />
      </button>
    </nav>
  );
});
