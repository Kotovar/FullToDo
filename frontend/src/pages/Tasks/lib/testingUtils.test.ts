import * as useNotepadHook from '@pages/Tasks/lib';
import { getUseNotepadMock } from '@pages/Tasks/lib';

describe('getUseNotepadMock', () => {
  test('должен возвращать дефолтные значения при вызове без параметров', () => {
    vi.spyOn(useNotepadHook, 'useNotepad').mockReturnValue({
      title: 'test',
      notepadId: '/notepad/:notepadId',
      location: '1',
      isError: false,
      isLoading: false,
    });
    getUseNotepadMock();
    const result = useNotepadHook.useNotepad();

    expect(result).toEqual({
      title: 'test',
      notepadId: '/notepad/:notepadId',
      location: '1',
      isError: false,
      isLoading: false,
    });
  });
});
