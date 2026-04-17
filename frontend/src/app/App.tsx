import { Router } from '@app/routes';
import { AuthProvider } from '@app/providers';
import { ErrorBoundary, ErrorFallback } from '@shared/ui/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
