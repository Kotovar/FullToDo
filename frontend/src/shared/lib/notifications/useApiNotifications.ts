import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useNotifications } from '.';
import { useSuccessMessage } from '../hooks';
import type { MutationMethods, QueryError } from '@shared/api';
import type { Entity } from '@shared/lib';

export const useApiNotifications = (entity: Entity) => {
  const { showSuccess, showError } = useNotifications();
  const { t } = useTranslation();
  const getSuccessMessage = useSuccessMessage();

  const onSuccess = useCallback(
    (method: MutationMethods): void =>
      showSuccess(getSuccessMessage(entity, method)),
    [entity, getSuccessMessage, showSuccess],
  );
  const onError = useCallback(
    (error: QueryError): void => showError(t(error.message)),
    [showError, t],
  );

  return { onSuccess, onError };
};
