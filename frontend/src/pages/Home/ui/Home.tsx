import { Link } from 'react-router';
import { ROUTES } from '@sharedCommon/';

export const Home = () => {
  return (
    <div className='mt-2 flex flex-col items-center justify-center gap-4'>
      <h1>Домашняя страница</h1>
      <Link className='border-accent m-2 border-2 p-2' to={ROUTES.TASKS}>
        Открыть блокноты
      </Link>
    </div>
  );
};
