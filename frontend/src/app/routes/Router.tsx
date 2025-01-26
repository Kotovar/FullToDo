import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@app/layout';
import { Main } from '@widgets/Main';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Main isEmptyPage />} />
          <Route path='notepad' element={<Main isEmptyPage />} />
          <Route path='notepad/all' element={<Main />} />
          <Route path='notepad/:notepadId' element={<Main />} />
          <Route path='notepad/today' element={<Main />} />
          <Route path='notepad/:notepadId/task/:taskIds' element={<Main />} />
        </Route>
        <Route path='*' element={<div>Ошибка 404</div>} />
      </Routes>
    </BrowserRouter>
  );
};
