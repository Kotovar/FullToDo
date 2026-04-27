import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  authService,
  handleMutationError,
  resetGuestSession,
} from '@shared/api';
import { useNotifications } from '@shared/lib';
import { Button } from '@shared/ui';
import { ROUTES } from '@sharedCommon';
import { createLoginPrefillState } from '@features/auth';

type VerificationStatus = 'loading' | 'success' | 'alreadyVerified' | 'error';

const getVerificationStatus = ({
  dataMessage,
  isError,
  isPending,
  token,
}: {
  dataMessage?: string;
  isError: boolean;
  isPending: boolean;
  token: string | null;
}): VerificationStatus => {
  if (token === null) return 'error';
  if (isPending) return 'loading';
  if (isError) return 'error';
  if (dataMessage === 'Email already verified') return 'alreadyVerified';

  return 'success';
};

export const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showError } = useNotifications();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { data, error, isError, isPending } = useQuery({
    queryKey: ['auth', 'verify-email', token],
    queryFn: () => authService.verifyEmail(token!),
    enabled: token !== null,
    retry: false,
  });

  const status = getVerificationStatus({
    dataMessage: data?.message,
    isError,
    isPending,
    token,
  });
  const errorMessage =
    token === null
      ? t('verifyEmail.missingToken')
      : isError
        ? t(handleMutationError(error).message)
        : null;

  const isSuccess = status === 'success' || status === 'alreadyVerified';

  const handleGoToLogin = async () => {
    try {
      await authService.logout();
    } catch (error) {
      showError(handleMutationError(error).message);
    }

    await resetGuestSession(queryClient);

    navigate(ROUTES.app.login, {
      replace: true,
      state: data?.email ? createLoginPrefillState(data.email) : undefined,
    });
  };

  return (
    <main className='bg-light text-dark flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center'>
      <section className='bg-light flex w-full max-w-md flex-col gap-4 rounded-xl border border-current/10 p-6 shadow-sm'>
        <h1 className='text-3xl font-semibold'>{t('verifyEmail.title')}</h1>

        {status === 'loading' && (
          <p className='text-dark/75 text-sm'>{t('verifyEmail.loading')}</p>
        )}

        {status === 'success' && (
          <>
            <p className='text-xl font-medium text-emerald-700'>
              {t('verifyEmail.successTitle')}
            </p>
            <p className='text-dark/75 text-sm'>
              {t('verifyEmail.successMessage')}
            </p>
          </>
        )}

        {status === 'alreadyVerified' && (
          <>
            <p className='text-xl font-medium text-emerald-700'>
              {t('verifyEmail.alreadyVerifiedTitle')}
            </p>
            <p className='text-dark/75 text-sm'>
              {t('verifyEmail.alreadyVerifiedMessage')}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <p className='text-xl font-medium text-rose-700'>
              {t('verifyEmail.errorTitle')}
            </p>
            <p className='text-dark/75 text-sm'>
              {errorMessage ?? t('verifyEmail.errorMessage')}
            </p>
          </>
        )}

        <div className='flex flex-col gap-3 pt-2'>
          <Button
            className='border-none bg-blue-700 font-medium text-white hover:bg-blue-800 focus:ring-2 focus:ring-blue-300'
            padding='md'
            onClick={() => void handleGoToLogin()}
          >
            {t('verifyEmail.login')}
          </Button>
          {!isSuccess && (
            <Button
              className='bg-light text-dark hover:bg-bg-second border-current/15 font-medium focus:ring-2 focus:ring-slate-300'
              padding='md'
              onClick={() => navigate(ROUTES.app.register)}
            >
              {t('verifyEmail.register')}
            </Button>
          )}
        </div>
      </section>
    </main>
  );
};
