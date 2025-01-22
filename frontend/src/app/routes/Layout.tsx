import { Outlet } from 'react-router';

export const Layout = () => {
  return (
    <div>
      <header>Хедер</header>
      <main>
        <nav>Навигация</nav>
        Заголовок - Задачи
        <Outlet />
      </main>
    </div>
  );
};
