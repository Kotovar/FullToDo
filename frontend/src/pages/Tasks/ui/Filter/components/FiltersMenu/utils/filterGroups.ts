import type { TFunction } from 'i18next';

export const getFilterGroups = (t: TFunction<'ruTranslation'>) =>
  [
    {
      name: 'isCompleted',
      title: t('filters.groups.isCompleted.title'),
      options: [
        { value: '', label: t('filters.groups.isCompleted.options.all') },
        {
          value: 'true',
          label: t('filters.groups.isCompleted.options.completed'),
        },
        {
          value: 'false',
          label: t('filters.groups.isCompleted.options.active'),
        },
      ],
    },
    {
      name: 'hasDueDate',
      title: t('filters.groups.hasDueDate.title'),
      options: [
        { value: '', label: t('filters.groups.hasDueDate.options.all') },
        {
          value: 'true',
          label: t('filters.groups.hasDueDate.options.withDate'),
        },
        {
          value: 'false',
          label: t('filters.groups.hasDueDate.options.withoutDate'),
        },
      ],
    },
  ] as const;
