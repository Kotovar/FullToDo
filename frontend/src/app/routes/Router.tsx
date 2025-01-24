import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@app/layout';
import { Main } from '@widgets/Main';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path='/'
            element={<Main title='Не выбран ни один блокнот' />}
          />
          <Route path='/today' element={<Main title='Сегодня' />} />
        </Route>
        <Route path='*' element={<div>Ошибка 404</div>} />
      </Routes>
    </BrowserRouter>
  );
};
