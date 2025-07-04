import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@shared/ui';

interface TaskTitleProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TaskTitle = memo(({ value, onChange }: TaskTitleProps) => {
  const { t } = useTranslation();

  return (
    <h1>
      <label htmlFor='taskTitleInput' className='sr-only'>
        {t('tasks.title')}
      </label>

      <Input
        type='text'
        value={value}
        onChange={onChange}
        className='w-full p-2 outline-0'
        id='taskTitleInput'
      />
    </h1>
  );
});
