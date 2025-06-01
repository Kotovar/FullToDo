import * as useNotepadHook from '@pages/Tasks/lib';

export const getUseNotepadMock = (
  isError = false,
  isLoading = false,
  notFound = false,
) => {
  vi.spyOn(useNotepadHook, 'useNotepad').mockReturnValue({
    title: 'test',
    notepadId: '/notepads/:notepadId',
    location: '1',
    isError,
    isLoading,
    notFound,
  });
};
