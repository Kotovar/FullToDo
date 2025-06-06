import { clsx } from 'clsx';

interface NavigationBarSkeletonProps {
  isHidden: boolean;
}

export const NavigationBarSkeleton = ({
  isHidden,
}: NavigationBarSkeletonProps) => {
  return (
    <nav
      className={clsx(
        'bg-light flex flex-auto p-4 break-all md:w-[30%] md:flex-none',
        {
          ['hidden']: isHidden,
        },
      )}
    >
      <ul className='w-full space-y-2'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className='h-14 w-full animate-pulse rounded-lg bg-gray-200'
          />
        ))}
        <div className='flex gap-2'>
          <div className='h-12 w-full animate-pulse rounded-lg bg-gray-200' />
        </div>
      </ul>
    </nav>
  );
};
