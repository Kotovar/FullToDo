import { renderHook, act } from '@testing-library/react';
import { createWrapper } from '@shared/mocks';
import { useEditableTitle } from './useEditableTitle';

const initialTitle = 'title';

const getInitialData = async () => {
  const { result } = renderHook(() => useEditableTitle({ initialTitle }), {
    wrapper: createWrapper(),
  });

  return result;
};

describe('useEditableTitle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should handleSaveTitle return if onSaveTitle isn`t exist', async () => {
    const result = await getInitialData();

    const setEditedTitleSpy = vi.spyOn(result.current, 'setEditedTitle');

    act(() => {
      result.current.titleMethods.onBlur();
    });

    expect(setEditedTitleSpy).not.toBeCalled();
  });
});
