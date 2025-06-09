import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const testI18n = i18n.createInstance();

testI18n.use(initReactI18next).init({
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        'filters.labels.isCompleted.true': 'Выполненные',
      },
    },
  },
});

export default testI18n;
