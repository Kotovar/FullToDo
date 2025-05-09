import * as useNotepadHook from '@pages/Tasks/lib';

export const getUseNotepadMock = (isError = false, isLoading = false) => {
  vi.spyOn(useNotepadHook, 'useNotepad').mockReturnValue({
    title: 'test',
    notepadId: '/notepad/:notepadId',
    location: '1',
    isError,
    isLoading,
  });
};
