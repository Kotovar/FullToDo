import { BrowserRouter, Route, Routes } from 'react-router';
import { Tasks } from '@pages/Tasks';
import { Error } from '@pages/Error';
import { Home } from '@pages/Home';
import { LayoutSkeleton } from '@app/layout';
import { TaskDetailSkeleton } from '@pages/TaskDetail';
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
          <Route path={ROUTES.NOTEPADS}>
            <Route index element={<Tasks />} />
            <Route path={ROUTES.NOTEPAD_ID} element={<Tasks />} />
            <Route path={ROUTES.NOTEPAD_TASKS} element={<Tasks />} />
            <Route
              path={ROUTES.TASK_DETAIL}
              element={
                <WithSuspense fallback={<TaskDetailSkeleton />}>
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
