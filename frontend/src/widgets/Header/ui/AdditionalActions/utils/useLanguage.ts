import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback(async () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    await i18n.changeLanguage(newLang);
  }, [i18n]);

  const iconNameLanguage: 'flagRu' | 'flagEn' = useMemo(() => {
    const currentLang = i18n.language;
    const isRussian = currentLang === 'ru';

    return isRussian ? 'flagRu' : 'flagEn';
  }, [i18n.language]);

  return {
    t,
    iconNameLanguage,
    changeLanguage,
  };
};
