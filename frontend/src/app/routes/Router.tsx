import { BrowserRouter, Route, Routes } from 'react-router';
import { lazy, ReactNode, Suspense } from 'react';
import { Tasks } from '@pages/Tasks';
import { Error } from '@pages/Error';
import { Home } from '@pages/Home';
import { TaskDetailSkeleton } from '@pages/TaskDetail';
import { ROUTES } from '@sharedCommon/';
import { NavigationBarSkeleton } from '@widgets/NavigationBar';

const TaskDetail = lazy(() => import('@pages/TaskDetail'));
const Layout = lazy(() => import('@app/layout'));

const LayoutSkeleton = () => (
  <div className='bg-light h-dvh'>
    <NavigationBarSkeleton isHidden={false} />
  </div>
);

const WithSuspense = ({
  children,
  fallback = <TaskDetailSkeleton />,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => <Suspense fallback={fallback}>{children}</Suspense>;

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />

        <Route
          element={
            <WithSuspense fallback={<LayoutSkeleton />}>
              <Layout />
            </WithSuspense>
          }
        >
          <Route path={ROUTES.NOTEPADS}>
            <Route index element={<Tasks />} />
            <Route path={ROUTES.NOTEPAD_ID} element={<Tasks />} />
            <Route path={ROUTES.NOTEPAD_TASKS} element={<Tasks />} />
            <Route
              path={ROUTES.TASK_DETAIL}
              element={
                <WithSuspense>
                  <TaskDetail />
                </WithSuspense>
              }
            />
          </Route>

          <Route path={ROUTES.TASKS}>
            <Route index element={<Tasks />} />
            <Route
              path={ROUTES.COMMON_TASK_DETAIL}
              element={
                <WithSuspense>
                  <TaskDetail />
                </WithSuspense>
              }
            />
          </Route>
        </Route>

        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};
