const mainLineKeys = ['title', 'meta', 'content'];
const secondaryLineKeys = ['details', 'actions'];

export const TaskDetailSkeleton = () => (
  <div className='flex flex-col gap-1 p-1'>
    <div className='bg-accent/50 h-12 w-21 animate-pulse self-start rounded'></div>
    <p className='bg-light h-12 w-1/2 animate-pulse rounded'></p>
    {mainLineKeys.map(key => (
      <div key={key} className='bg-light h-12 w-full animate-pulse rounded' />
    ))}
    {secondaryLineKeys.map(key => (
      <div key={key} className='bg-light h-14 w-1/3 animate-pulse rounded' />
    ))}
    <div className='bg-light mb-4 h-20 w-full animate-pulse rounded'></div>
    <div className='bg-accent/50 h-12 w-26 animate-pulse self-center rounded'></div>
  </div>
);
