import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Tasks } from '@pages/Tasks';
import { Error } from '@pages/Error';
import { LayoutSkeleton } from '@app/layout/skeleton';
import { ROUTES } from '@sharedCommon';
import { TaskDetailSkeleton } from '@shared/ui';
import { GuestOnlyRoute, ProtectedRoute, RootRedirect } from './guards';
import {
  Account,
  AccountSkeleton,
  AuthPageSkeleton,
  AuthLayout,
  ForgotPassword,
  Layout,
  Login,
  Register,
  ResetPassword,
  TaskDetail,
  VerifyEmailSkeleton,
  VerifyEmail,
} from './components';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<RootRedirect />} />

        <Route element={<GuestOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route
              path={ROUTES.app.login}
              element={
                <Suspense fallback={<AuthPageSkeleton />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.app.register}
              element={
                <Suspense fallback={<AuthPageSkeleton />}>
                  <Register />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.app.forgotPassword}
              element={
                <Suspense fallback={<AuthPageSkeleton />}>
                  <ForgotPassword />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.app.resetPassword}
              element={
                <Suspense fallback={<AuthPageSkeleton />}>
                  <ResetPassword />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route
          path={ROUTES.app.verifyEmail}
          element={
            <Suspense fallback={<VerifyEmailSkeleton />}>
              <VerifyEmail />
            </Suspense>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Suspense fallback={<LayoutSkeleton />}>
                <Layout />
              </Suspense>
            }
          >
            <Route
              path={ROUTES.app.account}
              element={
                <Suspense fallback={<AccountSkeleton />}>
                  <Account />
                </Suspense>
              }
            />

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
