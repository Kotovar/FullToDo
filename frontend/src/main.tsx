import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@app/App';
import '@shared/i18n';
import '@app/styles';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}
