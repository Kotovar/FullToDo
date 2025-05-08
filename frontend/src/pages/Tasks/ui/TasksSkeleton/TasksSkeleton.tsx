export const TasksSkeleton = () => {
  return (
    <>
      <header className='flex h-62 animate-pulse flex-col items-center gap-2 rounded-lg md:h-56'>
        <p className='h-10 w-36 rounded-lg bg-white text-center md:h-10'></p>
        <div className='h-14 w-full self-end rounded-lg bg-white md:h-8 md:w-1/2'></div>
        <div className='h-14 w-full rounded-lg bg-white'></div>
        <div className='h-16 w-full rounded-lg bg-white'></div>
      </header>

      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className='mb-2 h-21 w-full animate-pulse rounded-lg bg-white'
        />
      ))}
    </>
  );
};
