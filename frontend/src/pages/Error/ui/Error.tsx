import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useBackNavigate } from '@shared/lib';
import { Button } from '@shared/ui';
import { ROUTES } from '@sharedCommon';

export const Error = () => {
  const handleGoBack = useBackNavigate();
  const { t } = useTranslation();

  return (
    <main className='bg-light text-dark flex min-h-dvh items-center justify-center p-6'>
      <section className='flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900'>
        <p className='text-6xl font-semibold tracking-tight text-slate-300 dark:text-slate-700'>
          404
        </p>
        <h1 className='text-3xl font-semibold'>{t('errors.notFound')}</h1>
        <p className='max-w-md text-base text-slate-600 dark:text-slate-300'>
          {t('errors.notFoundDescription')}
        </p>
        <div className='flex w-full flex-col gap-2 pt-2 sm:w-auto sm:flex-row'>
          <Button
            appearance='ghost'
            onClick={handleGoBack}
            padding='md'
            className='w-full justify-center border-slate-400 bg-white text-slate-700 shadow-sm enabled:hover:bg-slate-100 sm:min-w-40 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:enabled:hover:bg-slate-800'
          >
            {t('back')}
          </Button>
          <Link
            to={ROUTES.app.home}
            className='bg-accent focus-visible:ring-dark enabled:hover:bg-accent/80 inline-flex w-full items-center justify-center rounded border-2 border-transparent p-2 text-white focus:outline-none focus-visible:ring-2 sm:min-w-40'
          >
            {t('errors.goHome')}
          </Link>
        </div>
      </section>
    </main>
  );
};
