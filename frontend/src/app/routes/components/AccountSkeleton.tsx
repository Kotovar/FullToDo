export const AccountSkeleton = () => {
  return (
    <main className='flex w-full flex-col gap-6 pb-8 md:pb-10'>
      <header className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <div className='h-9 w-44 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700' />
          <div className='h-5 w-72 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
        </div>
        <div className='h-11 w-full animate-pulse rounded-xl bg-slate-200 sm:w-44 dark:bg-slate-700' />
      </header>

      <section className='bg-light flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 shadow-sm dark:border-slate-700'>
        <div className='h-8 w-36 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700' />
        <div className='grid gap-3 sm:grid-cols-[12rem_1fr]'>
          <div className='h-5 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
          <div className='h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
          <div className='h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
          <div className='h-5 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
        </div>
      </section>

      <section className='bg-light flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 shadow-sm dark:border-slate-700'>
        <div className='h-8 w-40 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700' />
        <div className='h-5 w-80 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
        <div className='h-11 w-full animate-pulse rounded-xl bg-slate-200 sm:w-44 dark:bg-slate-700' />
        <div className='border-t border-slate-200 pt-4 dark:border-slate-700'>
          <div className='h-11 w-full animate-pulse rounded-xl bg-slate-200 sm:w-44 dark:bg-slate-700' />
        </div>
      </section>

      <section className='bg-light flex flex-col gap-4 rounded-2xl border border-rose-200 p-5 shadow-sm dark:border-rose-800'>
        <div className='h-8 w-40 animate-pulse rounded-xl bg-rose-100 dark:bg-rose-900/40' />
        <div className='h-5 w-96 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
        <div className='h-4 w-80 max-w-full animate-pulse rounded bg-rose-100 dark:bg-rose-900/40' />
        <div className='h-11 w-full animate-pulse rounded-xl bg-rose-100 sm:w-44 dark:bg-rose-900/40' />
      </section>
    </main>
  );
};
