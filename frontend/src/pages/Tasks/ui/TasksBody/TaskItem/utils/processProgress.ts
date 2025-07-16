import { t } from 'i18next';

export const processProgress = (progress?: string) =>
  progress ? progress.replace('/', ` ${t('of')} `) : t('tasks.empty');
