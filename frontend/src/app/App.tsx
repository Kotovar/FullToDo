import { Router } from '@app/routes';
import { ErrorBoundary, ErrorFallback } from '@shared/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
