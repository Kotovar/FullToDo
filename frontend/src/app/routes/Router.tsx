import { BrowserRouter, Route, Routes } from 'react-router';
import { Tasks } from '@pages/Tasks';
import { Error } from '@pages/Error';
import { Home } from '@pages/Home';
import { LayoutSkeleton } from '@app/layout/skeleton';
import { TaskDetailSkeleton } from '@shared/ui';
import { ROUTES } from '@sharedCommon/';
import { WithSuspense } from './utils';
import { Layout, TaskDetail } from './components';

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
          <Route path={ROUTES.notepads.base}>
            <Route index element={<Tasks />} />
            <Route path={ROUTES.notepads.byId} element={<Tasks />} />
            <Route path={ROUTES.notepads.tasks} element={<Tasks />} />
            <Route
              path={ROUTES.notepads.taskDetail}
              element={
                <WithSuspense fallback={<TaskDetailSkeleton />}>
                  <TaskDetail />
                </WithSuspense>
              }
            />
          </Route>

          <Route path={ROUTES.tasks.base}>
            <Route index element={<Tasks />} />
            <Route
              path={ROUTES.tasks.byId}
              element={
                <WithSuspense fallback={<TaskDetailSkeleton />}>
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
