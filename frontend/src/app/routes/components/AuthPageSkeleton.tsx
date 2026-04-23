export const AuthPageSkeleton = () => {
  return (
    <>
      <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
            <div className='h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700' />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700' />
            <div className='h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700' />
          </div>
          <div className='h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700' />
        </div>
      </div>
      <div className='h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700' />
      <div aria-hidden='true' className='min-h-24 w-full max-w-md' />
    </>
  );
};
