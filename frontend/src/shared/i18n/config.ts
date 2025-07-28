import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './data/en.json' with { type: 'json' };
import ruTranslation from './data/ru.json' with { type: 'json' };

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    defaultNS: 'translation',
    supportedLngs: ['ru', 'en'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    resources: {
      ru: { translation: ruTranslation },
      en: { translation: enTranslation },
    },
  });

export default i18n;
