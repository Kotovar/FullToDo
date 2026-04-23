import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { i18nForTests } from '@shared/testing';
import { AuthLayout } from './AuthLayout';

vi.mock('@widgets/Header', () => ({
  AdditionalActions: ({ showAccountLink }: { showAccountLink?: boolean }) => (
    <div data-testid='guest-actions'>{String(showAccountLink)}</div>
  ),
}));

vi.mock('@features/auth', () => ({
  GoogleAuthSection: () => <div>google-auth-section</div>,
  getLoginRedirectTarget: () => '/tasks',
}));

describe('AuthLayout', () => {
  test('renders guest actions without account link', () => {
    render(
      <I18nextProvider i18n={i18nForTests}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path='/login' element={<div>login-form</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </I18nextProvider>,
    );

    expect(screen.getByTestId('guest-actions')).toHaveTextContent('false');
    expect(screen.getByText('google-auth-section')).toBeInTheDocument();
    expect(screen.getByText('login-form')).toBeInTheDocument();
  });
});
