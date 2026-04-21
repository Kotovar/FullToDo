import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import Layout from './Layout';

vi.mock('@widgets/Header', () => ({
  Header: () => <header role='banner'>header</header>,
}));

vi.mock('@widgets/NavigationBar', () => ({
  NavigationBar: () => <nav data-testid='navigation-bar'>navigation</nav>,
}));

describe('Layout', () => {
  test('render correctly', () => {
    renderWithRouter(<Layout />);

    const heading = screen.getByRole('banner');
    expect(heading).toBeInTheDocument();
  });

  test('hides navigation bar on account page', () => {
    renderWithRouter(<Layout />, {
      initialEntries: ['/account'],
      path: '/account',
    });

    expect(screen.queryByTestId('navigation-bar')).not.toBeInTheDocument();
  });

  test('shows navigation bar on tasks page', () => {
    renderWithRouter(<Layout />, {
      initialEntries: ['/tasks'],
      path: '/tasks',
    });

    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });
});
