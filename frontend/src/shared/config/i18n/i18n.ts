import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enNs from './en.json';
import ruNs from './ru.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'ru',
  defaultNS: 'translation',
  resources: {
    en: { translation: enNs },
    ru: { translation: ruNs },
  },
  lng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
