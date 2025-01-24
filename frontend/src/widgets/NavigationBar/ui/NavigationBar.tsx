import { Notebook } from '@shared/ui';

export const NavigationBar = () => {
  const MOCK_DATA = ['Сегодня', 'Задачи', 'Рабочее', 'Дом', 'Быт'];

  return (
    <nav className='hidden bg-white p-4 sm:col-span-1 sm:block'>
      <ul className='flex flex-col gap-1'>
        {MOCK_DATA.map((task, i) => (
          <Notebook
            classname='text-2xl text-text break-words'
            name={task}
            key={i}
          />
        ))}
      </ul>
    </nav>
  );
};
