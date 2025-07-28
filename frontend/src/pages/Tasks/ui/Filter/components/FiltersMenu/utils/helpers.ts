import type { FilterLabel, FiltersState } from '@pages/Tasks/lib';

export const getEmptyFilters = () => ({
  isCompleted: '',
  hasDueDate: '',
  priority: '',
});

export const getInitialFilters = (labels: FilterLabel[]) => {
  const initialFilters: FiltersState = getEmptyFilters();

  labels.forEach(label => {
    initialFilters[label.key] = label.value;
  });

  return initialFilters;
};
