import type { TaskFilter, TaskSort } from 'shared/schemas';

export interface TaskOptions {
  title: string;
  date?: string;
}

export interface FilterLabel {
  key: keyof TaskFilter;
  label: string;
  value: NonNullable<TaskFilter[keyof TaskFilter]>;
}

export type FiltersState = Record<keyof TaskFilter, string>;

export type SortByKey = keyof Pick<TaskSort, 'sortBy'>;
export type SortState = NonNullable<TaskSort[SortByKey]>;
export type OrderState = NonNullable<TaskSort['order']>;
