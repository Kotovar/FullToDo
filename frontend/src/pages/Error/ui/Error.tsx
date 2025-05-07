import { useBackNavigate } from '@shared/lib';
import { Button } from '@shared/ui';

export const Error = () => {
  const handleGoBack = useBackNavigate();

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <h1>Страница не найдена</h1>
      <Button appearance='primary' onClick={handleGoBack}>
        Назад
      </Button>
    </div>
  );
};
