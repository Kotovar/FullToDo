interface ErrorFetchingProps {
  message?: string;
}

export const ErrorFetching = ({ message }: ErrorFetchingProps) => (
  <div className='text-center'>
    {message ?? 'Не удалось загрузить данные. Повторите попытку позже'}
  </div>
);
