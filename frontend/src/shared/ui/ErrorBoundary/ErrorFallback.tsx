import { useTranslation } from 'react-i18next';
import { Button } from '@shared/ui';

type ErrorFallbackProps = {
  reset?: () => void;
};

export const ErrorFallback = ({ reset }: ErrorFallbackProps) => {
  const { t } = useTranslation();

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <main className='bg-light text-dark flex min-h-dvh items-center justify-center p-6'>
      <section className='flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900'>
        <p className='text-sm font-medium tracking-[0.24em] text-rose-500 uppercase dark:text-rose-300'>
          Runtime Error
        </p>
        <h1 className='text-3xl font-semibold'>{t('errors.errorBoundary')}</h1>
        <p className='max-w-md text-base text-slate-600 dark:text-slate-300'>
          {t('errors.errorBoundaryDescription')}
        </p>
        <div className='flex w-full flex-col gap-2 pt-2 sm:w-auto sm:flex-row'>
          {reset ? (
            <Button
              onClick={reset}
              appearance='ghost'
              padding='md'
              className='w-full justify-center border-slate-300 bg-white text-slate-700 enabled:hover:bg-slate-100 sm:min-w-40 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:enabled:hover:bg-slate-800'
            >
              {t('errors.tryAgain')}
            </Button>
          ) : null}
          <Button
            onClick={handleReload}
            appearance='primary'
            padding='md'
            className='w-full justify-center sm:min-w-40'
          >
            {t('errors.reload')}
          </Button>
        </div>
      </section>
    </main>
  );
};
