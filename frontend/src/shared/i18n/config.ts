import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './data/en.json';
import ruTranslation from './data/ru.json';

i18n.use(initReactI18next).init({
  defaultNS: 'translation',
  lng: 'ru',
  resources: {
    ru: { translation: ruTranslation },
    en: { translation: enTranslation },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
