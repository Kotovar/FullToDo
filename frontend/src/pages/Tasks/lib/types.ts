import { TaskFilter } from 'shared/schemas';

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
