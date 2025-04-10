import { screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { renderWithRouter } from '@shared/testing';
import { Layout } from './Layout';

describe('Layout', () => {
  test('render correctly', async () => {
    renderWithRouter(<Layout />);

    const heading = screen.getByRole('banner');
    expect(heading).toBeDefined();
  });
});
