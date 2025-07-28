import { ReactNode, Suspense } from 'react';

export const WithSuspense = ({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => <Suspense fallback={fallback}>{children}</Suspense>;
