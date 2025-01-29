import { Button } from '@shared/ui/Button';
import { useNavigate } from 'react-router';

export const Error = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <h1>Страница не найдена</h1>
      <Button appearance='primary' onClick={handleGoBack}>
        Назад
      </Button>
    </div>
  );
};
