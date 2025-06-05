import type { TFunction } from 'i18next';

export const getFilterGroups = (t: TFunction<'ruTranslation', undefined>) =>
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
    {
      name: 'priority',
      title: t('filters.groups.priority.title'),
      options: [
        { value: '', label: t('filters.groups.priority.options.all') },
        { value: 'low', label: t('filters.groups.priority.options.low') },
        { value: 'medium', label: t('filters.groups.priority.options.medium') },
        { value: 'high', label: t('filters.groups.priority.options.high') },
      ],
    },
  ] as const;
