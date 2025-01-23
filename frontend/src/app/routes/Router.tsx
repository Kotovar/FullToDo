import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@app/layout';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<div>Главная страница</div>} />
        </Route>
        <Route path='*' element={<div>Ошибка 404</div>} />
      </Routes>
    </BrowserRouter>
  );
};
