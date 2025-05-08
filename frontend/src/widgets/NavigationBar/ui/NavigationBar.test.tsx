import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@shared/testing';
import { MOCK_NOTEPADS_RESPONSE } from '@shared/mocks/';
import { setupMockServer } from '@shared/config';
import { NavigationBar } from './NavigationBar';
import * as useNotepadsHook from '@widgets/NavigationBar/lib';

const NOTEPAD_INDEX = 2;

const getUseNotepadsMockWithRender = (
  isError = false,
  createNotepad = vi.fn(),
  updateNotepadTitle = vi.fn(),
  deleteNotepad = vi.fn(),
  notepads = MOCK_NOTEPADS_RESPONSE.data,
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

const getElements = (
  element: 'menu' | 'delete' | 'rename' | 'input' | string,
) => {
  switch (element) {
    case 'menu':
      return screen.getAllByLabelText('Дополнительное меню')[NOTEPAD_INDEX];
    case 'delete':
      return screen.getByText('Удалить');
    case 'rename':
      return screen.getByText('Переименовать');
    case 'input':
      return screen.getAllByRole('textbox')[NOTEPAD_INDEX];
    default:
      return screen.getByPlaceholderText(element);
  }
};

describe('NavigationBar component', () => {
  const user = userEvent.setup();
  const createNotepadMock = vi.fn();
  const updateNotepadTitleMock = vi.fn();
  const deleteNotepadTitleMock = vi.fn();
  setupMockServer();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Создаётся блокнот, если указано название блокнота и нажат Enter', async () => {
    getUseNotepadsMockWithRender(false, createNotepadMock);

    const input = getElements('Добавить блокнот');
    await user.type(input, 'Новое название{enter}');

    expect(createNotepadMock).toHaveBeenCalledWith('Новое название');
  });

  test('Меняется название блокнота, если новое название не совпадает со старым', async () => {
    getUseNotepadsMockWithRender(
      false,
      createNotepadMock,
      updateNotepadTitleMock,
    );

    const menuButton = getElements('menu');
    await user.click(menuButton);
    await user.click(getElements('rename'));

    const input = getElements('input');
    await user.clear(input);
    await user.type(input, 'Новое');

    const addButton = screen.getByLabelText('Добавить блокнот');
    await user.click(addButton);

    expect(updateNotepadTitleMock).toHaveBeenCalledWith(
      MOCK_NOTEPADS_RESPONSE.data[NOTEPAD_INDEX]._id,
      'Новое',
    );
  });

  test('Не меняется название блокнота, если новое название совпадает со старым', async () => {
    getUseNotepadsMockWithRender(
      false,
      createNotepadMock,
      updateNotepadTitleMock,
    );

    const menuButton = getElements('menu');
    await user.click(menuButton);
    await user.click(getElements('rename'));

    const input = getElements('input');
    await user.clear(input);
    await user.type(input, 'Рабочее{enter}');

    expect(updateNotepadTitleMock).not.toHaveBeenCalled();
  });

  test('вызывается deleteNotepad при удалении блокнота', async () => {
    getUseNotepadsMockWithRender(
      false,
      createNotepadMock,
      updateNotepadTitleMock,
      deleteNotepadTitleMock,
    );

    const menuButton = getElements('menu');
    await user.click(menuButton);

    const deleteButton = getElements('delete');
    await user.click(deleteButton);
    expect(deleteNotepadTitleMock).toHaveBeenCalled();
  });
});
