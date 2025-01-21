import '@/app/styles';
import { useTaskStore } from '@/app/store/task';
import { useTranslation } from 'react-i18next';

function App() {
  const tasks = useTaskStore(state => state.task);
  const increaseTasks = useTaskStore(state => state.increase);
  const { t, i18n } = useTranslation();

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <h1>{t('test')}</h1>
      <p className='text-xl'>Начало</p>
      <p>{tasks} tasks</p>
      <button className='border-4 bg-slate-100' onClick={increaseTasks}>
        Add task
      </button>
      <button
        className='border-4 bg-slate-100'
        onClick={() => switchLanguage('en')}
      >
        Switch to English
      </button>
      <button
        className='border-4 bg-slate-100'
        onClick={() => switchLanguage('ru')}
      >
        Switch to Russian
      </button>
    </>
  );
}

export default App;
