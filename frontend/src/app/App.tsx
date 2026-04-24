import { Router } from '@app/routes';
import { AuthProvider } from '@app/providers';
import { ToastContainer, Slide } from 'react-toastify';
import { useDarkToast } from '@app/layout/hooks';
import { ErrorBoundary, ErrorFallback } from '@shared/ui';
import { useDarkMode } from '@shared/lib';

const App = () => {
  useDarkMode();
  const { theme } = useDarkToast();

  return (
    <ErrorBoundary
      fallback={(_error, reset) => <ErrorFallback reset={reset} />}
    >
      <AuthProvider>
        <Router />
      </AuthProvider>
      <ToastContainer
        toastClassName={
          'relative flex p-40 min-h-10 rounded-md cursor-pointer text-dark bg-red-50'
        }
        position='top-right'
        transition={Slide}
        autoClose={1500}
        hideProgressBar={true}
        limit={3}
        theme={theme}
        closeOnClick
        draggable
        stacked
      />
    </ErrorBoundary>
  );
};

export default App;
