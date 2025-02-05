import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@app/layout';
import { Tasks } from '@pages/Tasks';
import { TaskDetail } from '@pages/TaskDetail';
import { Error } from '@pages/Error';
import { Home } from '@pages/Home';
import { ROUTES } from '@sharedCommon/';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />

        <Route element={<Layout />}>
          <Route path={ROUTES.NOTEPADS} element={<Tasks />} />
          <Route path={ROUTES.NOTEPAD_ID} element={<Tasks />} />
          <Route path={ROUTES.TASK_ID} element={<TaskDetail />} />
        </Route>

        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};
