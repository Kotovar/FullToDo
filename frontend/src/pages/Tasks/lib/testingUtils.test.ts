import * as useNotepadHook from '@pages/Tasks/lib';
import { getUseNotepadMock } from '@pages/Tasks/lib';

describe('getUseNotepadMock', () => {
  test('should return default values when called without parameters', () => {
    vi.spyOn(useNotepadHook, 'useNotepad').mockReturnValue({
      title: 'test',
      notepadId: '/notepads/:notepadId',
      location: '1',
      isError: false,
      isLoading: false,
      notFound: false,
    });
    getUseNotepadMock();
    const result = useNotepadHook.useNotepad();

    expect(result).toEqual({
      title: 'test',
      notepadId: '/notepads/:notepadId',
      location: '1',
      isError: false,
      isLoading: false,
      notFound: false,
    });
  });
});
