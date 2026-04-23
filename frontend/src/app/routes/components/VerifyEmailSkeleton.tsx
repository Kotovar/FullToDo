export const VerifyEmailSkeleton = () => {
  return (
    <main className='bg-light text-dark flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center'>
      <section className='bg-light flex w-full max-w-md flex-col gap-4 rounded-xl border border-current/10 p-6 shadow-sm'>
        <div className='mx-auto h-9 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700' />
        <div className='mx-auto h-7 w-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700' />
        <div className='mx-auto h-4 w-full max-w-xs animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
        <div className='mx-auto h-4 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
        <div className='flex flex-col gap-3 pt-2'>
          <div className='h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700' />
          <div className='h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700' />
        </div>
      </section>
    </main>
  );
};
