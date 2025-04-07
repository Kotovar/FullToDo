import { createRoot } from 'react-dom/client';
import { describe, test } from 'vitest';
import App from './App';

describe('App', () => {
  test('Рендер без крашей', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<App />);
  });
});
