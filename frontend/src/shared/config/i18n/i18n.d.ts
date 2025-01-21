import 'i18next';
import enNs from './en.json';
import ruNs from './ru.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      en: typeof enNs;
      ru: typeof ruNs;
    };
  }
}
