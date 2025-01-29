import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@app/layout';
import { Tasks } from '@pages/Tasks';
import { TaskDetail } from '@pages/TaskDetail';
import { Error } from '@pages/Error';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<Tasks />} />
          <Route path='/' element={<Error />} />
          <Route path='notepad' element={<Error />} />
          <Route path='notepad/all' element={<Tasks />} />
          <Route path='notepad/:notepadId' element={<Tasks />} />
          <Route path='notepad/today' element={<Tasks />} />
          <Route
            path='notepad/:notepadId/task/:taskIds'
            element={<TaskDetail />}
          />
        </Route>
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};
