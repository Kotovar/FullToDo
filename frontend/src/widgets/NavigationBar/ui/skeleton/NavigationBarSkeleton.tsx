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
        'bg-light flex flex-auto p-2 break-all md:w-3xs md:flex-none md:p-4 md:pr-2 lg:w-80 2xl:max-w-100',
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
