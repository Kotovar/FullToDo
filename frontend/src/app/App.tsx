import { Router } from '@app/routes';
import { ErrorBoundary, ErrorFallback } from '@shared/ui/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Router />
    </ErrorBoundary>
  );
};

export default App;
