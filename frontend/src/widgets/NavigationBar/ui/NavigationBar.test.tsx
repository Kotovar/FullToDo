import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, setupMockServer } from '@shared/testing';
import { MOCK_NOTEPADS_RESPONSE } from '@shared/mocks/';
import { NavigationBar } from './NavigationBar';
import * as useNotepadsHook from './hooks/useNotepads';

const getUseNotepadsMockWithRender = (
  isError = false,
  createNotepad = vi.fn(),
  updateNotepadTitle = vi.fn(),
  deleteNotepad = vi.fn(),
  notepads = MOCK_NOTEPADS_RESPONSE.data ?? [],
) => {
  vi.spyOn(useNotepadsHook, 'useNotepads').mockReturnValue({
    notepads,
    isLoading: false,
    isError,
    methods: {
      createNotepad,
      updateNotepadTitle,
      deleteNotepad,
    },
  });

  renderWithRouter(<NavigationBar isHidden={false} />, {
    initialEntries: ['/notepads'],
    path: '/notepads',
  });
};

describe('NavigationBar component', () => {
  const user = userEvent.setup();
  const createNotepadMock = vi.fn();
  setupMockServer();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('a notebook should be created if the notebook name is specified and Enter or the Save button is pressed', async () => {
    getUseNotepadsMockWithRender(false, createNotepadMock);

    const input = screen.getByPlaceholderText('notepads.add');
    await user.type(input, 'Новое название');
    expect(input).toHaveValue('Новое название');

    const addButton = screen.getByLabelText('notepads.add');
    await user.click(addButton);

    expect(input).toHaveValue('');
    expect(createNotepadMock).toHaveBeenCalledWith('Новое название');

    await user.type(input, 'Новое название 2');
    expect(input).toHaveValue('Новое название 2');

    await user.type(input, '{enter}');
    expect(input).toHaveValue('');
    expect(createNotepadMock).toHaveBeenCalledWith('Новое название 2');
  });
});
