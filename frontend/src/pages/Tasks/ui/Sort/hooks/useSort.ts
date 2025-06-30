import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SetURLSearchParams } from 'react-router';
import { useNotifications } from '@shared/lib';
import { commonLabels } from '../constants';
import type { TaskSort } from 'shared/schemas';
import type { OrderState, SortByKey, SortState } from '@pages/Tasks/lib';

interface SortLabel {
  key: SortByKey;
  label: string;
  value: SortState;
}

export const useSort = (
  params: URLSearchParams,
  setParams: SetURLSearchParams,
) => {
  const { showInfo } = useNotifications();
  const { t } = useTranslation();

  const getSortLabels = useCallback(
    (params: URLSearchParams): SortLabel => {
      const { sortBy }: TaskSort = Object.fromEntries(params);
      return {
        key: 'sortBy',
        label: sortBy ? t(commonLabels[sortBy]) : t('sort.default'),
        value: sortBy ?? 'createdDate',
      };
    },
    [t],
  );

  const getSortOrder = (params: URLSearchParams): OrderState => {
    const order = params.get('order');
    return order === 'asc' || order === 'desc' ? order : 'desc';
  };

  const toggleOrder = () => {
    setParams(prev => {
      const newParams = new URLSearchParams(prev);
      const currentSort = newParams.get('sortBy');
      if (!currentSort) {
        showInfo(t('sort.error'));
        return newParams;
      }
      const currentOrder = newParams.get('order') ?? 'desc';
      newParams.set('order', currentOrder === 'asc' ? 'desc' : 'asc');

      return newParams;
    });
  };

  const updateSort = (sort: SortState) => {
    setParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sortBy', sort);
      return newParams;
    });
  };

  const sort = useMemo(() => getSortLabels(params), [getSortLabels, params]);
  const order = useMemo(() => getSortOrder(params), [params]);

  return { sort, order, toggleOrder, updateSort };
};
