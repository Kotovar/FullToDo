import { useTranslation } from 'react-i18next';
import type { FilterLabel } from '@pages/Tasks/lib';
import type { PriorityEnum, TaskFilter } from 'shared/schemas';

export type FilterValue<K extends FilterKey> = NonNullable<TaskFilter[K]>;
type FilterKey = keyof TaskFilter;
type BooleanKey = 'true' | 'false';
type FilterTranslationKeys =
  | `filters.labels.isCompleted.${BooleanKey}`
  | `filters.labels.hasDueDate.${BooleanKey}`
  | `filters.labels.priority.${PriorityEnum}`;
type CorrectValue = BooleanKey | PriorityEnum;

const isFilterKey = (key: unknown): key is FilterKey => {
  return (
    typeof key === 'string' &&
    ['isCompleted', 'hasDueDate', 'priority'].includes(key)
  );
};

const isPriorityValue = (key: string): key is PriorityEnum => {
  return ['low', 'medium', 'high'].includes(key);
};

const isBooleanValue = (value: string): value is BooleanKey =>
  value === 'true' || value === 'false';

const isCorrectValue = (value: string | undefined): value is CorrectValue => {
  return (
    value !== undefined && (isPriorityValue(value) || isBooleanValue(value))
  );
};

export const getTranslationKey = <K extends FilterKey>(
  key: K,
  value: FilterValue<K>,
): FilterTranslationKeys => {
  switch (key) {
    case 'isCompleted':
      if (isBooleanValue(value)) {
        return `filters.labels.isCompleted.${value}`;
      }
      break;
    case 'hasDueDate':
      if (isBooleanValue(value)) {
        return `filters.labels.hasDueDate.${value}`;
      }
      break;
    case 'priority':
      if (isPriorityValue(value)) {
        return `filters.labels.priority.${value}`;
      }
      break;
  }
  throw new Error(`Invalid filter combination: ${key}.${value}`);
};

export const useFilterLabels = (params: URLSearchParams): FilterLabel[] => {
  const { t } = useTranslation();
  const filters: TaskFilter = Object.fromEntries(params);
  const labels: FilterLabel[] = [];

  for (const key in filters) {
    if (isFilterKey(key) && isCorrectValue(filters[key])) {
      const value = filters[key];

      const translationKey = getTranslationKey(key, value);
      const label = t(translationKey);

      if (label && label !== translationKey) {
        labels.push({ key, label, value });
      }
    }
  }

  return labels;
};
