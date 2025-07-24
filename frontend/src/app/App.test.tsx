import { createRoot } from 'react-dom/client';
import App from './App';

describe('App', () => {
  test('should render correctly', () => {
    const div = document.createElement('div');
    const root = createRoot(div);

    root.render(<App />);
  });
});
