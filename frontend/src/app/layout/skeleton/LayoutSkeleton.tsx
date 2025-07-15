import { NavigationBarSkeleton } from '@widgets/NavigationBar';

export const LayoutSkeleton = () => (
  <div className='bg-light h-dvh'>
    <NavigationBarSkeleton isHidden={false} />
  </div>
);
