export const TasksSkeleton = () => {
  return (
    <>
      <header className='flex h-62 animate-pulse flex-col items-center gap-2 rounded-lg md:h-56'>
        <p className='bg-light h-10 w-36 rounded-lg text-center md:h-10'></p>
        <div className='bg-light h-14 w-full self-end rounded-lg md:h-8 md:w-1/2'></div>
        <div className='bg-light h-14 w-full rounded-lg'></div>
        <div className='bg-light h-16 w-full rounded-lg'></div>
      </header>

      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className='bg-light mb-2 h-21 w-full animate-pulse rounded-lg'
        />
      ))}
    </>
  );
};
