import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Tasks } from '@pages/Tasks';
import { Error } from '@pages/Error';
import { Login } from '@pages/Login';
import { Register } from '@pages/Register';
import { LayoutSkeleton } from '@app/layout/skeleton';
import { ROUTES } from '@sharedCommon';
import { TaskDetailSkeleton } from '@shared/ui';
import { GuestOnlyRoute, ProtectedRoute, RootRedirect } from './guards';
import { AuthLayout, Layout, TaskDetail } from './components';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<RootRedirect />} />

        <Route element={<GuestOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.app.login} element={<Login />} />
            <Route path={ROUTES.app.register} element={<Register />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Suspense fallback={<LayoutSkeleton />}>
                <Layout />
              </Suspense>
            }
          >
            <Route path={ROUTES.notepads.base}>
              <Route index element={<Tasks />} />
              <Route path={ROUTES.notepads.byId} element={<Tasks />} />
              <Route path={ROUTES.notepads.tasks} element={<Tasks />} />
              <Route
                path={ROUTES.notepads.taskDetail}
                element={
                  <Suspense fallback={<TaskDetailSkeleton />}>
                    <TaskDetail />
                  </Suspense>
                }
              />
            </Route>

            <Route path={ROUTES.tasks.base}>
              <Route index element={<Tasks />} />
              <Route
                path={ROUTES.tasks.byId}
                element={
                  <Suspense fallback={<TaskDetailSkeleton />}>
                    <TaskDetail />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Route>

        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};
