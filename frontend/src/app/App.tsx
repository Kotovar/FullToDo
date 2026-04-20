import { Router } from '@app/routes';
import { AuthProvider } from '@app/providers';
import { ErrorBoundary, ErrorFallback } from '@shared/ui';
import { useDarkMode } from '@shared/lib';

const App = () => {
  useDarkMode();

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
