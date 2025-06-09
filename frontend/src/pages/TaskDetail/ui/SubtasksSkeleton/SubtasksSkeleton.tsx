export const SubtasksSkeleton = () => (
  <div className='flex flex-col gap-1 p-1'>
    <div className='bg-accent/50 h-12 w-21 animate-pulse self-start rounded'></div>
    <p className='bg-light h-12 w-1/2 animate-pulse rounded'></p>
    {[...Array(3)].map((_, i) => (
      <div key={i} className='bg-light h-12 w-full animate-pulse rounded' />
    ))}
    {[...Array(2)].map((_, i) => (
      <div key={i} className='bg-light h-14 w-1/3 animate-pulse rounded' />
    ))}
    <div className='bg-light mb-4 h-20 w-full animate-pulse rounded'></div>
    <div className='bg-accent/50 h-12 w-26 animate-pulse self-center rounded'></div>
  </div>
);
