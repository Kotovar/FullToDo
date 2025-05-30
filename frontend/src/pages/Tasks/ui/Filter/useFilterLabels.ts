import type { FilterLabel } from '@pages/Tasks/lib';
import type { TaskFilter } from 'shared/schemas';
import { commonLabels } from './constants';

type FilterKey = keyof TaskFilter;
type FilterValue<K extends FilterKey> = NonNullable<TaskFilter[K]>;

const isFilterKey = (key: string): key is FilterKey => key in commonLabels;

const getLabelForFilter = <K extends FilterKey>(
  key: K,
  value: FilterValue<K>,
): string | undefined => {
  const labelMap = commonLabels[key] as Record<FilterValue<K>, string>;
  return labelMap[value];
};

const getFilterLabels = (params: URLSearchParams): FilterLabel[] => {
  const filters: TaskFilter = Object.fromEntries(params);
  const labels: FilterLabel[] = [];

  for (const key in filters) {
    if (isFilterKey(key) && filters[key]) {
      const value = filters[key];
      const label = getLabelForFilter(key, value);
      if (label) {
        labels.push({ key, label, value });
      }
    }
  }

  return labels;
};

export const useFilterLabels = (params: URLSearchParams) => {
  const labels = getFilterLabels(params);

  return labels;
};
