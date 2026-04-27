import { screen } from '@testing-library/react';
import { Error } from './Error';
import { renderWithRouter } from '@shared/testing';

describe('Error page', () => {
  test('renders not found state with actions', () => {
    renderWithRouter(<Error />, {
      initialEntries: ['/unknown-route'],
      path: '*',
    });

    expect(
      screen.getByRole('heading', { name: 'errors.notFound' }),
    ).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'back' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'errors.goHome' })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
