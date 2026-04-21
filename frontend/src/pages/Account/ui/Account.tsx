import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LogoutButton } from '@features/auth';
import { authKeys, fetchCurrentUser } from '@shared/api';
import { ROUTES } from '@sharedCommon';

export const Account = () => {
  const { t } = useTranslation();
  const { data: user } = useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    enabled: false,
  });

  if (!user) {
    return null;
  }

  return (
    <main className='flex min-h-full w-full flex-col gap-6 pb-8 md:pb-10'>
      <header className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-semibold'>{t('account.title')}</h1>
          <p className='text-base text-slate-700 dark:text-slate-200'>
            {t('account.description')}
          </p>
        </div>
        <Link
          to={ROUTES.tasks.base}
          className='focus-visible:ring-dark inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
        >
          {t('account.backToTasks')}
        </Link>
      </header>

      <section className='bg-light text-dark flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 shadow-sm dark:border-slate-700'>
        <h2 className='text-2xl font-semibold'>{t('account.profile.title')}</h2>
        <dl className='grid gap-3 text-base sm:grid-cols-[12rem_1fr]'>
          <dt className='font-medium text-slate-600 dark:text-slate-300'>
            {t('account.profile.email')}
          </dt>
          <dd>{user.email}</dd>

          <dt className='font-medium text-slate-600 dark:text-slate-300'>
            {t('account.profile.provider')}
          </dt>
          <dd>
            {user.hasPassword
              ? t('account.profile.passwordUser')
              : t('account.profile.googleUser')}
          </dd>
        </dl>
      </section>

      <section className='bg-light text-dark flex flex-col gap-3 rounded-2xl border border-slate-200 p-5 shadow-sm dark:border-slate-700'>
        <h2 className='text-2xl font-semibold'>
          {t('account.security.title')}
        </h2>
        <p className='text-base text-slate-700 dark:text-slate-200'>
          {user.hasPassword
            ? t('account.security.passwordEnabled')
            : t('account.security.passwordDisabled')}
        </p>
        <div className='pt-2'>
          <LogoutButton
            className='border-slate-400 bg-slate-100 text-slate-800 shadow-sm enabled:hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:enabled:hover:bg-slate-800'
            appearance='ghost'
            padding='md'
          />
        </div>
      </section>

      <section className='bg-light flex flex-col gap-3 rounded-2xl border border-rose-200 p-5 shadow-sm dark:border-rose-800'>
        <h2 className='text-2xl font-semibold text-rose-700 dark:text-rose-300'>
          {t('account.dangerZone.title')}
        </h2>
        <p className='text-base text-slate-700 dark:text-slate-200'>
          {t('account.dangerZone.description')}
        </p>
      </section>
    </main>
  );
};
