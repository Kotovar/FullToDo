import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { Header } from './Header';
import * as useSearchHook from '../lib/useSearch';

describe('Header component', () => {
  const mockChangeVisibility = vi.fn();
  const mockChange = vi.fn();
  const user = userEvent.setup();
  const typedValue = 'test';

  beforeEach(() => {
    vi.spyOn(useSearchHook, 'useSearch').mockReturnValue({
      value: typedValue,
      onChange: mockChange,
      onClear: vi.fn(),
    });
  });

  test('change input', async () => {
    renderWithRouter(<Header changeVisibility={mockChangeVisibility} />);

    const input = screen.getByPlaceholderText('search.common');
    await user.type(input, typedValue);

    expect(mockChange).toHaveBeenCalled();

    const clearButton = screen.getByRole('button', {
      name: 'search.clear',
    });

    expect(clearButton).toBeInTheDocument();
  });
});
